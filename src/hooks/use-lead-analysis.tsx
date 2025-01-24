import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLeadAnalysis = (leadId?: string) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    if (leadId) {
      fetchAnalysis(leadId);
    }
  }, [leadId]);

  const fetchAnalysis = async (id: string) => {
    console.log('Fetching analysis for lead:', id);
    const { data, error } = await supabase
      .from('lead_activities')
      .select('description')
      .eq('lead_id', id)
      .eq('activity_type', 'ai_analysis')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching analysis:', error);
      return;
    }

    if (data) {
      console.log('Found analysis:', data.description);
      setAnalysis(data.description);
    }
  };

  const analyzeLead = async (id: string) => {
    setIsAnalyzing(true);
    try {
      console.log('Starting lead analysis for:', id);
      const { data, error } = await supabase.functions.invoke('analyze-lead', {
        body: { leadId: id }
      });

      if (error) {
        console.error('Error analyzing lead:', error);
        toast({
          title: "Analysis Failed",
          description: "Could not complete lead analysis",
          variant: "destructive",
        });
        return null;
      }

      if (data.analysis) {
        toast({
          title: "Analysis Complete",
          description: "Lead analysis has been added to activities",
        });
        await fetchAnalysis(id);
        return data.analysis;
      } else {
        toast({
          title: "Analysis Skipped",
          description: "Analysis is only performed for business email domains",
        });
      }

      return null;
    } catch (error) {
      console.error('Error in analyzeLead:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during analysis",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeLead,
    isAnalyzing,
    analysis
  };
};
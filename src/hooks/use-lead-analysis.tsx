import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLeadAnalysis = (leadId?: string) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [hasBeenAnalyzed, setHasBeenAnalyzed] = useState(false);

  useEffect(() => {
    if (leadId) {
      checkAndFetchAnalysis(leadId);
    }
  }, [leadId]);

  const checkAndFetchAnalysis = async (id: string) => {
    console.log('Checking analysis status for lead:', id);
    const { data, error } = await supabase
      .from('lead_activities')
      .select('description')
      .eq('lead_id', id)
      .eq('activity_type', 'ai_analysis')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking analysis:', error);
      return;
    }

    if (data) {
      console.log('Found existing analysis');
      setAnalysis(data.description);
      setHasBeenAnalyzed(true);
    } else {
      setHasBeenAnalyzed(false);
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
        await checkAndFetchAnalysis(id);
        return data.analysis;
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
    analysis,
    hasBeenAnalyzed
  };
};
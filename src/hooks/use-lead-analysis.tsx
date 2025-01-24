import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLeadAnalysis = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeLead = async (leadId: string) => {
    setIsAnalyzing(true);
    try {
      console.log('Starting lead analysis for:', leadId);
      const { data, error } = await supabase.functions.invoke('analyze-lead', {
        body: { leadId }
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
      } else {
        toast({
          title: "Analysis Skipped",
          description: "Analysis is only performed for business email domains",
        });
      }

      return data.analysis;
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
    isAnalyzing
  };
};
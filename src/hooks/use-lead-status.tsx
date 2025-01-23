import { useState } from "react";
import { Lead, LeadStatus } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/utils/activity-logger";
import { calculateBeamScore } from "@/utils/scoring";

export const useLeadStatus = (lead: Lead | null, onLeadUpdate: () => void) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: LeadStatus) => {
    if (!lead) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", lead.id);

      if (error) throw error;

      await calculateBeamScore({ ...lead, status: newStatus });
      await logActivity(lead.id, "status_updated", `Lead status updated to ${newStatus}`);
      
      toast({
        title: "Status updated",
        description: `Lead status has been updated to ${newStatus}`,
      });
      
      onLeadUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    handleStatusUpdate,
  };
};
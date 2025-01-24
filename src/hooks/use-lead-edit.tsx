import { useState, useEffect } from "react";
import { Lead } from "@/types/lead";
import { validateLead } from "@/components/leads/details/LeadValidation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/utils/activity-logger";
import { calculateBeamScore } from "@/utils/scoring";
import { convertToDatabaseLead } from "@/types/lead";

export const useLeadEdit = (lead: Lead | null, onLeadUpdate: () => void) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead>({} as Lead);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      console.log('Initializing editedLead with:', lead);
      setEditedLead(lead);
    }
  }, [lead]);

  const handleEdit = async () => {
    if (!lead?.id || !editedLead?.id) {
      console.error('Invalid lead data:', { leadId: lead?.id, editedLeadId: editedLead?.id });
      toast({
        title: "Error",
        description: "Invalid lead data. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    const errors = validateLead(editedLead);
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before saving",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      console.log('Converting lead for database:', editedLead);
      const dbLead = convertToDatabaseLead(editedLead);
      
      // Remove the id from the update payload to prevent primary key conflicts
      const { id, ...updatePayload } = dbLead;
      
      const { error } = await supabase
        .from("leads")
        .update(updatePayload)
        .eq("id", lead.id);

      if (error) {
        console.error('Error updating lead:', error);
        throw error;
      }

      await calculateBeamScore(editedLead);
      console.log("BEAM Score recalculated after edit");

      await logActivity(lead.id, "lead_updated", "Lead details were updated");

      toast({
        title: "Lead updated",
        description: "Lead details have been successfully updated",
      });
      
      onLeadUpdate();
      setIsEditing(false);
      setValidationErrors({});
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description: "Failed to update lead details",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    isEditing,
    editedLead,
    validationErrors,
    setIsEditing,
    setEditedLead: (lead: Lead) => setEditedLead(lead), // Ensure we're accepting a full Lead type
    handleEdit,
    setValidationErrors,
  };
};
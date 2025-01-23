import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Lead, LeadStatus, EmailAddress, convertToDatabaseLead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/utils/activity-logger";
import ActivityLog from "./ActivityLog";
import { calculateBeamScore } from "@/utils/scoring";
import { LeadIdentification } from "./details/LeadIdentification";
import { LeadContact } from "./details/LeadContact";
import { LeadOnlinePresence } from "./details/LeadOnlinePresence";
import { LeadLocation } from "./details/LeadLocation";
import { LeadStatusUpdate } from "./details/LeadStatusUpdate";
import ScoreBreakdown from "./scoring/ScoreBreakdown";
import ScoreHistory from "./scoring/ScoreHistory";
import { LeadScoringCriteria } from "./details/LeadScoringCriteria";
import { validateLead } from "./details/LeadValidation";
import { LeadEditActions } from "./details/LeadEditActions";
import { LeadFormField } from "./details/LeadFormField";

interface LeadDetailsProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: () => void;
}

const LeadDetails = ({ lead, isOpen, onClose, onLeadUpdate }: LeadDetailsProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      setEditedLead(lead);
    }
  }, [lead]);

  useEffect(() => {
    if (!lead) return;

    const channel = supabase
      .channel(`lead_${lead.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
          filter: `id=eq.${lead.id}`,
        },
        async (payload) => {
          const updatedLead = payload.new as Lead;
          if (
            payload.eventType === "UPDATE" &&
            (
              updatedLead.status !== (payload.old as Lead).status ||
              updatedLead.call_count !== (payload.old as Lead).call_count ||
              updatedLead.budget_range !== (payload.old as Lead).budget_range ||
              updatedLead.decision_maker_level !== (payload.old as Lead).decision_maker_level ||
              updatedLead.need_urgency !== (payload.old as Lead).need_urgency ||
              updatedLead.project_timeline !== (payload.old as Lead).project_timeline
            )
          ) {
            await calculateBeamScore(updatedLead);
          }
          onLeadUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lead, onLeadUpdate]);

  const handleStatusUpdate = async (newStatus: LeadStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", lead?.id);

      if (error) throw error;

      if (lead) {
        await calculateBeamScore({ ...lead, status: newStatus });
      }
      
      await logActivity(lead?.id || "", "status_updated", `Lead status updated to ${newStatus}`);
      
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

  const handleEdit = async () => {
    if (!lead || !editedLead) return;
    
    const errors = validateLead(editedLead);
    if (Object.keys(errors).length > 0) {
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
      const dbLead = convertToDatabaseLead(editedLead);
      console.log('Converting lead for database:', dbLead);
      
      const { error } = await supabase
        .from("leads")
        .update(dbLead)
        .eq("id", lead.id);

      if (error) throw error;

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

  const onAddEmail = () => {
    const newEmails: EmailAddress[] = [...(editedLead.emails || []), { type: "business", email: "" }];
    setEditedLead({ ...editedLead, emails: newEmails });
  };

  const onRemoveEmail = (index: number) => {
    const newEmails = [...(editedLead.emails || [])];
    newEmails.splice(index, 1);
    setEditedLead({ ...editedLead, emails: newEmails });
  };

  const onEmailChange = (index: number, field: "type" | "email", value: string) => {
    const newEmails = [...(editedLead.emails || [])] as EmailAddress[];
    if (field === "type" && (value === "personal" || value === "business" || value === "other")) {
      newEmails[index] = { ...newEmails[index], [field]: value };
      setEditedLead({ ...editedLead, emails: newEmails });
    } else if (field === "email") {
      newEmails[index] = { ...newEmails[index], [field]: value };
      setEditedLead({ ...editedLead, emails: newEmails });
    }
  };

  const onAddPhoneNumber = () => {
    const newPhoneNumbers = [...(editedLead.phone_numbers || []), ""];
    setEditedLead({ ...editedLead, phone_numbers: newPhoneNumbers });
  };

  const onRemovePhoneNumber = (index: number) => {
    const newPhoneNumbers = [...(editedLead.phone_numbers || [])];
    newPhoneNumbers.splice(index, 1);
    setEditedLead({ ...editedLead, phone_numbers: newPhoneNumbers });
  };

  const onPhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...(editedLead.phone_numbers || [])];
    newPhoneNumbers[index] = value;
    setEditedLead({ ...editedLead, phone_numbers: newPhoneNumbers });
  };

  const onAddDomain = () => {
    const newDomains = [...(editedLead.domains || []), ""];
    setEditedLead({ ...editedLead, domains: newDomains });
  };

  const onRemoveDomain = (index: number) => {
    const newDomains = [...(editedLead.domains || [])];
    newDomains.splice(index, 1);
    setEditedLead({ ...editedLead, domains: newDomains });
  };

  const onDomainChange = (index: number, value: string) => {
    const newDomains = [...(editedLead.domains || [])];
    newDomains[index] = value;
    setEditedLead({ ...editedLead, domains: newDomains });
  };

  const onAddTechnology = (tech: string) => {
    if (!editedLead.technology_stack?.includes(tech)) {
      const newTechStack = [...(editedLead.technology_stack || []), tech];
      setEditedLead({ ...editedLead, technology_stack: newTechStack });
    }
  };

  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto pb-20">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Lead Details</SheetTitle>
            <LeadEditActions
              isEditing={isEditing}
              isUpdating={isUpdating}
              onEdit={() => setIsEditing(true)}
              onSave={handleEdit}
              onCancel={() => {
                setIsEditing(false);
                setEditedLead(lead);
                setValidationErrors({});
              }}
            />
          </div>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <ScoreBreakdown lead={lead} />
          
          <LeadIdentification 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={(label, value, field) => (
              <LeadFormField
                label={label}
                value={value}
                field={field}
                isEditing={isEditing}
                onChange={(value) => setEditedLead({ ...editedLead, [field]: value })}
              />
            )}
          />

          <LeadContact 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={(label, value, field) => (
              <LeadFormField
                label={label}
                value={value}
                field={field}
                isEditing={isEditing}
                onChange={(value) => setEditedLead({ ...editedLead, [field]: value })}
              />
            )}
            onAddEmail={onAddEmail}
            onRemoveEmail={onRemoveEmail}
            onEmailChange={onEmailChange}
            onAddPhoneNumber={onAddPhoneNumber}
            onRemovePhoneNumber={onRemovePhoneNumber}
            onPhoneNumberChange={onPhoneNumberChange}
            validationErrors={validationErrors}
          />

          <LeadOnlinePresence 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={(label, value, field) => (
              <LeadFormField
                label={label}
                value={value}
                field={field}
                isEditing={isEditing}
                onChange={(value) => setEditedLead({ ...editedLead, [field]: value })}
              />
            )}
            validationErrors={validationErrors}
            onAddDomain={onAddDomain}
            onRemoveDomain={onRemoveDomain}
            onDomainChange={onDomainChange}
          />

          <LeadLocation 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={(label, value, field) => (
              <LeadFormField
                label={label}
                value={value}
                field={field}
                isEditing={isEditing}
                onChange={(value) => setEditedLead({ ...editedLead, [field]: value })}
              />
            )}
          />

          <LeadScoringCriteria
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            onAddTechnology={onAddTechnology}
          />

          <ScoreHistory leadId={lead.id} />
          
          <ActivityLog leadId={lead.id} />

          {!isEditing && (
            <LeadStatusUpdate 
              lead={lead}
              isUpdating={isUpdating}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetails;
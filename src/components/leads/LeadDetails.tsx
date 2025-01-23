import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Lead, LeadStatus } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
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
import { LeadEditActions } from "./details/LeadEditActions";
import { useLeadEdit } from "@/hooks/use-lead-edit";
import { useLeadStatus } from "@/hooks/use-lead-status";
import { useLeadContact } from "@/hooks/use-lead-contact";

interface LeadDetailsProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: () => void;
}

const LeadDetails = ({ lead, isOpen, onClose, onLeadUpdate }: LeadDetailsProps) => {
  const {
    isUpdating,
    isEditing,
    editedLead,
    validationErrors,
    setIsEditing,
    setEditedLead,
    handleEdit,
  } = useLeadEdit(lead, onLeadUpdate);

  const { handleStatusUpdate } = useLeadStatus(lead, onLeadUpdate);

  const {
    onAddEmail,
    onRemoveEmail,
    onEmailChange,
    onAddPhoneNumber,
    onRemovePhoneNumber,
    onPhoneNumberChange,
    formatEmails,
    formatPhoneNumbers,
  } = useLeadContact(editedLead, setEditedLead);

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
          />

          <LeadContact 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            onAddEmail={onAddEmail}
            onRemoveEmail={onRemoveEmail}
            onEmailChange={onEmailChange}
            onAddPhoneNumber={onAddPhoneNumber}
            onRemovePhoneNumber={onRemovePhoneNumber}
            onPhoneNumberChange={onPhoneNumberChange}
            formatEmails={formatEmails}
            formatPhoneNumbers={formatPhoneNumbers}
            validationErrors={validationErrors}
          />

          <LeadOnlinePresence 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
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
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
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateBeamScore } from "@/utils/scoring";
import { LeadIdentification } from "./details/LeadIdentification";
import { LeadContact } from "./details/LeadContact";
import { LeadOnlinePresence } from "./details/LeadOnlinePresence";
import { LeadLocation } from "./details/LeadLocation";
import { LeadStatusUpdate } from "./details/LeadStatusUpdate";
import ScoreBreakdown from "./scoring/ScoreBreakdown";
import ScoreHistory from "./scoring/ScoreHistory";
import { LeadScoringCriteria } from "./details/LeadScoringCriteria";
import { LeadActions } from "./details/LeadActions";
import { validateLead } from "./details/LeadValidation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
          // Recalculate score if relevant fields changed
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

      // Recalculate score immediately after status update
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

  const formatEmails = (emails: EmailAddress[] | null) => {
    if (!emails || emails.length === 0) return "-";
    return emails.map(e => `${e.type}: ${e.email}`).join(", ");
  };

  const formatPhoneNumbers = (numbers: string[] | null) => {
    if (!numbers || numbers.length === 0) return "-";
    return numbers.join(", ");
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

  const onAddTechnology = (tech: string) => {
    const currentTech = editedLead.technology_stack || [];
    if (!currentTech.includes(tech)) {
      setEditedLead({
        ...editedLead,
        technology_stack: [...currentTech, tech],
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLead(lead || {});
    setValidationErrors({});
  };

  const renderField = (label: string, value: string | null, field: keyof Lead) => (
    <div>
      <label className="text-sm text-muted-foreground">{label}</label>
      {isEditing ? (
        field === 'message' ? (
          <Textarea
            value={editedLead[field] as string || ''}
            onChange={(e) => setEditedLead({ ...editedLead, [field]: e.target.value })}
            className="mt-1"
          />
        ) : (
          <Input
            value={editedLead[field] as string || ''}
            onChange={(e) => setEditedLead({ ...editedLead, [field]: e.target.value })}
            className="mt-1"
          />
        )
      ) : (
        <p className="whitespace-pre-wrap">{value || "-"}</p>
      )}
    </div>
  );

  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto pb-20">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Lead Details</SheetTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <ScoreBreakdown lead={lead} />
          
          <LeadIdentification 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={renderField}
          />

          <LeadContact 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={renderField}
            formatEmails={formatEmails}
            formatPhoneNumbers={formatPhoneNumbers}
            onAddEmail={onAddEmail}
            onRemoveEmail={onRemoveEmail}
            onEmailChange={onEmailChange}
            validationErrors={validationErrors}
          />

          <LeadOnlinePresence 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={renderField}
            validationErrors={validationErrors}
          />

          <LeadLocation 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={renderField}
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

        <LeadActions
          isEditing={isEditing}
          isUpdating={isUpdating}
          onSave={handleEdit}
          onCancel={handleCancel}
        />
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetails;
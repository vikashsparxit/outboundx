import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Lead, LeadStatus, convertToDatabaseLead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/utils/activity-logger";
import ActivityLog from "./ActivityLog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Plus, X } from "lucide-react";
import { calculateBeamScore } from "@/utils/scoring";
import { LeadIdentification } from "./details/LeadIdentification";
import { LeadContact } from "./details/LeadContact";
import { LeadOnlinePresence } from "./details/LeadOnlinePresence";
import { LeadLocation } from "./details/LeadLocation";
import { LeadStatusUpdate } from "./details/LeadStatusUpdate";
import ScoreBreakdown from "./scoring/ScoreBreakdown";
import ScoreHistory from "./scoring/ScoreHistory";
import { LeadScoringCriteria } from "./details/LeadScoringCriteria";
import { z } from "zod";

// Email validation schema
const emailSchema = z.string().email();
const websiteSchema = z.string().url().optional().or(z.literal(""));

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

  // Subscribe to real-time updates for the lead
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validate website
    if (editedLead.website) {
      try {
        websiteSchema.parse(editedLead.website);
      } catch (error) {
        errors.website = "Please enter a valid URL";
      }
    }

    // Validate email
    if (editedLead.email) {
      try {
        emailSchema.parse(editedLead.email);
      } catch (error) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Validate emails array
    if (editedLead.emails) {
      editedLead.emails.forEach((emailObj, index) => {
        try {
          emailSchema.parse(emailObj.email);
        } catch (error) {
          errors[`emails.${index}`] = "Please enter a valid email address";
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStatusUpdate = async (newStatus: LeadStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", lead.id);

      if (error) throw error;

      // Recalculate score immediately after status update
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

  const handleEdit = async () => {
    if (!lead || !editedLead) return;
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before saving",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      // Convert EmailAddress[] to Json before sending to Supabase
      const databaseLead = convertToDatabaseLead(editedLead);
      
      const { error } = await supabase
        .from("leads")
        .update(databaseLead)
        .eq("id", lead.id);

      if (error) throw error;

      // Recalculate score immediately after update
      const newScores = await calculateBeamScore(editedLead);
      console.log("New scores calculated:", newScores);

      await logActivity(lead.id, "lead_updated", "Lead details were updated");

      toast({
        title: "Lead updated",
        description: "Lead details have been successfully updated",
      });
      
      onLeadUpdate();
      setIsEditing(false);
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

  const handleAddEmail = () => {
    const currentEmails = editedLead.emails || [];
    setEditedLead({
      ...editedLead,
      emails: [...currentEmails, { type: "business", email: "" }]
    });
  };

  const handleRemoveEmail = (index: number) => {
    const currentEmails = editedLead.emails || [];
    setEditedLead({
      ...editedLead,
      emails: currentEmails.filter((_, i) => i !== index)
    });
  };

  const handleEmailChange = (index: number, field: "type" | "email", value: string) => {
    const currentEmails = [...(editedLead.emails || [])];
    currentEmails[index] = {
      ...currentEmails[index],
      [field]: value
    };
    setEditedLead({
      ...editedLead,
      emails: currentEmails
    });
  };

  const handleAddTechnology = (tech: string) => {
    const currentStack = editedLead.technology_stack || [];
    if (!currentStack.includes(tech)) {
      setEditedLead({
        ...editedLead,
        technology_stack: [...currentStack, tech]
      });
    }
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
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
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
            formatEmails={(emails) => {
              if (!emails) return "-";
              return emails.map(e => `${e.type}: ${e.email}`).join(", ");
            }}
            formatPhoneNumbers={(numbers) => {
              if (!numbers) return "-";
              return numbers.join(", ");
            }}
            onAddEmail={handleAddEmail}
            onRemoveEmail={handleRemoveEmail}
            onEmailChange={handleEmailChange}
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
            onAddTechnology={handleAddTechnology}
          />

          <ScoreHistory leadId={lead.id} />
          
          <ActivityLog leadId={lead.id} />

          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleEdit} disabled={isUpdating}>
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditedLead(lead);
                  setValidationErrors({});
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          ) : (
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

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { logActivity } from "@/utils/activity-logger";
import ActivityLog from "./ActivityLog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";
import { calculateBeamScore } from "@/utils/scoring";
import { LeadIdentification } from "./details/LeadIdentification";
import { LeadContact } from "./details/LeadContact";
import { LeadOnlinePresence } from "./details/LeadOnlinePresence";
import { LeadLocation } from "./details/LeadLocation";
import { LeadStatusUpdate } from "./details/LeadStatusUpdate";
import ScoreBreakdown from "./scoring/ScoreBreakdown";
import ScoreHistory from "./scoring/ScoreHistory";

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

  useEffect(() => {
    if (lead) {
      setEditedLead(lead);
    }
  }, [lead]);

  useEffect(() => {
    if (!lead) return;

    // Subscribe to real-time updates for the lead
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

  const formatEmails = (emails: any[] | null) => {
    if (!emails) return "-";
    return emails.map(e => `${e.type}: ${e.email}`).join(", ");
  };

  const formatPhoneNumbers = (numbers: string[] | null) => {
    if (!numbers) return "-";
    return numbers.join(", ");
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "PPp");
  };

  const handleEdit = async () => {
    if (!lead || !editedLead) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({
          website: editedLead.website,
          email: editedLead.email,
          domain: editedLead.domain,
          phone_numbers: editedLead.phone_numbers,
          subject: editedLead.subject,
          message: editedLead.message,
          lead_type: editedLead.lead_type,
          client_type: editedLead.client_type,
          country: editedLead.country,
          city: editedLead.city,
          state: editedLead.state,
          budget_range: editedLead.budget_range,
          decision_maker_level: editedLead.decision_maker_level,
          need_urgency: editedLead.need_urgency,
          project_timeline: editedLead.project_timeline,
          company_size: editedLead.company_size,
          industry_vertical: editedLead.industry_vertical,
          annual_revenue_range: editedLead.annual_revenue_range,
          technology_stack: editedLead.technology_stack
        })
        .eq("id", lead.id);

      if (error) throw error;

      await calculateBeamScore(editedLead);
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

  const handleStatusUpdate = async (newStatus: Lead['status']) => {
    if (!lead) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", lead.id);

      if (error) throw error;

      await logActivity(
        lead.id,
        "status_update",
        `Lead status updated to ${newStatus}`
      );

      toast({
        title: "Status updated",
        description: `Lead status has been updated to ${newStatus}`,
      });
      onLeadUpdate();
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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
            formatEmails={formatEmails}
            formatPhoneNumbers={formatPhoneNumbers}
          />

          <LeadOnlinePresence 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={renderField}
          />

          <LeadLocation 
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={renderField}
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

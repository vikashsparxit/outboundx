import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/types/lead";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { logActivity } from "@/utils/activity-logger";
import ActivityLog from "./ActivityLog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";

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
  const { user } = useAuth();

  useEffect(() => {
    if (lead) {
      setEditedLead(lead);
    }
  }, [lead]);

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
        })
        .eq("id", lead.id);

      if (error) throw error;

      await logActivity(
        lead.id,
        "lead_updated",
        "Lead details were updated"
      );

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

  const handleStatusUpdate = async (newStatus: "new" | "contacted" | "in_progress" | "closed_won" | "closed_lost") => {
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

  if (!lead) return null;

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
          {/* Identification Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Identification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Lead ID</label>
                <p className="truncate">{lead.id}</p>
              </div>
              {renderField("Ticket ID", lead.ticket_id, "ticket_id")}
              {renderField("Contact ID", lead.contact_id, "contact_id")}
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p><Badge>{lead.status}</Badge></p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-muted-foreground">Emails</label>
                <p>{formatEmails(lead.emails)}</p>
              </div>
              {renderField("Primary Email", lead.email, "email")}
              <div>
                <label className="text-sm text-muted-foreground">Phone Numbers</label>
                <p>{formatPhoneNumbers(lead.phone_numbers)}</p>
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Online Presence</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderField("Website", lead.website, "website")}
              {renderField("Domain", lead.domain, "domain")}
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderField("Country", lead.country, "country")}
              {renderField("City", lead.city, "city")}
              {renderField("State", lead.state, "state")}
              {renderField("IP Country", lead.ip_country, "ip_country")}
              {renderField("IP Region", lead.ip_region, "ip_region")}
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Lead Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderField("Lead Type", lead.lead_type, "lead_type")}
              {renderField("Client Type", lead.client_type, "client_type")}
              {renderField("Subject", lead.subject, "subject")}
              <div>
                <label className="text-sm text-muted-foreground">Handled</label>
                <p>{lead.handled ? "Yes" : "No"}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Message</label>
              <p className="whitespace-pre-wrap">{lead.message || "-"}</p>
            </div>
          </div>

          {/* Activity Log */}
          <ActivityLog leadId={lead.id} />

          {isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                disabled={isUpdating}
              >
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
            /* Status Update Section */
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Update Status</h3>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || lead.status === "new"}
                  onClick={() => handleStatusUpdate("new")}
                >
                  New
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || lead.status === "contacted"}
                  onClick={() => handleStatusUpdate("contacted")}
                >
                  Contacted
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || lead.status === "in_progress"}
                  onClick={() => handleStatusUpdate("in_progress")}
                >
                  In Progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || lead.status === "closed_won"}
                  onClick={() => handleStatusUpdate("closed_won")}
                >
                  Closed Won
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || lead.status === "closed_lost"}
                  onClick={() => handleStatusUpdate("closed_lost")}
                >
                  Closed Lost
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetails;

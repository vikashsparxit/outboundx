import { useState } from "react";
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

interface LeadDetailsProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: () => void;
}

const LeadDetails = ({ lead, isOpen, onClose, onLeadUpdate }: LeadDetailsProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const formatEmails = (emails: any[] | null) => {
    if (!emails) return "-";
    return emails.map(e => `${e.type}: ${e.email}`).join(", ");
  };

  const formatPhoneNumbers = (numbers: string[] | null) => {
    if (!numbers) return "-";
    return numbers.join(", ");
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!lead) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", lead.id);

      if (error) throw error;

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Ticket ID</label>
                <p>{lead.ticket_id || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p><Badge>{lead.status}</Badge></p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Website</label>
                <p>{lead.website || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Domain</label>
                <p>{lead.domain || "-"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-muted-foreground">Emails</label>
                <p>{formatEmails(lead.emails)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone Numbers</label>
                <p>{formatPhoneNumbers(lead.phone_numbers)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Country</label>
                <p>{lead.country || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">City</label>
                <p>{lead.city || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">State</label>
                <p>{lead.state || "-"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Bounce Count</label>
                <p>{lead.bounce_count || 0}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Call Count</label>
                <p>{lead.call_count || 0}</p>
              </div>
            </div>
          </div>

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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetails;
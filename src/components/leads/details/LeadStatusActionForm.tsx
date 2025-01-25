import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activity-logger";

interface LeadStatusActionFormProps {
  leadId: string;
  onSuccess: () => void;
}

export const LeadStatusActionForm = ({ leadId, onSuccess }: LeadStatusActionFormProps) => {
  const { toast } = useToast();
  const [actionType, setActionType] = useState<string>("");
  const [outcome, setOutcome] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("lead_status_actions").insert({
        lead_id: leadId,
        action_type: actionType,
        outcome: outcome,
        notes: notes,
        duration_minutes: duration ? parseInt(duration) : null,
      });

      if (error) throw error;

      await logActivity(leadId, "status_updated", `Added new ${actionType} action`);

      toast({
        title: "Action logged successfully",
        description: "The status action has been recorded",
      });

      // Reset form
      setActionType("");
      setOutcome("");
      setNotes("");
      setDuration("");
      
      onSuccess();
    } catch (error) {
      console.error("Error logging status action:", error);
      toast({
        title: "Error",
        description: "Failed to log status action",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOutcomeOptions = () => {
    switch (actionType) {
      case "call":
        return ["connected", "not_connected", "voicemail_left", "wrong_number"];
      case "email":
        return ["email_sent", "email_received", "no_response"];
      case "meeting":
        return ["meeting_scheduled", "meeting_completed", "meeting_cancelled"];
      case "proposal":
        return ["proposal_sent", "proposal_accepted", "proposal_rejected"];
      default:
        return [];
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Select
          value={actionType}
          onValueChange={setActionType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {actionType && (
        <div className="space-y-2">
          <Select
            value={outcome}
            onValueChange={setOutcome}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select outcome" />
            </SelectTrigger>
            <SelectContent>
              {getOutcomeOptions().map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !actionType || !outcome}>
        {isSubmitting ? "Logging..." : "Log Action"}
      </Button>
    </form>
  );
};
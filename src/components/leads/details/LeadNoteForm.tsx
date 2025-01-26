import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activity-logger";
import { useAuth } from "@/providers/AuthProvider";

interface LeadNoteFormProps {
  leadId: string;
  onSuccess: () => void;
}

export const LeadNoteForm = ({ leadId, onSuccess }: LeadNoteFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      console.log("Adding note with user ID:", user.id);
      const { error } = await supabase.from("lead_notes").insert({
        lead_id: leadId,
        user_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;

      await logActivity(leadId, "note_added", "Added a new note");

      toast({
        title: "Note added",
        description: "Your note has been saved successfully",
      });

      setContent("");
      onSuccess();
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Add a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? "Adding..." : "Add Note"}
      </Button>
    </form>
  );
};
import { supabase } from "@/integrations/supabase/client";

export type ActivityType = 
  | "status_update"
  | "status_changed"
  | "note_added"
  | "lead_created"
  | "lead_updated"
  | "lead_deleted"
  | "score_updated";

export const logActivity = async (
  leadId: string,
  activityType: ActivityType,
  description: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error("No authenticated user found");
    return;
  }

  try {
    console.log("Logging activity:", { leadId, activityType, description });
    const { error } = await supabase
      .from("lead_activities")
      .insert({
        lead_id: leadId,
        user_id: user.id,
        activity_type: activityType,
        description: description,
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};
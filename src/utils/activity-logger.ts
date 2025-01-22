import { supabase } from "@/integrations/supabase/client";

export const logActivity = async (
  leadId: string,
  activityType: string,
  description: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error("No authenticated user found");
    return;
  }

  try {
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
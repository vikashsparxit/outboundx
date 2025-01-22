import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Clock, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityLogProps {
  leadId: string;
}

interface Activity {
  id: string;
  lead_id: string;
  user_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}

const ActivityLog = ({ leadId }: ActivityLogProps) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_activities")
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Activity[];
    },
  });

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Activity Log</h3>
      </div>
      <ScrollArea className="h-[200px] rounded-md border p-4">
        {activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {activity.profiles?.full_name || activity.profiles?.email || "Unknown user"}
                    </span>
                    <span>•</span>
                    <span>{format(new Date(activity.created_at), "PPp")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No activities recorded yet.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default ActivityLog;
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

interface ActivityLogEntry {
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
  leads?: {
    ticket_id: string | null;
    email: string | null;
  };
}

const ActivityLogPage = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["all-activities"],
    queryFn: async () => {
      console.log("Fetching all activities");
      const { data, error } = await supabase
        .from("lead_activities")
        .select(`
          *,
          profiles (
            full_name,
            email
          ),
          leads (
            ticket_id,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ActivityLogEntry[];
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading activities...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Activity Log</h1>
      <div className="bg-card rounded-lg border p-6">
        <ScrollArea className="h-[600px]">
          <div className="space-y-6">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex gap-4 fade-in">
                <Clock className="h-5 w-5 mt-1 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm">
                    {activity.description}
                    {activity.leads && (
                      <span className="text-muted-foreground">
                        {" "}
                        - Lead: {activity.leads.ticket_id || activity.leads.email}
                      </span>
                    )}
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default ActivityLogPage;
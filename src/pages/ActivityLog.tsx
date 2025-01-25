import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, User, Ticket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getActivityIcon } from "@/utils/activity-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activityType, setActivityType] = useState<string>("all");

  const { data: activities, isLoading } = useQuery({
    queryKey: ["all-activities", searchTerm, activityType],
    queryFn: async () => {
      console.log("Fetching activities with filters:", { searchTerm, activityType });
      
      // First, fetch activities with profiles
      let query = supabase
        .from("lead_activities")
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%`);
      }

      if (activityType !== "all") {
        query = query.eq("activity_type", activityType);
      }

      const { data: activitiesData, error: activitiesError } = await query;
      
      if (activitiesError) throw activitiesError;

      // Then, fetch lead information separately for each activity
      const activitiesWithLeads = await Promise.all(
        (activitiesData || []).map(async (activity) => {
          if (!activity.lead_id) return { ...activity, leads: null };

          const { data: leadData, error: leadError } = await supabase
            .from("leads")
            .select("ticket_id, email")
            .eq("id", activity.lead_id)
            .single();

          if (leadError) {
            console.error("Error fetching lead:", leadError);
            return { ...activity, leads: null };
          }

          return { ...activity, leads: leadData };
        })
      );

      return activitiesWithLeads as ActivityLogEntry[];
    },
  });

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">
            Track all user activities and lead interactions
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select
            value={activityType}
            onValueChange={setActivityType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="status_update">Status Updates</SelectItem>
              <SelectItem value="note_added">Notes Added</SelectItem>
              <SelectItem value="lead_created">Lead Created</SelectItem>
              <SelectItem value="lead_updated">Lead Updated</SelectItem>
              <SelectItem value="lead_deleted">Lead Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-lg border">
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="p-8 text-center">Loading activities...</div>
            ) : activities && activities.length > 0 ? (
              <div className="divide-y">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-muted/50">
                    <div className="flex gap-4">
                      <div className="h-5 w-5 mt-1">
                        {getActivityIcon(activity)}
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm">
                          {activity.description}
                          {activity.leads && (
                            <span className="text-muted-foreground">
                              {" "}
                              - Lead: {activity.leads.ticket_id || activity.leads.email}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>
                              {activity.profiles?.full_name || activity.profiles?.email || "Unknown user"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(activity.created_at), "PPp")}</span>
                          </div>
                          {activity.leads?.ticket_id && (
                            <div className="flex items-center gap-1">
                              <Ticket className="h-3 w-3" />
                              <span>{activity.leads.ticket_id}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No activities found
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;
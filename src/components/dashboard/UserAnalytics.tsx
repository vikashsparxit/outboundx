import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export const UserAnalytics = () => {
  const { user } = useAuth();

  const { data: userStats, isLoading } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      // Get total leads assigned to user
      const { count: assignedLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("assigned_to", user?.id);

      // Get leads by status
      const { data: statusData } = await supabase
        .from("leads")
        .select("status")
        .eq("assigned_to", user?.id);

      // Calculate conversion rates
      const totalLeads = assignedLeads || 0;
      const wonLeads = statusData?.filter(lead => lead.status === "closed_won").length || 0;
      const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

      // Get recent activities
      const { data: recentActivities } = await supabase
        .from("lead_activities")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      return {
        totalLeads,
        wonLeads,
        conversionRate,
        recentActivities,
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[125px] w-full" />
        <Skeleton className="h-[125px] w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assigned Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats?.totalLeads}</div>
          <p className="text-xs text-muted-foreground">
            Active leads in your pipeline
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Won Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats?.wonLeads}</div>
          <p className="text-xs text-muted-foreground">
            Successfully closed deals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userStats?.conversionRate.toFixed(1)}%
          </div>
          <Progress 
            value={userStats?.conversionRate} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {userStats?.recentActivities?.map((activity) => (
              <div key={activity.id} className="text-xs">
                {activity.activity_type} - {new Date(activity.created_at || "").toLocaleDateString()}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
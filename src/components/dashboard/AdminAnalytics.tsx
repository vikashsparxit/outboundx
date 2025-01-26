import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Target, Activity, Database } from "lucide-react";

export const AdminAnalytics = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get total leads
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      // Get leads by status
      const { data: statusData } = await supabase
        .from("leads")
        .select("status");

      // Get recent activities
      const { data: recentActivities } = await supabase
        .from("lead_activities")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(5);

      // Get migration jobs stats
      const { data: migrationStats } = await supabase
        .from("migration_jobs")
        .select("status")
        .order("created_at", { ascending: false })
        .limit(50);

      // Calculate success rate for migrations
      const totalMigrations = migrationStats?.length || 0;
      const successfulMigrations = migrationStats?.filter(
        (job) => job.status === "completed"
      ).length || 0;
      const migrationSuccessRate = totalMigrations > 0
        ? (successfulMigrations / totalMigrations) * 100
        : 0;

      // Calculate conversion metrics
      const wonLeads = statusData?.filter(
        (lead) => lead.status === "closed_won"
      ).length || 0;
      const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

      return {
        totalUsers,
        totalLeads,
        conversionRate,
        recentActivities,
        migrationSuccessRate,
      };
    },
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
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-primary-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Active team members
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Target className="h-4 w-4 text-primary-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalLeads}</div>
          <p className="text-xs text-muted-foreground">
            Across all teams
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Conversion</CardTitle>
          <Activity className="h-4 w-4 text-primary-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.conversionRate.toFixed(1)}%
          </div>
          <Progress 
            value={stats?.conversionRate} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Migration Success</CardTitle>
          <Database className="h-4 w-4 text-primary-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.migrationSuccessRate.toFixed(1)}%
          </div>
          <Progress 
            value={stats?.migrationSuccessRate} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Team Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats?.recentActivities?.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between text-sm">
                <span>
                  {activity.profiles?.full_name || 'Unknown User'} - {activity.activity_type}
                </span>
                <span className="text-muted-foreground">
                  {new Date(activity.created_at || "").toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
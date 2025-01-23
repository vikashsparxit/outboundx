import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeadStatus } from "@/types/lead";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Users, Target, TrendingUp } from "lucide-react";

const Index = () => {
  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      const { data: statusData } = await supabase
        .from("leads")
        .select("status");

      const statusCounts: Record<LeadStatus, number> = {
        new: 0,
        contacted: 0,
        in_progress: 0,
        closed_won: 0,
        closed_lost: 0,
      };

      statusData?.forEach((lead) => {
        if (lead.status) statusCounts[lead.status as LeadStatus]++;
      });

      const { data: recentActivities } = await supabase
        .from("lead_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      return {
        totalLeads: totalLeads || 0,
        statusCounts,
        recentActivities,
      };
    },
  });

  const chartData = stats?.statusCounts
    ? Object.entries(stats.statusCounts).map(([status, count]) => ({
        status,
        count,
      }))
    : [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.statusCounts
                ? Math.round(
                    (stats.statusCounts.closed_won /
                      (stats.totalLeads || 1)) *
                      100
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.statusCounts?.in_progress || 0) +
                (stats?.statusCounts?.contacted || 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.recentActivities?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Status Distribution Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lead Status Distribution</CardTitle>
          <CardDescription>
            Distribution of leads across different stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest actions taken on leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentActivities?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{activity.activity_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(activity.created_at || "").toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
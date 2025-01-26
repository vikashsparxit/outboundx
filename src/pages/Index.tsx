import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Users, Target, TrendingUp, Upload } from "lucide-react";
import CreateUserModal from "@/components/users/CreateUserModal";
import UsersList from "@/components/users/UsersList";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import MigrationUpload from "@/components/migration/MigrationUpload";
import { useState } from "react";
import { UserAnalytics } from "@/components/dashboard/UserAnalytics";

const Index = () => {
  const { user } = useAuth();
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      const { data: statusData } = await supabase
        .from("leads")
        .select("status");

      const statusCounts = {
        new: 0,
        contacted: 0,
        in_progress: 0,
        closed_won: 0,
        closed_lost: 0,
      };

      statusData?.forEach((lead) => {
        if (lead.status) statusCounts[lead.status]++;
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

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const isAdmin = userProfile?.role === "admin";

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile?.full_name || 'User'}
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your leads today.
          </p>
        </div>
        <div className="space-x-2">
          {isAdmin && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowMigrationModal(true)}
                className="bg-white hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              <CreateUserModal />
            </>
          )}
        </div>
      </div>

      {/* User-specific analytics */}
      <UserAnalytics />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalLeads || 0}</div>
            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.statusCounts
                ? Math.round(
                    (stats.statusCounts.closed_won /
                      (stats.totalLeads || 1)) *
                      100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(stats?.statusCounts?.in_progress || 0) +
                (stats?.statusCounts?.contacted || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Activities</CardTitle>
            <Activity className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.recentActivities?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {isAdmin && (
        <MigrationUpload
          isOpen={showMigrationModal}
          onClose={() => setShowMigrationModal(false)}
        />
      )}
    </div>
  );
};

export default Index;

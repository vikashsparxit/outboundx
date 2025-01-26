import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Users, Target, TrendingUp, Upload, UserCheck, Database } from "lucide-react";
import CreateUserModal from "@/components/users/CreateUserModal";
import UsersList from "@/components/users/UsersList";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import MigrationUpload from "@/components/migration/MigrationUpload";
import { useState } from "react";
import { UserAnalytics } from "@/components/dashboard/UserAnalytics";
import { AdminAnalytics } from "@/components/dashboard/AdminAnalytics";

const Index = () => {
  const { user } = useAuth();
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  
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
            {isAdmin ? "Here's your admin dashboard overview." : "Here's what's happening with your leads today."}
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

      {/* Show different analytics based on user role */}
      {isAdmin ? <AdminAnalytics /> : <UserAnalytics />}

      {/* Admin-specific sections */}
      {isAdmin && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Team Management</CardTitle>
              <CardDescription>Manage your team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersList />
            </CardContent>
          </Card>
        </div>
      )}

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
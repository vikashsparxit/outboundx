import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import TeamAssignmentModal from "./TeamAssignmentModal";

export const TeamManagement = () => {
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const { data: teamAssignments, isLoading } = useQuery({
    queryKey: ["team-assignments"],
    queryFn: async () => {
      const { data: assignments, error } = await supabase
        .from("team_assignments")
        .select(`
          id,
          manager:profiles!team_assignments_manager_id_fkey(id, full_name, email),
          user:profiles!team_assignments_user_id_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return assignments;
    },
  });

  const { data: availableUsers } = useQuery({
    queryKey: ["available-users"],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .order('full_name');

      if (error) throw error;
      return users;
    },
  });

  if (isLoading) {
    return <div>Loading team assignments...</div>;
  }

  const groupedAssignments = teamAssignments?.reduce((acc: any, curr) => {
    const managerId = curr.manager.id;
    if (!acc[managerId]) {
      acc[managerId] = {
        manager: curr.manager,
        team: []
      };
    }
    acc[managerId].team.push(curr.user);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Team Management</CardTitle>
        <CardDescription>Manage team assignments and hierarchies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button
            onClick={() => setShowAssignmentModal(true)}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Assign Team Members
          </Button>
        </div>

        <div className="space-y-6">
          {groupedAssignments && Object.values(groupedAssignments).map((group: any) => (
            <div key={group.manager.id} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">
                Manager: {group.manager.full_name || group.manager.email}
              </h3>
              <div className="pl-4 space-y-1">
                {group.team.map((member: any) => (
                  <div key={member.id} className="text-sm text-muted-foreground">
                    {member.full_name || member.email}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showAssignmentModal && (
          <TeamAssignmentModal
            isOpen={showAssignmentModal}
            onClose={() => setShowAssignmentModal(false)}
            availableUsers={availableUsers || []}
          />
        )}
      </CardContent>
    </Card>
  );
};
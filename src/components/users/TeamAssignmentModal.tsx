import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface TeamAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: Array<{
    id: string;
    email: string;
    full_name: string | null;
    role: string;
  }>;
}

const TeamAssignmentModal = ({
  isOpen,
  onClose,
  availableUsers,
}: TeamAssignmentModalProps) => {
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const managers = availableUsers.filter(user => 
    user.role === "manager" || user.role === "admin"
  );

  const teamMembers = availableUsers.filter(user => 
    user.id !== selectedManagerId
  );

  const handleAssign = async () => {
    if (!selectedManagerId) {
      toast({
        title: "Error",
        description: "Please select a manager",
        variant: "destructive",
      });
      return;
    }

    if (selectedUserIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one team member",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);
    try {
      // Create team assignments
      const { error } = await supabase
        .from("team_assignments")
        .insert(
          selectedUserIds.map(userId => ({
            manager_id: selectedManagerId,
            user_id: userId,
          }))
        );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team members assigned successfully",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["team-assignments"] });
      
      onClose();
    } catch (error: any) {
      console.error("Error assigning team members:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign team members",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Team Members</DialogTitle>
          <DialogDescription>
            Select a manager and their team members
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Manager</label>
            <Select
              value={selectedManagerId}
              onValueChange={(value) => {
                setSelectedManagerId(value);
                setSelectedUserIds([]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.full_name || manager.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Team Members</label>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {teamMembers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2 py-1"
                >
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUserIds([...selectedUserIds, user.id]);
                      } else {
                        setSelectedUserIds(
                          selectedUserIds.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                  <label className="text-sm">
                    {user.full_name || user.email}
                  </label>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isAssigning}>
            {isAssigning ? "Assigning..." : "Assign Team Members"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamAssignmentModal;
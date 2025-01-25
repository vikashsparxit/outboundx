import { useState } from "react";
import { Lead } from "@/types/lead";
import { useQuery } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activity-logger";

interface BulkAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeads: Lead[];
  onSuccess: () => void;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

const BulkAssignmentModal = ({
  isOpen,
  onClose,
  selectedLeads,
  onSuccess,
}: BulkAssignmentModalProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .order("email");

      if (error) throw error;
      return data as User[];
    },
  });

  const handleAssign = async () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user to assign the leads to",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);
    try {
      // Update all selected leads
      const { error } = await supabase
        .from("leads")
        .update({ assigned_to: selectedUserId })
        .in(
          "id",
          selectedLeads.map((lead) => lead.id)
        );

      if (error) throw error;

      // Log activity for each lead
      await Promise.all(
        selectedLeads.map((lead) =>
          logActivity(
            lead.id,
            "lead_assigned",
            `Lead assigned to user ${selectedUserId}`
          )
        )
      );

      onSuccess();
    } catch (error) {
      console.error("Error assigning leads:", error);
      toast({
        title: "Error",
        description: "Failed to assign leads. Please try again.",
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
          <DialogTitle>Assign Leads</DialogTitle>
          <DialogDescription>
            Select a user to assign {selectedLeads.length} leads to
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Assign to</label>
            <Select
              value={selectedUserId}
              onValueChange={(value) => setSelectedUserId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Selected Leads</label>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {selectedLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center space-x-2 py-1 text-sm"
                >
                  <span className="font-medium">{lead.email}</span>
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
            {isAssigning ? "Assigning..." : "Assign Leads"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignmentModal;
import { Lead } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/utils/activity-logger";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BulkAssignmentModal from "../assignment/BulkAssignmentModal";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface TableContainerProps {
  leads: Lead[];
  isLoading: boolean;
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort: (key: string) => void;
  onLeadSelect: (lead: Lead) => void;
  onLeadDeleted: () => void;
}

const TableContainer = ({ 
  leads, 
  isLoading, 
  sortConfig, 
  onSort, 
  onLeadSelect, 
  onLeadDeleted 
}: TableContainerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const isMobile = useIsMobile();
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking admin status:", error);
          return;
        }

        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error("Error in checkAdminStatus:", error);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleDelete = async (lead: Lead) => {
    try {
      console.log("Starting lead deletion process:", lead.id);
      
      await logActivity(
        lead.id,
        "lead_deleted",
        "Lead was deleted"
      );
      
      console.log("Activity logged, proceeding with deletion");
      
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", lead.id);

      if (error) throw error;

      toast({
        title: "Lead deleted",
        description: "The lead has been successfully deleted",
      });
      
      onLeadDeleted();
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error("Error in deletion process:", error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Make sure you have admin privileges.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedLeads(checked ? leads : []);
  };

  const handleSelectLead = (lead: Lead, checked: boolean) => {
    setSelectedLeads(prev => 
      checked 
        ? [...prev, lead]
        : prev.filter(l => l.id !== lead.id)
    );
  };

  const handleAssignmentSuccess = () => {
    setSelectedLeads([]);
    setIsAssignmentModalOpen(false);
    onLeadDeleted(); // Refresh the leads list
    toast({
      title: "Leads assigned successfully",
      description: `${selectedLeads.length} leads have been assigned`,
    });
  };

  if (isLoading) {
    return <div className="w-full p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <>
      <div className="w-full space-y-3 sm:space-y-4">
        {isAdmin && selectedLeads.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/50 p-2 sm:p-3 rounded-md">
            <span className="text-sm text-muted-foreground mb-2 sm:mb-0">
              {selectedLeads.length} leads selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAssignmentModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Users className="mr-2 h-4 w-4" />
              Assign Leads
            </Button>
          </div>
        )}
        
        <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-full inline-block align-middle px-4 sm:px-0">
            {isMobile ? (
              <MobileView
                leads={leads}
                sortConfig={sortConfig}
                onSort={onSort}
                onLeadSelect={onLeadSelect}
                isAdmin={isAdmin}
                onDelete={(lead) => {
                  setLeadToDelete(lead);
                  setDeleteDialogOpen(true);
                }}
                selectedLeads={selectedLeads}
                onSelectLead={handleSelectLead}
                onSelectAll={handleSelectAll}
              />
            ) : (
              <DesktopView
                leads={leads}
                sortConfig={sortConfig}
                onSort={onSort}
                onLeadSelect={onLeadSelect}
                isAdmin={isAdmin}
                onDelete={(lead) => {
                  setLeadToDelete(lead);
                  setDeleteDialogOpen(true);
                }}
                selectedLeads={selectedLeads}
                onSelectLead={handleSelectLead}
                onSelectAll={handleSelectAll}
              />
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setLeadToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => leadToDelete && handleDelete(leadToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        selectedLeads={selectedLeads}
        onSuccess={handleAssignmentSuccess}
      />
    </>
  );
};

export default TableContainer;
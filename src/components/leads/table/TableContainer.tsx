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
      console.log("Deleting lead:", lead.id);
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", lead.id);

      if (error) throw error;

      await logActivity(
        lead.id,
        "lead_deleted",
        "Lead was deleted"
      );

      toast({
        title: "Lead deleted",
        description: "The lead has been successfully deleted",
      });
      
      onLeadDeleted();
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Make sure you have admin privileges.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="w-full p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
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
          />
        )}
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
    </>
  );
};

export default TableContainer;
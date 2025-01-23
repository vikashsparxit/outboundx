import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from 'react';
import { logActivity } from "@/utils/activity-logger";
import BeamScoreCell from "./scoring/BeamScoreCell";
import LeadsTableHeader from "./table/LeadsTableHeader";
import StatusBadge from "./table/StatusBadge";
import LeadRowActions from "./table/LeadRowActions";
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

interface LeadsTableProps {
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

const LeadsTable = ({ leads, isLoading, sortConfig, onSort, onLeadSelect, onLeadDeleted }: LeadsTableProps) => {
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

  const formatEmails = (emails: any[] | null) => {
    if (!emails) return "-";
    return emails.map(e => `${e.type}: ${e.email}`).join(", ");
  };

  const formatPhoneNumbers = (numbers: string[] | null) => {
    if (!numbers) return "-";
    return numbers.join(", ");
  };

  if (isLoading) {
    return <div className="w-full p-8 text-center text-muted-foreground">Loading...</div>;
  }

  // Define priority columns for mobile
  const priorityColumns = ["ticket_id", "website", "beam_score", "status", "actions"];

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <LeadsTableHeader 
            sortConfig={sortConfig} 
            onSort={onSort}
            isMobile={isMobile}
            priorityColumns={priorityColumns}
          />
          <TableBody>
            {leads.map((lead) => (
              <TableRow 
                key={lead.id}
                className="group cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => onLeadSelect(lead)}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  {lead.ticket_id || "-"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {lead.website || "-"}
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell className="max-w-[250px] truncate">
                      {formatEmails(lead.emails)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {formatPhoneNumbers(lead.phone_numbers)}
                    </TableCell>
                    <TableCell>{lead.lead_type || "-"}</TableCell>
                    <TableCell>{lead.client_type || "-"}</TableCell>
                  </>
                )}
                <TableCell>
                  <BeamScoreCell lead={lead} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                {!isMobile && (
                  <TableCell className="whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                )}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <LeadRowActions
                      lead={lead}
                      isAdmin={isAdmin}
                      onView={onLeadSelect}
                      onDelete={(lead) => {
                        setLeadToDelete(lead);
                        setDeleteDialogOpen(true);
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

export default LeadsTable;
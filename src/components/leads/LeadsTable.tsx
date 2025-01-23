import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown, Trash2, Eye } from "lucide-react";
import { Lead } from "@/types/lead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from 'react';
import { logActivity } from "@/utils/activity-logger";
import BeamScoreCell from "./scoring/BeamScoreCell";
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

      if (error) {
        console.error("Error in delete query:", error);
        throw error;
      }

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

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  const formatEmails = (emails: any[] | null) => {
    if (!emails) return "-";
    return emails.map(e => `${e.type}: ${e.email}`).join(", ");
  };

  const formatPhoneNumbers = (numbers: string[] | null) => {
    if (!numbers) return "-";
    return numbers.join(", ");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string, text: string, icon: JSX.Element }> = {
      new: {
        bg: "bg-blue-50 hover:bg-blue-100",
        text: "text-blue-700",
        icon: <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
      },
      contacted: {
        bg: "bg-yellow-50 hover:bg-yellow-100",
        text: "text-yellow-700",
        icon: <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
      },
      in_progress: {
        bg: "bg-purple-50 hover:bg-purple-100",
        text: "text-purple-700",
        icon: <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
      },
      closed_won: {
        bg: "bg-green-50 hover:bg-green-100",
        text: "text-green-700",
        icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
      },
      closed_lost: {
        bg: "bg-red-50 hover:bg-red-100",
        text: "text-red-700",
        icon: <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
      }
    };

    const variant = variants[status] || variants.new;
    
    return (
      <div className={`inline-flex items-center px-2.5 py-1.5 rounded-full font-medium text-sm ${variant.bg} ${variant.text}`}>
        {variant.icon}
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-full min-w-[1000px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => onSort("ticket_id")} className="cursor-pointer whitespace-nowrap">
                Ticket ID {getSortIcon("ticket_id")}
              </TableHead>
              <TableHead onClick={() => onSort("website")} className="cursor-pointer whitespace-nowrap">
                Website {getSortIcon("website")}
              </TableHead>
              <TableHead onClick={() => onSort("email")} className="cursor-pointer whitespace-nowrap">
                Email {getSortIcon("email")}
              </TableHead>
              <TableHead className="whitespace-nowrap">Phone Numbers</TableHead>
              <TableHead onClick={() => onSort("lead_type")} className="cursor-pointer whitespace-nowrap">
                Lead Type {getSortIcon("lead_type")}
              </TableHead>
              <TableHead onClick={() => onSort("client_type")} className="cursor-pointer whitespace-nowrap">
                Client Type {getSortIcon("client_type")}
              </TableHead>
              <TableHead onClick={() => onSort("beam_score")} className="cursor-pointer whitespace-nowrap">
                BEAM Score {getSortIcon("beam_score")}
              </TableHead>
              <TableHead onClick={() => onSort("status")} className="cursor-pointer whitespace-nowrap">
                Status {getSortIcon("status")}
              </TableHead>
              <TableHead onClick={() => onSort("created_at")} className="cursor-pointer whitespace-nowrap">
                Created At {getSortIcon("created_at")}
              </TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow 
                key={lead.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onLeadSelect(lead)}
              >
                <TableCell>{lead.ticket_id || "-"}</TableCell>
                <TableCell>{lead.website || "-"}</TableCell>
                <TableCell>{formatEmails(lead.emails)}</TableCell>
                <TableCell>{formatPhoneNumbers(lead.phone_numbers)}</TableCell>
                <TableCell>{lead.lead_type || "-"}</TableCell>
                <TableCell>{lead.client_type || "-"}</TableCell>
                <TableCell>
                  <BeamScoreCell lead={lead} />
                </TableCell>
                <TableCell>{getStatusBadge(lead.status)}</TableCell>
                <TableCell>
                  {new Date(lead.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLeadSelect(lead);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeadToDelete(lead);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
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
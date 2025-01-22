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

const LeadsTable = ({ 
  leads, 
  isLoading, 
  sortConfig, 
  onSort, 
  onLeadSelect,
  onLeadDeleted 
}: LeadsTableProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

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
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
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
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      contacted: "secondary",
      in_progress: "secondary",
      closed_won: "outline",
      closed_lost: "destructive"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort("ticket_id")} className="cursor-pointer">
            Ticket ID {getSortIcon("ticket_id")}
          </TableHead>
          <TableHead onClick={() => onSort("website")} className="cursor-pointer">
            Website {getSortIcon("website")}
          </TableHead>
          <TableHead onClick={() => onSort("email")} className="cursor-pointer">
            Email {getSortIcon("email")}
          </TableHead>
          <TableHead>Phone Numbers</TableHead>
          <TableHead onClick={() => onSort("lead_type")} className="cursor-pointer">
            Lead Type {getSortIcon("lead_type")}
          </TableHead>
          <TableHead onClick={() => onSort("client_type")} className="cursor-pointer">
            Client Type {getSortIcon("client_type")}
          </TableHead>
          <TableHead onClick={() => onSort("country")} className="cursor-pointer">
            Country {getSortIcon("country")}
          </TableHead>
          <TableHead onClick={() => onSort("city")} className="cursor-pointer">
            City {getSortIcon("city")}
          </TableHead>
          <TableHead onClick={() => onSort("bounce_count")} className="cursor-pointer">
            Bounce Count {getSortIcon("bounce_count")}
          </TableHead>
          <TableHead onClick={() => onSort("call_count")} className="cursor-pointer">
            Call Count {getSortIcon("call_count")}
          </TableHead>
          <TableHead onClick={() => onSort("status")} className="cursor-pointer">
            Status {getSortIcon("status")}
          </TableHead>
          <TableHead onClick={() => onSort("created_at")} className="cursor-pointer">
            Created At {getSortIcon("created_at")}
          </TableHead>
          <TableHead>Actions</TableHead>
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
            <TableCell>{lead.country || "-"}</TableCell>
            <TableCell>{lead.city || "-"}</TableCell>
            <TableCell>{lead.bounce_count || 0}</TableCell>
            <TableCell>{lead.call_count || 0}</TableCell>
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
                      handleDelete(lead);
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
  );
};

export default LeadsTable;
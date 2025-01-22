import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Lead } from "@/types/lead";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort: (key: string) => void;
}

const LeadsTable = ({ leads, isLoading, sortConfig, onSort }: LeadsTableProps) => {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => onSort("ticket_id")}>
              Ticket ID {getSortIcon("ticket_id")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("website")}>
              Website {getSortIcon("website")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("email")}>
              Email {getSortIcon("email")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("domain")}>
              Domain {getSortIcon("domain")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("lead_type")}>
              Lead Type {getSortIcon("lead_type")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("client_type")}>
              Client Type {getSortIcon("client_type")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("country")}>
              Country {getSortIcon("country")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("city")}>
              City {getSortIcon("city")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("state")}>
              State {getSortIcon("state")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("bounce_count")}>
              Bounce Count {getSortIcon("bounce_count")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("call_count")}>
              Call Count {getSortIcon("call_count")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("status")}>
              Status {getSortIcon("status")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("created_at")}>
              Created At {getSortIcon("created_at")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={13} className="text-center">
                Loading leads...
              </TableCell>
            </TableRow>
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="text-center">
                No leads found. Upload some leads to get started.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.ticket_id}</TableCell>
                <TableCell>{lead.website}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.domain}</TableCell>
                <TableCell>{lead.lead_type}</TableCell>
                <TableCell>{lead.client_type}</TableCell>
                <TableCell>{lead.country}</TableCell>
                <TableCell>{lead.city}</TableCell>
                <TableCell>{lead.state}</TableCell>
                <TableCell>{lead.bounce_count}</TableCell>
                <TableCell>{lead.call_count}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>
                  {new Date(lead.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;
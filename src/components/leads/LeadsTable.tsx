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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("ticket_id")}
          >
            Ticket ID {getSortIcon("ticket_id")}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("website")}
          >
            Website {getSortIcon("website")}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("email")}
          >
            Email {getSortIcon("email")}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("status")}
          >
            Status {getSortIcon("status")}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("created_at")}
          >
            Created At {getSortIcon("created_at")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Loading leads...
            </TableCell>
          </TableRow>
        ) : leads.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No leads found. Upload some leads to get started.
            </TableCell>
          </TableRow>
        ) : (
          leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.ticket_id}</TableCell>
              <TableCell>{lead.website}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>
                {new Date(lead.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default LeadsTable;
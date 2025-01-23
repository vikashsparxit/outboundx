import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";

interface LeadsTableHeaderProps {
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort: (key: string) => void;
  isMobile: boolean;
  priorityColumns: string[];
}

const LeadsTableHeader = ({ sortConfig, onSort, isMobile, priorityColumns }: LeadsTableHeaderProps) => {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead onClick={() => onSort("ticket_id")} className="cursor-pointer whitespace-nowrap">
          Ticket ID {getSortIcon("ticket_id")}
        </TableHead>
        <TableHead onClick={() => onSort("website")} className="cursor-pointer whitespace-nowrap">
          Website {getSortIcon("website")}
        </TableHead>
        {!isMobile && (
          <>
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
          </>
        )}
        <TableHead onClick={() => onSort("beam_score")} className="cursor-pointer whitespace-nowrap">
          BEAM Score {getSortIcon("beam_score")}
        </TableHead>
        <TableHead onClick={() => onSort("status")} className="cursor-pointer whitespace-nowrap">
          Status {getSortIcon("status")}
        </TableHead>
        {!isMobile && (
          <TableHead onClick={() => onSort("created_at")} className="cursor-pointer whitespace-nowrap">
            Created At {getSortIcon("created_at")}
          </TableHead>
        )}
        <TableHead className="whitespace-nowrap">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default LeadsTableHeader;
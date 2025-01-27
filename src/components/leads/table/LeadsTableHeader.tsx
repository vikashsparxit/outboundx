import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadsTableHeaderProps {
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort: (key: string) => void;
  isMobile: boolean;
  priorityColumns: string[];
  isAdmin?: boolean;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  someSelected?: boolean;
}

const LeadsTableHeader = ({ 
  sortConfig, 
  onSort, 
  isMobile, 
  priorityColumns,
  isAdmin,
  onSelectAll,
  allSelected,
  someSelected,
}: LeadsTableHeaderProps) => {
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
        {isAdmin && (
          <TableHead className="w-[30px]">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => onSelectAll?.(checked as boolean)}
              className="translate-y-[2px]"
            />
          </TableHead>
        )}
        <TableHead className="w-[60px] whitespace-nowrap">S.No.</TableHead>
        <TableHead onClick={() => onSort("email")} className="cursor-pointer whitespace-nowrap">
          Email {getSortIcon("email")}
        </TableHead>
        <TableHead className="whitespace-nowrap">Phone Numbers</TableHead>
        <TableHead onClick={() => onSort("country")} className="cursor-pointer whitespace-nowrap">
          Country {getSortIcon("country")}
        </TableHead>
        <TableHead onClick={() => onSort("beam_score")} className="cursor-pointer whitespace-nowrap">
          BEAM Score {getSortIcon("beam_score")}
        </TableHead>
        <TableHead onClick={() => onSort("status")} className="cursor-pointer whitespace-nowrap">
          Status {getSortIcon("status")}
        </TableHead>
        <TableHead onClick={() => onSort("website")} className="cursor-pointer whitespace-nowrap">
          Website {getSortIcon("website")}
        </TableHead>
        {!isMobile && (
          <>
            <TableHead onClick={() => onSort("lead_type")} className="cursor-pointer whitespace-nowrap">
              Lead Type {getSortIcon("lead_type")}
            </TableHead>
            <TableHead onClick={() => onSort("client_type")} className="cursor-pointer whitespace-nowrap">
              Client Type {getSortIcon("client_type")}
            </TableHead>
            <TableHead onClick={() => onSort("assigned_to")} className="cursor-pointer whitespace-nowrap">
              Assigned To {getSortIcon("assigned_to")}
            </TableHead>
            <TableHead onClick={() => onSort("created_at")} className="cursor-pointer whitespace-nowrap">
              Created At {getSortIcon("created_at")}
            </TableHead>
          </>
        )}
        <TableHead className="whitespace-nowrap">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default LeadsTableHeader;
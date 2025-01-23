import { Lead } from "@/types/lead";
import TableContainer from "./table/TableContainer";

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
  return (
    <TableContainer
      leads={leads}
      isLoading={isLoading}
      sortConfig={sortConfig}
      onSort={onSort}
      onLeadSelect={onLeadSelect}
      onLeadDeleted={onLeadDeleted}
    />
  );
};

export default LeadsTable;
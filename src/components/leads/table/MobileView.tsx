import { Lead } from "@/types/lead";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import BeamScoreCell from "../scoring/BeamScoreCell";
import LeadsTableHeader from "./LeadsTableHeader";
import StatusBadge from "./StatusBadge";
import LeadRowActions from "./LeadRowActions";

interface MobileViewProps {
  leads: Lead[];
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort: (key: string) => void;
  onLeadSelect: (lead: Lead) => void;
  isAdmin: boolean;
  onDelete: (lead: Lead) => void;
}

const PRIORITY_COLUMNS = ["beam_score", "status", "website", "actions"];

const MobileView = ({
  leads,
  sortConfig,
  onSort,
  onLeadSelect,
  isAdmin,
  onDelete,
}: MobileViewProps) => {
  return (
    <Table>
      <LeadsTableHeader 
        sortConfig={sortConfig} 
        onSort={onSort}
        isMobile={true}
        priorityColumns={PRIORITY_COLUMNS}
      />
      <TableBody>
        {leads.map((lead) => (
          <TableRow 
            key={lead.id}
            className="group cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => onLeadSelect(lead)}
          >
            <TableCell>
              <BeamScoreCell lead={lead} />
            </TableCell>
            <TableCell>
              <StatusBadge status={lead.status} />
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {lead.website || "-"}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <LeadRowActions
                  lead={lead}
                  isAdmin={isAdmin}
                  onView={onLeadSelect}
                  onDelete={onDelete}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MobileView;
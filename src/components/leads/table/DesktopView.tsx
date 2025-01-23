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
import { formatEmails, formatPhoneNumbers } from "./utils";
import EmailTypeTag from "./EmailTypeTag";

interface DesktopViewProps {
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

const DesktopView = ({
  leads,
  sortConfig,
  onSort,
  onLeadSelect,
  isAdmin,
  onDelete,
}: DesktopViewProps) => {
  return (
    <Table>
      <LeadsTableHeader 
        sortConfig={sortConfig} 
        onSort={onSort}
        isMobile={false}
        priorityColumns={[]}
      />
      <TableBody>
        {leads.map((lead, index) => (
          <TableRow 
            key={lead.id}
            className="group cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => onLeadSelect(lead)}
          >
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="max-w-[250px]">
              <div className="flex flex-wrap items-center gap-1">
                {lead.emails?.map((email, i) => (
                  <div key={i} className="flex items-center">
                    <EmailTypeTag type={email.type} />
                    <span className="truncate">{email.email}</span>
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {formatPhoneNumbers(lead.phone_numbers)}
            </TableCell>
            <TableCell>
              <BeamScoreCell lead={lead} />
            </TableCell>
            <TableCell>
              <StatusBadge status={lead.status} />
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {lead.website || "-"}
            </TableCell>
            <TableCell>{lead.lead_type || "-"}</TableCell>
            <TableCell>{lead.client_type || "-"}</TableCell>
            <TableCell className="whitespace-nowrap">
              {new Date(lead.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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

export default DesktopView;
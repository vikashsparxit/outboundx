import { Lead } from "@/types/lead";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BeamScoreCell from "../scoring/BeamScoreCell";
import LeadsTableHeader from "./LeadsTableHeader";
import StatusBadge from "./StatusBadge";
import LeadRowActions from "./LeadRowActions";
import { formatEmails, formatPhoneNumbers, getCountryCode } from "./utils";
import EmailTypeTag from "./EmailTypeTag";

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

const PRIORITY_COLUMNS = ["email", "phone_numbers", "country", "beam_score", "status", "website", "actions"];

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
        {leads.map((lead, index) => (
          <TableRow 
            key={lead.id}
            className="group cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => onLeadSelect(lead)}
          >
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="max-w-[250px]">
              <div className="flex flex-col gap-0.5">
                {lead.emails?.map((email, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span className="truncate">{email.email}</span>
                    <EmailTypeTag type={email.type} />
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {formatPhoneNumbers(lead.phone_numbers)}
            </TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {lead.country ? (
                      getCountryCode(lead.country) ? (
                        <img 
                          src={`https://flagcdn.com/${getCountryCode(lead.country)}.svg`}
                          alt={lead.country}
                          className="w-4 h-4 rounded-sm object-cover"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {lead.country}
                        </span>
                      )
                    ) : (
                      <span className="text-sm text-muted-foreground">NA</span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{lead.country || "Not Available"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
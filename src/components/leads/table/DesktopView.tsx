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
import { Checkbox } from "@/components/ui/checkbox";
import BeamScoreCell from "../scoring/BeamScoreCell";
import LeadsTableHeader from "./LeadsTableHeader";
import StatusBadge from "./StatusBadge";
import LeadRowActions from "./LeadRowActions";
import { formatEmails, formatPhoneNumbers, getCountryCode } from "./utils";
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
  selectedLeads: Lead[];
  onSelectLead: (lead: Lead, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

const DesktopView = ({
  leads,
  sortConfig,
  onSort,
  onLeadSelect,
  isAdmin,
  onDelete,
  selectedLeads,
  onSelectLead,
  onSelectAll,
}: DesktopViewProps) => {
  const isSelected = (lead: Lead) => 
    selectedLeads.some(selected => selected.id === lead.id);

  return (
    <Table>
      <LeadsTableHeader 
        sortConfig={sortConfig} 
        onSort={onSort}
        isMobile={false}
        priorityColumns={[]}
        isAdmin={isAdmin}
        onSelectAll={onSelectAll}
        allSelected={selectedLeads.length === leads.length}
        someSelected={selectedLeads.length > 0 && selectedLeads.length < leads.length}
      />
      <TableBody>
        {leads.map((lead, index) => (
          <TableRow 
            key={lead.id}
            className={`group cursor-pointer transition-colors hover:bg-muted/50 ${
              isSelected(lead) ? "bg-muted" : ""
            }`}
          >
            {isAdmin && (
              <TableCell onClick={(e) => e.stopPropagation()} className="w-0">
                <Checkbox
                  checked={isSelected(lead)}
                  onCheckedChange={(checked) => onSelectLead(lead, checked as boolean)}
                />
              </TableCell>
            )}
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="max-w-[250px]" onClick={() => onLeadSelect(lead)}>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-col gap-0.5">
                  <span className="truncate">{lead.email}</span>
                  <EmailTypeTag type={lead.email_type || 'business'} />
                </div>
              </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate" onClick={() => onLeadSelect(lead)}>
              {formatPhoneNumbers(lead.phone_numbers)}
            </TableCell>
            <TableCell onClick={() => onLeadSelect(lead)}>
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
            <TableCell onClick={() => onLeadSelect(lead)}>
              <BeamScoreCell lead={lead} />
            </TableCell>
            <TableCell onClick={() => onLeadSelect(lead)}>
              <StatusBadge status={lead.status} />
            </TableCell>
            <TableCell className="max-w-[200px] truncate" onClick={() => onLeadSelect(lead)}>
              {lead.website || "-"}
            </TableCell>
            <TableCell onClick={() => onLeadSelect(lead)}>{lead.lead_type || "-"}</TableCell>
            <TableCell onClick={() => onLeadSelect(lead)}>{lead.client_type || "-"}</TableCell>
            <TableCell onClick={() => onLeadSelect(lead)}>
              {lead.assignedTo?.full_name || "-"}
            </TableCell>
            <TableCell className="whitespace-nowrap" onClick={() => onLeadSelect(lead)}>
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
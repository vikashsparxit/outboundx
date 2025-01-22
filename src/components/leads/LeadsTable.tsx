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
import { Badge } from "@/components/ui/badge";

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

  const formatEmails = (emails: any[] | null) => {
    if (!emails) return "-";
    return emails.map(e => `${e.type}: ${e.email}`).join(", ");
  };

  const formatPhoneNumbers = (numbers: string[] | null) => {
    if (!numbers) return "-";
    return numbers.join(", ");
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("ticket_id")}>
              Ticket ID {getSortIcon("ticket_id")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("website")}>
              Website {getSortIcon("website")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("contact_id")}>
              Contact ID {getSortIcon("contact_id")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("subject")}>
              Subject {getSortIcon("subject")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("message")}>
              Initial Message {getSortIcon("message")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("status")}>
              Status {getSortIcon("status")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("email")}>
              Primary Email {getSortIcon("email")}
            </TableHead>
            <TableHead className="whitespace-nowrap">Additional Emails</TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("domain")}>
              Domain {getSortIcon("domain")}
            </TableHead>
            <TableHead className="whitespace-nowrap">Phone Numbers</TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("lead_type")}>
              Lead Type {getSortIcon("lead_type")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("handled")}>
              Handled {getSortIcon("handled")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("country")}>
              Country {getSortIcon("country")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("city")}>
              City {getSortIcon("city")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("state")}>
              State {getSortIcon("state")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("bounce_count")}>
              Bounce Count {getSortIcon("bounce_count")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("call_count")}>
              Call Count {getSortIcon("call_count")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("client_type")}>
              Client Type {getSortIcon("client_type")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("ip_country")}>
              IP Country {getSortIcon("ip_country")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("ip_region")}>
              IP Region {getSortIcon("ip_region")}
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => onSort("created_at")}>
              Created At {getSortIcon("created_at")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={21} className="text-center">
                Loading leads...
              </TableCell>
            </TableRow>
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={21} className="text-center">
                No leads found. Upload some leads to get started.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="whitespace-nowrap">{lead.ticket_id}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.website}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.contact_id}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.subject}</TableCell>
                <TableCell className="max-w-xs truncate">{lead.message}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={lead.status === "closed_won" ? "success" : 
                             lead.status === "closed_lost" ? "destructive" : 
                             "default"}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{lead.email}</TableCell>
                <TableCell className="whitespace-nowrap">{formatEmails(lead.emails)}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.domain}</TableCell>
                <TableCell className="whitespace-nowrap">{formatPhoneNumbers(lead.phone_numbers)}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.lead_type}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.handled ? "Yes" : "No"}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.country}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.city}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.state}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.bounce_count}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.call_count}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.client_type}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.ip_country}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.ip_region}</TableCell>
                <TableCell className="whitespace-nowrap">
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
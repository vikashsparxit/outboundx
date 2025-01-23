import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead, LeadStatus } from "@/types/lead";

interface LeadIdentificationProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  renderField: (label: string, value: string | null, field: keyof Lead) => JSX.Element;
}

export const LeadIdentification = ({ 
  lead, 
  isEditing, 
  editedLead, 
  setEditedLead, 
  renderField 
}: LeadIdentificationProps) => {
  const statuses: LeadStatus[] = ["new", "contacted", "in_progress", "closed_won", "closed_lost"];
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Identification</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Lead ID</label>
          <p className="truncate">{lead.id}</p>
        </div>
        {renderField("Ticket ID", lead.ticket_id, "ticket_id")}
        {renderField("Contact ID", lead.contact_id, "contact_id")}
        <div>
          <label className="text-sm text-muted-foreground">Status</label>
          {isEditing ? (
            <Select
              value={editedLead.status || lead.status}
              onValueChange={(value: LeadStatus) =>
                setEditedLead({ ...editedLead, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Badge>{lead.status}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};
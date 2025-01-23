import { Badge } from "@/components/ui/badge";
import { Lead } from "@/types/lead";

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
          <p><Badge>{lead.status}</Badge></p>
        </div>
      </div>
    </div>
  );
};
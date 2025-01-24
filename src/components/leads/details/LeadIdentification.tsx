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
  renderField,
}: LeadIdentificationProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Identification</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Lead ID</label>
          <p>{lead.id}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Ticket ID</label>
          <p>{lead.ticket_id || "-"}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Contact ID</label>
          <p>{lead.contact_id || "-"}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Status</label>
          <p>{lead.status}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Bounce Count</label>
          <p>{lead.bounce_count || 0}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Call Count</label>
          <p>{lead.call_count || 0}</p>
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        <div>
          <label className="text-sm text-muted-foreground">Subject</label>
          <p className="whitespace-pre-wrap">{lead.subject || "-"}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Message</label>
          <p className="whitespace-pre-wrap">{lead.message || "-"}</p>
        </div>
      </div>
    </div>
  );
};
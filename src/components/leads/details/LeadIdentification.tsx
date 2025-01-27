import { Lead } from "@/types/lead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}: LeadIdentificationProps) => {
  const handleNumberChange = (field: keyof Lead, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditedLead({ ...editedLead, [field]: numValue });
  };

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
          {isEditing ? (
            <Input
              value={editedLead.ticket_id || ''}
              onChange={(e) => setEditedLead({ ...editedLead, ticket_id: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p>{lead.ticket_id || "-"}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Contact ID</label>
          {isEditing ? (
            <Input
              value={editedLead.contact_id || ''}
              onChange={(e) => setEditedLead({ ...editedLead, contact_id: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p>{lead.contact_id || "-"}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Company Name</label>
          {isEditing ? (
            <Input
              value={editedLead.company_name || ''}
              onChange={(e) => setEditedLead({ ...editedLead, company_name: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p>{lead.company_name || "-"}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Status</label>
          {isEditing ? (
            <Select
              value={editedLead.status || "new"}
              onValueChange={(value) => setEditedLead({ ...editedLead, status: value as Lead['status'] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.status}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Assigned To</label>
          <p>{lead.assignedTo?.full_name || "Unassigned"}</p>
          {lead.assignedTo?.email && (
            <p className="text-sm text-muted-foreground">{lead.assignedTo.email}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Location</label>
          {isEditing ? (
            <Input
              value={editedLead.location || ''}
              onChange={(e) => setEditedLead({ ...editedLead, location: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p>{lead.location || "-"}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Bounce Count</label>
          {isEditing ? (
            <Input
              type="number"
              min="0"
              value={editedLead.bounce_count || 0}
              onChange={(e) => handleNumberChange('bounce_count', e.target.value)}
              className="mt-1"
            />
          ) : (
            <p>{lead.bounce_count || 0}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Call Count</label>
          {isEditing ? (
            <Input
              type="number"
              min="0"
              value={editedLead.call_count || 0}
              onChange={(e) => handleNumberChange('call_count', e.target.value)}
              className="mt-1"
            />
          ) : (
            <p>{lead.call_count || 0}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        <div>
          <label className="text-sm text-muted-foreground">Subject</label>
          {isEditing ? (
            <Input
              value={editedLead.subject || ''}
              onChange={(e) => setEditedLead({ ...editedLead, subject: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p className="whitespace-pre-wrap">{lead.subject || "-"}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Message</label>
          {isEditing ? (
            <Textarea
              value={editedLead.message || ''}
              onChange={(e) => setEditedLead({ ...editedLead, message: e.target.value })}
              className="mt-1"
              rows={6}
            />
          ) : (
            <p className="whitespace-pre-wrap">{lead.message || "-"}</p>
          )}
        </div>
      </div>
    </div>
  );
};
import { Lead } from "@/types/lead";

interface LeadContactProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  renderField: (label: string, value: string | null, field: keyof Lead) => JSX.Element;
  formatEmails: (emails: any[] | null) => string;
  formatPhoneNumbers: (numbers: string[] | null) => string;
}

export const LeadContact = ({ 
  lead, 
  renderField, 
  formatEmails, 
  formatPhoneNumbers 
}: LeadContactProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="space-y-2">
        <div>
          <label className="text-sm text-muted-foreground">Emails</label>
          <p>{formatEmails(lead.emails)}</p>
        </div>
        {renderField("Primary Email", lead.email, "email")}
        <div>
          <label className="text-sm text-muted-foreground">Phone Numbers</label>
          <p>{formatPhoneNumbers(lead.phone_numbers)}</p>
        </div>
      </div>
    </div>
  );
};
import { Lead } from "@/types/lead";
import { EmailManagement } from "./EmailManagement";
import { PhoneManagement } from "./PhoneManagement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadContactProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  renderField: (label: string, value: string | null, field: keyof Lead) => JSX.Element;
  formatEmails: (emails: any[] | null) => string;
  formatPhoneNumbers: (numbers: string[] | null) => string;
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
  onEmailChange: (index: number, field: "type" | "email", value: string) => void;
  onAddPhoneNumber: () => void;
  onRemovePhoneNumber: (index: number) => void;
  onPhoneNumberChange: (index: number, value: string) => void;
  validationErrors: Record<string, string>;
}

export const LeadContact = ({ 
  lead,
  isEditing,
  editedLead,
  setEditedLead,
  renderField,
  formatEmails,
  formatPhoneNumbers,
  onAddEmail,
  onRemoveEmail,
  onEmailChange,
  onAddPhoneNumber,
  onRemovePhoneNumber,
  onPhoneNumberChange,
  validationErrors
}: LeadContactProps) => {
  // Use the correct data source based on edit state
  const displayLead = isEditing ? editedLead : lead;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Primary Email</label>
          {isEditing ? (
            <div className="flex gap-2 items-start mt-1">
              <Select
                value={editedLead.email_type || "business"}
                onValueChange={(value: "personal" | "business" | "other") => 
                  setEditedLead({ ...editedLead, email_type: value })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1">
                <input
                  type="email"
                  value={editedLead.email || ''}
                  onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          ) : (
            <p>{displayLead.email || "-"} ({displayLead.email_type || "business"})</p>
          )}
        </div>
        <EmailManagement
          isEditing={isEditing}
          editedLead={editedLead}
          onAddEmail={onAddEmail}
          onRemoveEmail={onRemoveEmail}
          onEmailChange={onEmailChange}
          formatEmails={formatEmails}
          validationErrors={validationErrors}
        />
        <PhoneManagement
          isEditing={isEditing}
          editedLead={editedLead}
          onAddPhoneNumber={onAddPhoneNumber}
          onRemovePhoneNumber={onRemovePhoneNumber}
          onPhoneNumberChange={onPhoneNumberChange}
          formatPhoneNumbers={formatPhoneNumbers}
          validationErrors={validationErrors}
        />
      </div>
    </div>
  );
};
import { Lead } from "@/types/lead";
import { EmailManagement } from "./EmailManagement";
import { PhoneManagement } from "./PhoneManagement";

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
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="space-y-4">
        <EmailManagement
          isEditing={isEditing}
          editedLead={editedLead}
          onAddEmail={onAddEmail}
          onRemoveEmail={onRemoveEmail}
          onEmailChange={onEmailChange}
          formatEmails={formatEmails}
          validationErrors={validationErrors}
        />
        {renderField("Primary Email", lead.email, "email")}
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
import { Lead } from "@/types/lead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

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
        <div>
          <label className="text-sm text-muted-foreground">Emails</label>
          {isEditing ? (
            <div className="space-y-2">
              {(editedLead.emails || []).map((emailObj, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Select
                    value={emailObj.type}
                    onValueChange={(value) => onEmailChange(index, "type", value)}
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
                    <Input
                      value={emailObj.email}
                      onChange={(e) => onEmailChange(index, "email", e.target.value)}
                      className={validationErrors[`emails.${index}`] ? "border-red-500" : ""}
                    />
                    {validationErrors[`emails.${index}`] && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors[`emails.${index}`]}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveEmail(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={onAddEmail}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Email
              </Button>
            </div>
          ) : (
            <p>{formatEmails(lead.emails)}</p>
          )}
        </div>
        {renderField("Primary Email", lead.email, "email")}
        <div>
          <label className="text-sm text-muted-foreground">Phone Numbers</label>
          {isEditing ? (
            <div className="space-y-2">
              {(editedLead.phone_numbers || []).map((phone, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={phone}
                    onChange={(e) => onPhoneNumberChange(index, e.target.value)}
                    placeholder="Enter phone number"
                    className={validationErrors[`phone_numbers.${index}`] ? "border-red-500" : ""}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemovePhoneNumber(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={onAddPhoneNumber}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phone Number
              </Button>
            </div>
          ) : (
            <p>{formatPhoneNumbers(lead.phone_numbers)}</p>
          )}
        </div>
      </div>
    </div>
  );
};
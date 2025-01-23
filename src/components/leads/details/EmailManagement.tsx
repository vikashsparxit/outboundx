import { EmailAddress, Lead } from "@/types/lead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface EmailManagementProps {
  isEditing: boolean;
  editedLead: Partial<Lead>;
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
  onEmailChange: (index: number, field: "type" | "email", value: string) => void;
  formatEmails: (emails: EmailAddress[] | null) => string;
  validationErrors: Record<string, string>;
}

export const EmailManagement = ({
  isEditing,
  editedLead,
  onAddEmail,
  onRemoveEmail,
  onEmailChange,
  formatEmails,
  validationErrors,
}: EmailManagementProps) => {
  return (
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
        <p>{formatEmails(editedLead.emails)}</p>
      )}
    </div>
  );
};
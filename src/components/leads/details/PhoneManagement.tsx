import { Lead } from "@/types/lead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface PhoneManagementProps {
  isEditing: boolean;
  editedLead: Partial<Lead>;
  onAddPhoneNumber: () => void;
  onRemovePhoneNumber: (index: number) => void;
  onPhoneNumberChange: (index: number, value: string) => void;
  formatPhoneNumbers: (numbers: string[] | null) => string;
  validationErrors: Record<string, string>;
}

export const PhoneManagement = ({
  isEditing,
  editedLead,
  onAddPhoneNumber,
  onRemovePhoneNumber,
  onPhoneNumberChange,
  formatPhoneNumbers,
  validationErrors,
}: PhoneManagementProps) => {
  return (
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
        <p>{formatPhoneNumbers(editedLead.phone_numbers)}</p>
      )}
    </div>
  );
};
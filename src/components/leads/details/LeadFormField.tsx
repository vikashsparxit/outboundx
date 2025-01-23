import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lead } from "@/types/lead";

interface LeadFormFieldProps {
  label: string;
  value: string | null;
  field: keyof Lead;
  isEditing: boolean;
  isTextArea?: boolean;
  onChange: (value: string) => void;
}

export const LeadFormField = ({
  label,
  value,
  field,
  isEditing,
  isTextArea = false,
  onChange,
}: LeadFormFieldProps) => {
  return (
    <div>
      <label className="text-sm text-muted-foreground">{label}</label>
      {isEditing ? (
        isTextArea ? (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1"
          />
        ) : (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1"
          />
        )
      ) : (
        <p className="whitespace-pre-wrap">{value || "-"}</p>
      )}
    </div>
  );
};
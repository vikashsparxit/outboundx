import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead } from "@/types/lead";

interface ScoringSelectProps {
  label: string;
  value: string | null | undefined;
  options: string[];
  onChange: (value: string) => void;
  isEditing: boolean;
}

export const ScoringSelect = ({
  label,
  value,
  options,
  onChange,
  isEditing,
}: ScoringSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">{label}</label>
      {isEditing ? (
        <Select
          value={value || ""}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p>{value || "-"}</p>
      )}
    </div>
  );
};
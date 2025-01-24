interface ScoringSelectProps {
  label: string;
  value: string | null;
  options: readonly string[];
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
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <div className="text-sm">
          {value || <span className="text-muted-foreground">-</span>}
        </div>
      )}
    </div>
  );
};
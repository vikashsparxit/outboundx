import { Lead } from "@/types/lead";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "@/constants/leadOptions";

interface LeadLocationProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  renderField: (label: string, value: string | null, field: keyof Lead) => JSX.Element;
}

export const LeadLocation = ({ 
  lead,
  isEditing,
  editedLead,
  setEditedLead
}: LeadLocationProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Location</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Country</label>
          {isEditing ? (
            <Select
              value={editedLead.country || ""}
              onValueChange={(value) => setEditedLead({ ...editedLead, country: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.country || "-"}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">City</label>
          {isEditing ? (
            <Select
              value={editedLead.city || ""}
              onValueChange={(value) => setEditedLead({ ...editedLead, city: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {/* Add city options based on selected country */}
                <SelectItem value="new_york">New York</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="paris">Paris</SelectItem>
                {/* Add more cities */}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.city || "-"}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">State</label>
          {isEditing ? (
            <Select
              value={editedLead.state || ""}
              onValueChange={(value) => setEditedLead({ ...editedLead, state: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {/* Add state options based on selected country */}
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="ca">California</SelectItem>
                {/* Add more states */}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.state || "-"}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">IP Country</label>
          <p>{lead.ip_country || "-"}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">IP Region</label>
          <p>{lead.ip_region || "-"}</p>
        </div>
      </div>
    </div>
  );
};
import { Lead } from "@/types/lead";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "@/constants/leadOptions";
import { useState, useEffect } from "react";

// This would ideally come from an API or a complete dataset
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Glasgow"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"],
  // Add more countries and cities as needed
};

const STATES_BY_COUNTRY: Record<string, string[]> = {
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
    "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ],
  "Canada": [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
    "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"
  ],
  // Add more countries and states as needed
};

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
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  useEffect(() => {
    if (editedLead.country) {
      setAvailableCities(CITIES_BY_COUNTRY[editedLead.country] || []);
      setAvailableStates(STATES_BY_COUNTRY[editedLead.country] || []);
      
      // Reset city and state if they're not valid for the new country
      if (!CITIES_BY_COUNTRY[editedLead.country]?.includes(editedLead.city || '')) {
        setEditedLead({ ...editedLead, city: null });
      }
      if (!STATES_BY_COUNTRY[editedLead.country]?.includes(editedLead.state || '')) {
        setEditedLead({ ...editedLead, state: null });
      }
    }
  }, [editedLead.country]);

  console.log('Location Update:', {
    country: editedLead.country,
    city: editedLead.city,
    state: editedLead.state,
    availableCities,
    availableStates
  });

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
              disabled={!editedLead.country || availableCities.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
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
              disabled={!editedLead.country || availableStates.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {availableStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
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
import { Lead } from "@/types/lead";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getCountries, getStates } from "@/utils/locationData";

interface LeadLocationProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
}

interface LocationOption {
  name: string;
  isoCode: string;
}

export const LeadLocation = ({ 
  lead,
  isEditing,
  editedLead,
  setEditedLead
}: LeadLocationProps) => {
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<LocationOption | null>(null);

  // Load countries on component mount
  useEffect(() => {
    const loadedCountries = getCountries();
    setCountries(loadedCountries);
    
    // If there's a country selected, find it in the loaded countries
    if (editedLead.country) {
      const country = loadedCountries.find(c => c.name === editedLead.country);
      setSelectedCountry(country || null);
    }
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const loadedStates = getStates(selectedCountry.isoCode);
      setStates(loadedStates);
      
      // Reset state if it's not valid for the new country
      if (!loadedStates.some(s => s.name === editedLead.state)) {
        setEditedLead({ ...editedLead, state: null });
      }
    } else {
      setStates([]);
      setEditedLead({ ...editedLead, state: null });
    }
  }, [selectedCountry]);

  const handleCountryChange = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    setSelectedCountry(country || null);
    setEditedLead({ ...editedLead, country: countryName });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Location</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Country</label>
          {isEditing ? (
            <Select
              value={editedLead.country || ""}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.country || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">State/Province</label>
          {isEditing ? (
            <Select
              value={editedLead.state || ""}
              onValueChange={(value) => setEditedLead({ ...editedLead, state: value })}
              disabled={!selectedCountry}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.isoCode} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.state || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">City</label>
          {isEditing ? (
            <Input
              value={editedLead.city || ''}
              onChange={(e) => setEditedLead({ ...editedLead, city: e.target.value })}
              placeholder="Enter city name"
            />
          ) : (
            <p>{lead.city || "-"}</p>
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
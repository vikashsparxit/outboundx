import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldMappingProps {
  csvHeaders: string[];
  mappings: Record<string, string>;
  onMappingChange: (dbField: string, csvHeader: string) => void;
}

const dbFields = [
  { value: "ticket_id", label: "Ticket ID" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
  { value: "domain", label: "Domain" },
  { value: "phone_numbers", label: "Phone Numbers" },
  { value: "subject", label: "Subject" },
  { value: "message", label: "Message" },
  { value: "lead_type", label: "Lead Type" },
  { value: "client_type", label: "Client Type" },
  { value: "country", label: "Country" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "contact_id", label: "Contact ID" },
  { value: "ip_country", label: "IP Country" },
  { value: "ip_region", label: "IP Region" },
];

const FieldMapping = ({ csvHeaders, mappings, onMappingChange }: FieldMappingProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Map CSV Fields</h3>
      <div className="grid gap-4">
        {dbFields.map(({ value: dbField, label }) => (
          <div key={dbField} className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">{label}</span>
            <Select
              value={mappings[dbField] || "none"}
              onValueChange={(csvHeader) => onMappingChange(dbField, csvHeader === "none" ? "" : csvHeader)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {csvHeaders.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldMapping;
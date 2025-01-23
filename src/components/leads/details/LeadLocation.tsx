import { Lead } from "@/types/lead";

interface LeadLocationProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  renderField: (label: string, value: string | null, field: keyof Lead) => JSX.Element;
}

export const LeadLocation = ({ lead, renderField }: LeadLocationProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Location</h3>
      <div className="grid grid-cols-2 gap-4">
        {renderField("Country", lead.country, "country")}
        {renderField("City", lead.city, "city")}
        {renderField("State", lead.state, "state")}
        {renderField("IP Country", lead.ip_country, "ip_country")}
        {renderField("IP Region", lead.ip_region, "ip_region")}
      </div>
    </div>
  );
};
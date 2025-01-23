import { Lead } from "@/types/lead";

interface LeadOnlinePresenceProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  renderField: (label: string, value: string | null, field: keyof Lead) => JSX.Element;
}

export const LeadOnlinePresence = ({ lead, renderField }: LeadOnlinePresenceProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Online Presence</h3>
      <div className="grid grid-cols-2 gap-4">
        {renderField("Website", lead.website, "website")}
        {renderField("Domain", lead.domain, "domain")}
      </div>
    </div>
  );
};
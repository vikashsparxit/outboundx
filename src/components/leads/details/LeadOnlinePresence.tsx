import { Lead } from "@/types/lead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface LeadOnlinePresenceProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  renderField: (label: string, value: string | null, field: keyof Lead) => JSX.Element;
  validationErrors: Record<string, string>;
  onAddDomain: () => void;
  onRemoveDomain: (index: number) => void;
  onDomainChange: (index: number, value: string) => void;
}

export const LeadOnlinePresence = ({ 
  lead,
  isEditing,
  editedLead,
  renderField,
  validationErrors,
  onAddDomain,
  onRemoveDomain,
  onDomainChange
}: LeadOnlinePresenceProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Online Presence</h3>
      <div className="space-y-4">
        {renderField("Lead Source Website", lead.lead_source_website, "lead_source_website")}
        <div>
          <label className="text-sm text-muted-foreground">Websites</label>
          {isEditing ? (
            <div className="space-y-2">
              {(editedLead.domains || []).map((domain, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={domain}
                    onChange={(e) => onDomainChange(index, e.target.value)}
                    placeholder="Enter website domain"
                    className={validationErrors[`domains.${index}`] ? "border-red-500" : ""}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveDomain(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={onAddDomain}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Website
              </Button>
            </div>
          ) : (
            <p>{(lead.domains || []).join(", ") || "-"}</p>
          )}
          {validationErrors.website && (
            <p className="text-sm text-destructive">{validationErrors.website}</p>
          )}
        </div>
      </div>
    </div>
  );
};
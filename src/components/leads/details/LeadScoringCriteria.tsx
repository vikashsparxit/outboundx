import { Lead } from "@/types/lead";
import {
  BUDGET_RANGES,
  COMPANY_SIZES,
  INDUSTRY_VERTICALS,
  DECISION_MAKER_LEVELS,
  NEED_URGENCY,
  PROJECT_TIMELINES,
  ANNUAL_REVENUE_RANGES,
} from "@/constants/leadOptions";
import { TechnologyStack } from "./scoring/TechnologyStack";
import { ScoringSelect } from "./scoring/ScoringSelect";

interface LeadScoringCriteriaProps {
  lead: Lead | Partial<Lead>;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  onAddTechnology: (tech: string) => void;
}

export const LeadScoringCriteria = ({
  lead,
  isEditing,
  editedLead,
  setEditedLead,
  onAddTechnology,
}: LeadScoringCriteriaProps) => {
  // Use the correct data source based on edit state
  const displayLead = isEditing ? editedLead : lead;

  console.log('LeadScoringCriteria - displayLead:', displayLead);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">BEAM Scoring Criteria</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Budget Range</label>
          {isEditing ? (
            <ScoringSelect
              label="Budget Range"
              value={editedLead.budget_range}
              options={BUDGET_RANGES}
              onChange={(value) => setEditedLead({ ...editedLead, budget_range: value })}
              isEditing={isEditing}
            />
          ) : (
            <p>{displayLead.budget_range || "-"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Company Size</label>
          {isEditing ? (
            <ScoringSelect
              label="Company Size"
              value={editedLead.company_size}
              options={COMPANY_SIZES}
              onChange={(value) => setEditedLead({ ...editedLead, company_size: value })}
              isEditing={isEditing}
            />
          ) : (
            <p>{displayLead.company_size || "-"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Industry Vertical</label>
          {isEditing ? (
            <ScoringSelect
              label="Industry Vertical"
              value={editedLead.industry_vertical}
              options={INDUSTRY_VERTICALS}
              onChange={(value) => setEditedLead({ ...editedLead, industry_vertical: value })}
              isEditing={isEditing}
            />
          ) : (
            <p>{displayLead.industry_vertical || "-"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Decision Maker Level</label>
          {isEditing ? (
            <ScoringSelect
              label="Decision Maker Level"
              value={editedLead.decision_maker_level}
              options={DECISION_MAKER_LEVELS}
              onChange={(value) => setEditedLead({ ...editedLead, decision_maker_level: value })}
              isEditing={isEditing}
            />
          ) : (
            <p>{displayLead.decision_maker_level || "-"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Need Urgency</label>
          {isEditing ? (
            <ScoringSelect
              label="Need Urgency"
              value={editedLead.need_urgency}
              options={NEED_URGENCY}
              onChange={(value) => setEditedLead({ ...editedLead, need_urgency: value })}
              isEditing={isEditing}
            />
          ) : (
            <p>{displayLead.need_urgency || "-"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Project Timeline</label>
          {isEditing ? (
            <ScoringSelect
              label="Project Timeline"
              value={editedLead.project_timeline}
              options={PROJECT_TIMELINES}
              onChange={(value) => setEditedLead({ ...editedLead, project_timeline: value })}
              isEditing={isEditing}
            />
          ) : (
            <p>{displayLead.project_timeline || "-"}</p>
          )}
        </div>

        <div className="col-span-2">
          <TechnologyStack
            lead={displayLead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
          />
        </div>
      </div>
    </div>
  );
};
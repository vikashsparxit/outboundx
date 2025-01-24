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
  lead: Lead;
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
}: LeadScoringCriteriaProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">BEAM Scoring Criteria</h3>
      <div className="grid grid-cols-2 gap-4">
        <ScoringSelect
          label="Budget Range"
          value={editedLead.budget_range}
          options={BUDGET_RANGES}
          onChange={(value) => setEditedLead({ ...editedLead, budget_range: value })}
          isEditing={isEditing}
        />

        <ScoringSelect
          label="Company Size"
          value={editedLead.company_size}
          options={COMPANY_SIZES}
          onChange={(value) => setEditedLead({ ...editedLead, company_size: value })}
          isEditing={isEditing}
        />

        <ScoringSelect
          label="Industry Vertical"
          value={editedLead.industry_vertical}
          options={INDUSTRY_VERTICALS}
          onChange={(value) => setEditedLead({ ...editedLead, industry_vertical: value })}
          isEditing={isEditing}
        />

        <ScoringSelect
          label="Decision Maker Level"
          value={editedLead.decision_maker_level}
          options={DECISION_MAKER_LEVELS}
          onChange={(value) => setEditedLead({ ...editedLead, decision_maker_level: value })}
          isEditing={isEditing}
        />

        <ScoringSelect
          label="Need Urgency"
          value={editedLead.need_urgency}
          options={NEED_URGENCY}
          onChange={(value) => setEditedLead({ ...editedLead, need_urgency: value })}
          isEditing={isEditing}
        />

        <ScoringSelect
          label="Project Timeline"
          value={editedLead.project_timeline}
          options={PROJECT_TIMELINES}
          onChange={(value) => setEditedLead({ ...editedLead, project_timeline: value })}
          isEditing={isEditing}
        />

        <ScoringSelect
          label="Annual Revenue Range"
          value={editedLead.annual_revenue_range}
          options={ANNUAL_REVENUE_RANGES}
          onChange={(value) => setEditedLead({ ...editedLead, annual_revenue_range: value })}
          isEditing={isEditing}
        />

        <div className="col-span-2">
          <TechnologyStack
            lead={lead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
          />
        </div>
      </div>
    </div>
  );
};
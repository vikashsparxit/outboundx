import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lead } from "@/types/lead";
import {
  BUDGET_RANGES,
  COMPANY_SIZES,
  INDUSTRY_VERTICALS,
  DECISION_MAKER_LEVELS,
  NEED_URGENCY,
  PROJECT_TIMELINES,
  ANNUAL_REVENUE_RANGES,
  TECHNOLOGY_STACK_OPTIONS,
} from "@/constants/leadOptions";
import { useState } from "react";

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
  onAddTechnology
}: LeadScoringCriteriaProps) => {
  const [newTech, setNewTech] = useState("");

  const handleAddTech = () => {
    if (newTech.trim()) {
      const techToAdd = newTech.trim();
      const updatedTechStack = [...(editedLead.technology_stack || [])];
      if (!updatedTechStack.includes(techToAdd)) {
        updatedTechStack.push(techToAdd);
        setEditedLead({ ...editedLead, technology_stack: updatedTechStack });
        console.log('Updated technology stack:', updatedTechStack);
      }
      setNewTech("");
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    const updatedTechStack = (editedLead.technology_stack || []).filter(
      tech => tech !== techToRemove
    );
    console.log('Removing tech:', techToRemove, 'New stack:', updatedTechStack);
    setEditedLead({ ...editedLead, technology_stack: updatedTechStack });
  };

  const handlePresetTech = (tech: string) => {
    const updatedTechStack = [...(editedLead.technology_stack || [])];
    if (!updatedTechStack.includes(tech)) {
      updatedTechStack.push(tech);
      console.log('Adding preset tech:', tech, 'New stack:', updatedTechStack);
      setEditedLead({ ...editedLead, technology_stack: updatedTechStack });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">BEAM Scoring Criteria</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Budget Range</label>
          {isEditing ? (
            <Select
              value={editedLead.budget_range || ""}
              onValueChange={(value) =>
                setEditedLead({ ...editedLead, budget_range: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.budget_range || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Company Size</label>
          {isEditing ? (
            <Select
              value={editedLead.company_size || ""}
              onValueChange={(value) =>
                setEditedLead({ ...editedLead, company_size: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.company_size || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Industry Vertical</label>
          {isEditing ? (
            <Select
              value={editedLead.industry_vertical || ""}
              onValueChange={(value) =>
                setEditedLead({ ...editedLead, industry_vertical: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_VERTICALS.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.industry_vertical || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Decision Maker Level</label>
          {isEditing ? (
            <Select
              value={editedLead.decision_maker_level || ""}
              onValueChange={(value) =>
                setEditedLead({ ...editedLead, decision_maker_level: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {DECISION_MAKER_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.decision_maker_level || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Need Urgency</label>
          {isEditing ? (
            <Select
              value={editedLead.need_urgency || ""}
              onValueChange={(value) =>
                setEditedLead({ ...editedLead, need_urgency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {NEED_URGENCY.map((urgency) => (
                  <SelectItem key={urgency} value={urgency}>
                    {urgency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.need_urgency || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Project Timeline</label>
          {isEditing ? (
            <Select
              value={editedLead.project_timeline || ""}
              onValueChange={(value) =>
                setEditedLead({ ...editedLead, project_timeline: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TIMELINES.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.project_timeline || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Annual Revenue Range</label>
          {isEditing ? (
            <Select
              value={editedLead.annual_revenue_range || ""}
              onValueChange={(value) =>
                setEditedLead({ ...editedLead, annual_revenue_range: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select revenue range" />
              </SelectTrigger>
              <SelectContent>
                {ANNUAL_REVENUE_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{lead.annual_revenue_range || "-"}</p>
          )}
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm text-muted-foreground">Technology Stack</label>
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {editedLead.technology_stack?.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground"
                  >
                    <span>{tech}</span>
                    <button
                      onClick={() => handleRemoveTech(tech)}
                      className="ml-1 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {TECHNOLOGY_STACK_OPTIONS.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handlePresetTech(tech)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      editedLead.technology_stack?.includes(tech)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add custom technology..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                />
                <Button 
                  onClick={handleAddTech} 
                  disabled={!newTech.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(lead.technology_stack || []).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                >
                  {tech}
                </span>
              ))}
              {(!lead.technology_stack || lead.technology_stack.length === 0) && (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

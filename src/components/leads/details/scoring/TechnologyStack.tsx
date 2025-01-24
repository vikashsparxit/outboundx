import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lead } from "@/types/lead";
import { TECHNOLOGY_STACK_OPTIONS } from "@/constants/leadOptions";
import { useState } from "react";

interface TechnologyStackProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
}

export const TechnologyStack = ({
  lead,
  isEditing,
  editedLead,
  setEditedLead,
}: TechnologyStackProps) => {
  const [newTech, setNewTech] = useState("");

  const handleAddTech = () => {
    if (newTech.trim()) {
      const techToAdd = newTech.trim();
      const updatedTechStack = [...(editedLead.technology_stack || [])];
      if (!updatedTechStack.includes(techToAdd)) {
        updatedTechStack.push(techToAdd);
        console.log('Adding custom tech:', techToAdd, 'New stack:', updatedTechStack);
        setEditedLead({ ...editedLead, technology_stack: updatedTechStack });
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
    <div className="space-y-2">
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
                  type="button"
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
                type="button"
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
              type="button"
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
  );
};
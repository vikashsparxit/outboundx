import { Lead } from "@/types/lead";

interface TechnologyStackProps {
  lead: Lead | Partial<Lead>;
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
  const displayLead = isEditing ? editedLead : lead;
  
  const handleRemoveTechnology = (techToRemove: string) => {
    const newTechStack = editedLead.technology_stack?.filter(tech => tech !== techToRemove) || [];
    setEditedLead({ ...editedLead, technology_stack: newTechStack });
  };

  return (
    <div>
      <label className="text-sm text-muted-foreground">Technology Stack</label>
      {isEditing ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {editedLead.technology_stack?.map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded"
            >
              <span>{tech}</span>
              <button
                onClick={() => handleRemoveTechnology(tech)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mt-2">
          {displayLead.technology_stack?.map((tech, index) => (
            <div
              key={index}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              {tech}
            </div>
          )) || "-"}
        </div>
      )}
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";

interface LeadEditActionsProps {
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const LeadEditActions = ({
  isEditing,
  isUpdating,
  onEdit,
  onSave,
  onCancel,
}: LeadEditActionsProps) => {
  if (isEditing) {
    return (
      <div className="fixed bottom-0 right-0 w-[540px] sm:w-[540px] p-4 bg-background border-t border-border flex gap-2 justify-end items-center">
        <Button 
          onClick={onSave} 
          disabled={isUpdating} 
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isUpdating}
          size="sm"
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onEdit}
      className="flex items-center gap-2"
    >
      <Edit2 className="h-4 w-4" />
      Edit
    </Button>
  );
};
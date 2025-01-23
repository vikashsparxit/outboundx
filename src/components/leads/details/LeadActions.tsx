import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface LeadActionsProps {
  isEditing: boolean;
  isUpdating: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const LeadActions = ({ isEditing, isUpdating, onSave, onCancel }: LeadActionsProps) => {
  if (!isEditing) return null;

  return (
    <div className="fixed bottom-0 right-0 w-[400px] p-4 bg-background border-t border-border flex gap-2 justify-end items-center">
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
};
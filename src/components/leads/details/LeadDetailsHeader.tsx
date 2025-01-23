import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LeadEditActions } from "./LeadEditActions";

interface LeadDetailsHeaderProps {
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const LeadDetailsHeader = ({
  isEditing,
  isUpdating,
  onEdit,
  onSave,
  onCancel,
}: LeadDetailsHeaderProps) => {
  return (
    <SheetHeader>
      <div className="flex items-center justify-between">
        <SheetTitle>Lead Details</SheetTitle>
        <LeadEditActions
          isEditing={isEditing}
          isUpdating={isUpdating}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </SheetHeader>
  );
};
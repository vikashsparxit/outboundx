import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { Lead } from "@/types/lead";

interface LeadRowActionsProps {
  lead: Lead;
  isAdmin: boolean;
  onView: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const LeadRowActions = ({ lead, isAdmin, onView, onDelete }: LeadRowActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onView(lead);
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lead);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
};

export default LeadRowActions;
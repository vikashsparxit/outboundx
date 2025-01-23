import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { Lead } from "@/types/lead";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeadRowActionsProps {
  lead: Lead;
  isAdmin: boolean;
  onView: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const LeadRowActions = ({ lead, isAdmin, onView, onDelete }: LeadRowActionsProps) => {
  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onView(lead);
              }}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View lead details</p>
          </TooltipContent>
        </Tooltip>

        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(lead);
                }}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete lead</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default LeadRowActions;
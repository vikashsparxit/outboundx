import { Button } from "@/components/ui/button";
import { Lead } from "@/types/lead";

interface LeadStatusUpdateProps {
  lead: Lead;
  isUpdating: boolean;
  onStatusUpdate: (status: Lead['status']) => void;
}

export const LeadStatusUpdate = ({ lead, isUpdating, onStatusUpdate }: LeadStatusUpdateProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Update Status</h3>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating || lead.status === "new"}
          onClick={() => onStatusUpdate("new")}
        >
          New
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating || lead.status === "contacted"}
          onClick={() => onStatusUpdate("contacted")}
        >
          Contacted
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating || lead.status === "in_progress"}
          onClick={() => onStatusUpdate("in_progress")}
        >
          In Progress
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating || lead.status === "closed_won"}
          onClick={() => onStatusUpdate("closed_won")}
        >
          Closed Won
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating || lead.status === "closed_lost"}
          onClick={() => onStatusUpdate("closed_lost")}
        >
          Closed Lost
        </Button>
      </div>
    </div>
  );
};
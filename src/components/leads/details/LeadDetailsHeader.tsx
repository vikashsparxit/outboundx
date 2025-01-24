import { Button } from "@/components/ui/button";
import { Edit, Save, X, Brain } from "lucide-react";
import { Lead } from "@/types/lead";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";

interface LeadDetailsHeaderProps {
  lead: Lead;
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const LeadDetailsHeader = ({
  lead,
  isEditing,
  isUpdating,
  onEdit,
  onSave,
  onCancel,
}: LeadDetailsHeaderProps) => {
  const { analyzeLead, isAnalyzing } = useLeadAnalysis();

  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <h2 className="text-lg font-semibold">Lead Details</h2>
      <div className="flex items-center gap-2">
        {!isEditing && lead.domain_type === 'business' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => analyzeLead(lead.id)}
            disabled={isAnalyzing}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        )}
        {isEditing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              disabled={isUpdating}
            >
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};
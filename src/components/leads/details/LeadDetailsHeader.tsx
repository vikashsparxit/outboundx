import { Button } from "@/components/ui/button";
import { Edit, Save, X, Brain, Eye } from "lucide-react";
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

  // Check if lead has been analyzed
  const hasAnalysis = lead.lead_activities?.some(
    activity => activity.activity_type === 'ai_analysis'
  ) ?? false;

  const handleAnalyzeClick = async () => {
    if (lead.domain_type !== 'business') return;
    
    const analysis = await analyzeLead(lead.id);
    if (analysis) {
      // Find and scroll to analysis section after a short delay to ensure it's rendered
      setTimeout(() => {
        const analysisSection = document.querySelector('.lead-analysis-section');
        if (analysisSection) {
          analysisSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <h2 className="text-lg font-semibold">Lead Details</h2>
      <div className="flex items-center gap-2">
        {!isEditing && lead.domain_type === 'business' && (
          <Button
            variant="outline"
            size="sm"
            onClick={hasAnalysis ? () => {
              const analysisSection = document.querySelector('.lead-analysis-section');
              if (analysisSection) {
                analysisSection.scrollIntoView({ behavior: 'smooth' });
              }
            } : handleAnalyzeClick}
            disabled={isAnalyzing}
          >
            {hasAnalysis ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                View Analysis
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </>
            )}
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
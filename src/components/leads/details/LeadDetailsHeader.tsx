import { Button } from "@/components/ui/button";
import { Edit, Save, X, Brain, Eye, Maximize2, Minimize2 } from "lucide-react";
import { Lead } from "@/types/lead";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";

interface LeadDetailsHeaderProps {
  lead: Lead;
  isEditing: boolean;
  isUpdating: boolean;
  isFullScreen: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleFullScreen: () => void;
}

export const LeadDetailsHeader = ({
  lead,
  isEditing,
  isUpdating,
  isFullScreen,
  onEdit,
  onSave,
  onCancel,
  onToggleFullScreen,
}: LeadDetailsHeaderProps) => {
  const { analyzeLead, isAnalyzing, hasBeenAnalyzed } = useLeadAnalysis(lead.id);

  const handleAnalyzeClick = async () => {
    if (lead.domain_type !== 'business') return;
    
    if (hasBeenAnalyzed) {
      const analysisSection = document.querySelector('.lead-analysis-section');
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const analysis = await analyzeLead(lead.id);
    if (analysis) {
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
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFullScreen}
          className="hidden sm:flex"
        >
          {isFullScreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        
        {!isEditing && lead.domain_type === 'business' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
          >
            {hasBeenAnalyzed ? (
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
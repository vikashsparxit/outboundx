import { Progress } from "@/components/ui/progress";
import { Lead } from "@/types/lead";
import { TrendingDown, TrendingUp } from "lucide-react";
import ScoreTooltip from "./ScoreTooltip";

interface BeamScoreCellProps {
  lead: Lead;
  previousScore?: number;
}

const BeamScoreCell = ({ lead, previousScore }: BeamScoreCellProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getTrendIcon = () => {
    if (!previousScore || previousScore === lead.beam_score) return null;
    return lead.beam_score > previousScore ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const scoreColor = getScoreColor(lead.beam_score || 0);

  return (
    <ScoreTooltip lead={lead}>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${scoreColor}`}>
              {lead.beam_score || 0}
            </span>
            {getTrendIcon()}
          </div>
          <Progress 
            value={lead.beam_score || 0} 
            className="h-2"
          />
        </div>
      </div>
    </ScoreTooltip>
  );
};

export default BeamScoreCell;
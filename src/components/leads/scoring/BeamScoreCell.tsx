import { Progress } from "@/components/ui/progress";
import { Lead } from "@/types/lead";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingDown, TrendingUp } from "lucide-react";

interface BeamScoreCellProps {
  lead: Lead;
  previousScore?: number;
}

const BeamScoreCell = ({ lead, previousScore }: BeamScoreCellProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = () => {
    if (!previousScore || previousScore === lead.beam_score) return null;
    return lead.beam_score > previousScore ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${getScoreColor(lead.beam_score || 0)}`}>
                  {lead.beam_score || 0}
                </span>
                {getTrendIcon()}
              </div>
              <Progress value={lead.beam_score || 0} className="h-2" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <h4 className="font-semibold">BEAM Score Breakdown</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-sm">BANT Score:</span>
              <span className="text-sm font-medium">{lead.bant_score || 0}/25</span>
              <span className="text-sm">Engagement Score:</span>
              <span className="text-sm font-medium">{lead.engagement_score || 0}/25</span>
              <span className="text-sm">Account Score:</span>
              <span className="text-sm font-medium">{lead.account_score || 0}/25</span>
              <span className="text-sm">Market Score:</span>
              <span className="text-sm font-medium">{lead.market_score || 0}/25</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BeamScoreCell;
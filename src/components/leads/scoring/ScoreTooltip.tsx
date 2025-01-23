import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Lead } from "@/types/lead";

interface ScoreTooltipProps {
  lead: Lead;
  children: React.ReactNode;
}

const ScoreTooltip = ({ lead, children }: ScoreTooltipProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 20) return "text-green-600";
    if (score >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">BEAM Score Breakdown</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">BANT Score</span>
                  <span className={`text-sm font-medium ${getScoreColor(lead.bant_score || 0)}`}>
                    {lead.bant_score || 0}/25
                  </span>
                </div>
                <Progress value={((lead.bant_score || 0) / 25) * 100} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Engagement Score</span>
                  <span className={`text-sm font-medium ${getScoreColor(lead.engagement_score || 0)}`}>
                    {lead.engagement_score || 0}/25
                  </span>
                </div>
                <Progress value={((lead.engagement_score || 0) / 25) * 100} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Account Score</span>
                  <span className={`text-sm font-medium ${getScoreColor(lead.account_score || 0)}`}>
                    {lead.account_score || 0}/25
                  </span>
                </div>
                <Progress value={((lead.account_score || 0) / 25) * 100} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Market Score</span>
                  <span className={`text-sm font-medium ${getScoreColor(lead.market_score || 0)}`}>
                    {lead.market_score || 0}/25
                  </span>
                </div>
                <Progress value={((lead.market_score || 0) / 25) * 100} className="h-1" />
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScoreTooltip;
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Lead } from "@/types/lead";

interface ScoreBreakdownProps {
  lead: Lead;
}

const ScoreBreakdown = ({ lead }: ScoreBreakdownProps) => {
  const maxScore = 25; // Each component has a max of 25 points

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">BEAM Score Breakdown</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">BANT Score</span>
            <span className="text-sm font-medium">{lead.bant_score || 0}/{maxScore}</span>
          </div>
          <Progress value={((lead.bant_score || 0) / maxScore) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Account Score</span>
            <span className="text-sm font-medium">{lead.account_score || 0}/{maxScore}</span>
          </div>
          <Progress value={((lead.account_score || 0) / maxScore) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Engagement Score</span>
            <span className="text-sm font-medium">{lead.engagement_score || 0}/{maxScore}</span>
          </div>
          <Progress value={((lead.engagement_score || 0) / maxScore) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Market Score</span>
            <span className="text-sm font-medium">{lead.market_score || 0}/{maxScore}</span>
          </div>
          <Progress value={((lead.market_score || 0) / maxScore) * 100} className="h-2" />
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Total BEAM Score</span>
            <span className="font-semibold">{lead.beam_score || 0}/100</span>
          </div>
          <Progress value={lead.beam_score || 0} className="h-3" />
        </div>
      </div>
    </Card>
  );
};

export default ScoreBreakdown;
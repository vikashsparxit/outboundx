import { Lead } from "@/types/lead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";

interface LeadAnalysisProps {
  lead: Lead;
}

const LeadAnalysis = ({ lead }: LeadAnalysisProps) => {
  const { analysis } = useLeadAnalysis(lead.id);
  
  if (!analysis) return null;

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Remove asterisks and numbers at the start of lines
        const cleanLine = line.replace(/^[\d.*\s]+/, '').trim();
        if (!cleanLine) return null;

        // Check if it's a score line
        if (cleanLine.toLowerCase().includes('score:')) {
          const [label, score] = cleanLine.split(':').map(s => s.trim());
          return (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium">{label}</span>
              <span className="text-blue-600 font-semibold">{score}</span>
            </div>
          );
        }

        // Regular content line
        return (
          <p key={index} className="py-2">
            {cleanLine}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">AI Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          {formatContent(analysis)}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadAnalysis;
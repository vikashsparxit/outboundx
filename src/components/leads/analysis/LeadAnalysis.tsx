import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lead } from "@/types/lead";

interface LeadAnalysisProps {
  lead: Lead;
}

const LeadAnalysis = ({ lead }: LeadAnalysisProps) => {
  const aiAnalysis = lead.lead_activities?.find(
    activity => activity.activity_type === 'ai_analysis'
  );

  if (!aiAnalysis) return null;

  const formatAnalysis = (description: string) => {
    const sections = description.split(/\d+\./);
    return sections.filter(Boolean).map(section => {
      const [title, ...content] = section.split('\n');
      return {
        title: title.trim(),
        content: content.filter(Boolean).map(line => line.trim())
      };
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5" />
        <h3 className="text-lg font-semibold">AI Analysis</h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {formatAnalysis(aiAnalysis.description).map((section, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium">{section.title}</h4>
              <ul className="list-disc list-inside space-y-1">
                {section.content.map((line, lineIndex) => (
                  <li key={lineIndex} className="text-sm text-muted-foreground">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default LeadAnalysis;
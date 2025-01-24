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
    // Remove asterisks and clean up formatting
    const cleanDescription = description.replace(/\*\*/g, '');
    const sections = cleanDescription.split(/\d+\./);
    return sections.filter(Boolean).map(section => {
      const [title, ...content] = section.split('\n');
      return {
        title: title.trim(),
        content: content.filter(Boolean).map(line => 
          line.trim().replace(/^[-•]\s*/, '').replace(/\*\*/g, '')
        )
      };
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Analysis</h3>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {formatAnalysis(aiAnalysis.description).map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-base font-semibold text-primary">
                {section.title}
              </h4>
              <div className="space-y-2">
                {section.content.map((line, lineIndex) => {
                  if (line.toLowerCase().includes("rating")) {
                    const [label, score] = line.split(":");
                    return (
                      <div key={lineIndex} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{label}:</span>
                        <span className="text-sm font-bold text-primary">{score}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={lineIndex} className="text-sm text-muted-foreground leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default LeadAnalysis;
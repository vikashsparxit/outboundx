import { Lead } from "@/types/lead";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, MessageSquare, Building, DollarSign, Percent, Users, Globe, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadAnalysisProps {
  lead: Lead;
}

const LeadAnalysis = ({ lead }: LeadAnalysisProps) => {
  const { analysis } = useLeadAnalysis(lead.id);
  
  if (!analysis) {
    console.log('No analysis found for lead:', lead.id);
    return null;
  }

  console.log('Rendering analysis:', analysis);

  // Clean up the analysis text by removing JSON formatting artifacts
  const cleanAnalysis = analysis.replace(/```json|```/g, '').trim();

  // Split the analysis into sections and clean up the formatting
  const sections = cleanAnalysis.split('\n\n')
    .filter(Boolean)
    .map(section => {
      const [title, ...content] = section.split('\n');
      const score = content.find(line => 
        line.toLowerCase().includes('score:') || 
        line.toLowerCase().includes('rating:')
      );
      
      const cleanTitle = title
        .replace(/^\d+\.\s*/, '')
        .replace(/\*+/g, '')
        .replace(/:/g, '')
        .trim();
      
      const cleanContent = content
        .filter(line => line.trim() && !line.includes('score:') && !line.includes('rating:'))
        .map(line => 
          line
            .replace(/^[-•*]\s*/, '')
            .replace(/\*+/g, '')
            .replace(/^"/, '')
            .replace(/"$/, '')
            .trim()
        );

      const scoreValue = score 
        ? score.split(':')[1]?.trim().replace(/\/.*$/, '').replace(/\*+/g, '').trim()
        : undefined;

      return {
        title: cleanTitle,
        score: scoreValue,
        content: cleanContent.filter(item => item.length > 0) // Only keep non-empty content
      };
    })
    .filter(section => section.content.length > 0); // Only keep sections with content

  const getIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('message') || lowerTitle.includes('communication')) return MessageSquare;
    if (lowerTitle.includes('company') || lowerTitle.includes('business')) return Building;
    if (lowerTitle.includes('opportunity') || lowerTitle.includes('revenue')) return DollarSign;
    if (lowerTitle.includes('market') || lowerTitle.includes('industry')) return Globe;
    if (lowerTitle.includes('team') || lowerTitle.includes('employee')) return Users;
    if (lowerTitle.includes('project') || lowerTitle.includes('engagement')) return Briefcase;
    return Percent;
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 4) return "success";
    if (numScore <= 2) return "destructive";
    return "secondary";
  };

  const getProgressColor = (score: number) => {
    if (score >= 4) return "bg-green-500";
    if (score <= 2) return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">AI Analysis Results</h3>
        <Badge variant="outline" className="text-sm">
          {new Date(lead.updated_at || "").toLocaleDateString()}
        </Badge>
      </div>
      
      {/* Score Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {sections.map((section, index) => section.score && (
          <Card key={`score-${index}`} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              {React.createElement(getIcon(section.title), { className: "h-5 w-5 text-muted-foreground" })}
              <h4 className="font-medium text-sm">{section.title}</h4>
            </div>
            <Progress 
              value={parseInt(section.score) * 20} 
              className="h-2 mb-2"
              indicatorClassName={cn(getProgressColor(parseInt(section.score)))}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Score</span>
              <Badge variant={getScoreColor(section.score)} className="text-xs">
                {section.score}/5
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-4">
        {sections.map((section, index) => (
          <Card key={index} className="overflow-hidden">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    {React.createElement(getIcon(section.title), { 
                      className: "h-5 w-5 text-muted-foreground" 
                    })}
                    <div>
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      {section.score && (
                        <p className="text-sm text-muted-foreground">
                          Confidence Score: {section.score}/5
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 ease-in-out transform group-data-[state=open]:rotate-180" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="border-t border-gray-100 space-y-2 pb-4">
                  {section.content.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 py-1">
                      <span className="text-gray-400 mt-1.5">•</span>
                      <p className="text-gray-600 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadAnalysis;
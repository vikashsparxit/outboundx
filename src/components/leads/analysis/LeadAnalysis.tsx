import { Lead } from "@/types/lead";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, MessageSquare, Building, DollarSign, Percent } from "lucide-react";

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
  const sections = cleanAnalysis.split('\n\n').filter(Boolean).map(section => {
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
      content: cleanContent
    };
  });

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('message')) return <MessageSquare className="h-5 w-5" />;
    if (title.toLowerCase().includes('company')) return <Building className="h-5 w-5" />;
    if (title.toLowerCase().includes('opportunity')) return <DollarSign className="h-5 w-5" />;
    return <Percent className="h-5 w-5" />;
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 4) return "success";
    if (numScore <= 2) return "warning";
    return "secondary";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">AI Analysis Results</h3>
        <Badge variant="outline" className="text-sm">
          {new Date(lead.updated_at || "").toLocaleDateString()}
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {sections.map((section, index) => (
          <Card key={index} className="overflow-hidden">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    {getIcon(section.title)}
                    <div>
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      {section.score && (
                        <p className="text-sm text-muted-foreground">
                          Confidence Score: {section.score}/5
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {section.score && (
                      <Badge 
                        variant={getScoreColor(section.score)}
                        className="text-sm px-3"
                      >
                        Score: {section.score}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 ease-in-out transform group-data-[state=open]:rotate-180" />
                  </div>
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
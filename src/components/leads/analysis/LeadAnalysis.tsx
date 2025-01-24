import { Lead } from "@/types/lead";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

  // Split the analysis into sections and clean up the formatting
  const sections = analysis.split('\n\n').filter(Boolean).map(section => {
    const [title, ...content] = section.split('\n');
    const score = content.find(line => 
      line.toLowerCase().includes('score:') || 
      line.toLowerCase().includes('rating:')
    );
    
    // Clean up the title by removing numbers, asterisks and colons
    const cleanTitle = title
      .replace(/^\d+\.\s*/, '')
      .replace(/\*+/g, '')
      .replace(/:/g, '')
      .trim();
    
    // Clean up and structure the content
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

    // Extract score value and clean it up
    const scoreValue = score 
      ? score.split(':')[1]?.trim().replace(/\/.*$/, '').replace(/\*+/g, '').trim()
      : undefined;

    return {
      title: cleanTitle,
      score: scoreValue,
      content: cleanContent
    };
  });

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-xl font-semibold text-gray-900">AI Analysis Results</h3>
      
      <div className="space-y-4">
        {sections.map((section, index) => (
          <Collapsible key={index}>
            <div className="bg-white rounded-lg border border-gray-200">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-5">
                  <h4 className="text-lg font-medium text-gray-900">{section.title}</h4>
                  <div className="flex items-center gap-2">
                    {section.score && (
                      <Badge variant="secondary" className="text-sm px-3">
                        Score {section.score}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 ease-in-out transform group-data-[state=open]:rotate-180" />
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-3 border-t border-gray-100">
                  {section.content.map((line, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default LeadAnalysis;
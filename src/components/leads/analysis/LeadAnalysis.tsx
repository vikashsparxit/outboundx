import { Lead } from "@/types/lead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface LeadAnalysisProps {
  lead: Lead;
}

interface AnalysisSection {
  title: string;
  content: string[];
  score?: string;
}

const LeadAnalysis = ({ lead }: LeadAnalysisProps) => {
  const { analysis } = useLeadAnalysis(lead.id);
  
  if (!analysis) {
    console.log('No analysis found for lead:', lead.id);
    return null;
  }

  console.log('Rendering analysis:', analysis);

  const parseAnalysis = (content: string): AnalysisSection[] => {
    const sections: AnalysisSection[] = [];
    let currentSection: AnalysisSection | null = null;

    content.split('\n').forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      if (cleanLine.endsWith(':')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: cleanLine.slice(0, -1),
          content: [],
        };
      } else if (currentSection) {
        // Handle score lines
        if (cleanLine.toLowerCase().includes('score:') || cleanLine.toLowerCase().includes('rating:')) {
          const [, score] = cleanLine.split(/:\s*/);
          currentSection.score = score?.trim();
        } else {
          // Clean up bullet points and other markers
          const contentLine = cleanLine.replace(/^[-•*]\s*/, '').trim();
          if (contentLine) {
            currentSection.content.push(contentLine);
          }
        }
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseAnalysis(analysis);
  console.log('Parsed sections:', sections);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">AI Analysis Results</h3>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section, index) => (
            <AccordionItem 
              key={index} 
              value={`section-${index}`}
              className="px-4"
            >
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-left">{section.title}</span>
                  {section.score && (
                    <span className="text-blue-600 font-semibold ml-2 px-2 py-1 bg-blue-50 rounded">
                      {section.score}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-3 space-y-2">
                  {section.content.map((line, i) => (
                    <p 
                      key={i} 
                      className="text-gray-700 leading-relaxed pl-2 border-l-2 border-gray-200"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default LeadAnalysis;
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

      // Remove asterisks and numbers from the start of the line
      const processedLine = cleanLine.replace(/^[\d.*\s]+/, '').trim();
      
      // Check if it's a section header (ends with ':')
      if (processedLine.endsWith(':')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: processedLine.slice(0, -1),
          content: [],
        };
      } 
      // Check if it's a score line
      else if (processedLine.toLowerCase().includes('score:') || processedLine.toLowerCase().includes('rating:')) {
        if (currentSection) {
          const [, score] = processedLine.split(/:\s*/);
          currentSection.score = score?.trim();
        }
      }
      // Regular content line
      else if (currentSection) {
        // Remove bullet points and clean the line
        const contentLine = processedLine.replace(/^[-•]\s*/, '').trim();
        if (contentLine) {
          currentSection.content.push(contentLine);
        }
      }
    });

    // Don't forget to add the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseAnalysis(analysis);
  console.log('Parsed sections:', sections);

  return (
    <Card className="mt-6 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">AI Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {sections.map((section, index) => (
            <AccordionItem 
              key={index} 
              value={`section-${index}`}
              className="border rounded-lg px-4 py-2 bg-white shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-left">{section.title}</span>
                  {section.score && (
                    <span className="text-blue-600 font-semibold ml-2">
                      {section.score}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-2 text-sm text-muted-foreground">
                  {section.content.map((line, i) => (
                    <p key={i} className="leading-relaxed">{line}</p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LeadAnalysis;
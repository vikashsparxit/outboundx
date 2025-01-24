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
  
  if (!analysis) return null;

  const parseAnalysis = (content: string): AnalysisSection[] => {
    const sections: AnalysisSection[] = [];
    let currentSection: AnalysisSection | null = null;

    content.split('\n').forEach(line => {
      // Clean the line by removing asterisks, numbers, and extra whitespace
      const cleanLine = line.replace(/^\d*\**\s*/, '').trim();
      if (!cleanLine) return;

      // Check if it's a section header (ends with ':')
      if (cleanLine.endsWith(':')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: cleanLine.slice(0, -1),
          content: [],
        };
      } 
      // Check if it's a score/rating line
      else if (cleanLine.includes('Score:') || cleanLine.toLowerCase().includes('rating:')) {
        const [label, score] = cleanLine.split(/:\s*/).map(s => s.trim());
        if (currentSection) {
          currentSection.score = score;
        }
      }
      // Check if it's a subsection (starts with a dash or bullet)
      else if (cleanLine.startsWith('-')) {
        if (currentSection) {
          currentSection.content.push(cleanLine.substring(1).trim());
        }
      }
      // Regular content line
      else if (currentSection) {
        currentSection.content.push(cleanLine);
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseAnalysis(analysis);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">AI Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {sections.map((section, index) => (
            <AccordionItem 
              key={index} 
              value={`section-${index}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{section.title}</span>
                  {section.score && (
                    <span className="text-blue-600 font-semibold ml-2">
                      {section.score}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  {section.content.map((line, i) => (
                    <p key={i}>{line}</p>
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
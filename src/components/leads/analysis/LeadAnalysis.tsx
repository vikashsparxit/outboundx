import { Lead } from "@/types/lead";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";

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

  // Split the analysis into sections
  const sections = analysis.split('\n\n').filter(Boolean).map(section => {
    const [title, ...content] = section.split('\n');
    const score = content.find(line => 
      line.toLowerCase().includes('score:') || 
      line.toLowerCase().includes('rating:')
    );
    
    return {
      title: title.replace(/^\d+\.\s*\*+|\*+/g, '').trim(),
      score: score ? score.split(':')[1]?.trim() : undefined,
      content: content
        .filter(line => line.trim() && !line.includes('score:') && !line.includes('rating:'))
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
    };
  });

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">AI Analysis Results</h3>
      
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-medium text-gray-900">{section.title}</h4>
              {section.score && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {section.score}
                </span>
              )}
            </div>
            <div className="pl-4 border-l-2 border-gray-200 space-y-2">
              {section.content.map((line, i) => (
                <p key={i} className="text-gray-600">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadAnalysis;
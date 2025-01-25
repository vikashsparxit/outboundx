import React from "react";
import { Lead } from "@/types/lead";
import { useLeadAnalysis } from "@/hooks/use-lead-analysis";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, MessageSquare, Building, DollarSign, Percent, Users, Globe, Briefcase, AlertCircle, Check, Info } from "lucide-react";
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
        content: cleanContent.filter(item => item.length > 0)
      };
    })
    .filter(section => section.content.length > 0);

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

  const getConfidenceIcon = (content: string) => {
    if (content.toLowerCase().includes('high')) return Check;
    if (content.toLowerCase().includes('low')) return AlertCircle;
    return Info;
  };

  const getConfidenceColor = (content: string) => {
    const level = content.toLowerCase();
    if (level.includes('high')) return "text-green-500";
    if (level.includes('low')) return "text-red-500";
    return "text-yellow-500";
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
          <Card key={`score-${index}`} className="p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-2">
              {React.createElement(getIcon(section.title), { className: "h-5 w-5 text-muted-foreground" })}
              <h4 className="font-medium text-sm">{section.title}</h4>
            </div>
            <Progress 
              value={parseInt(section.score) * 20} 
              className={cn("h-2 mb-2", getProgressColor(parseInt(section.score)))}
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
          <Card key={index} className="overflow-hidden group">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors duration-200">
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
                <CardContent className="border-t border-gray-100 space-y-4 pb-4 bg-gray-50/50">
                  {section.content.map((point, i) => {
                    const isConfidence = point.toLowerCase().includes('confidence:');
                    const Icon = isConfidence ? getConfidenceIcon(point) : null;
                    
                    return (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-white transition-colors duration-200">
                        {Icon && (
                          <Icon className={cn("h-5 w-5 mt-0.5", getConfidenceColor(point))} />
                        )}
                        <div className="flex-1">
                          {point.includes(':') ? (
                            <>
                              <span className="font-medium text-gray-700">
                                {point.split(':')[0]}:
                              </span>
                              <span className="text-gray-600 ml-1">
                                {point.split(':')[1]}
                              </span>
                            </>
                          ) : (
                            <p className="text-gray-600 leading-relaxed">{point}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
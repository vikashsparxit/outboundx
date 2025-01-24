import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId } = await req.json();
    console.log('Analyzing lead:', leadId);

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select(`
        *,
        lead_activities (
          activity_type,
          description,
          created_at
        )
      `)
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      throw new Error('Lead not found');
    }

    if (lead.domain_type !== 'business') {
      console.log('Skipping analysis for non-business email domain');
      return new Response(
        JSON.stringify({ 
          message: 'Skipped analysis - not a business email',
          analysis: null 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare comprehensive lead context
    const leadContext = {
      // Basic Information
      email: lead.email,
      message: lead.message,
      subject: lead.subject,
      
      // Company Details
      company_size: lead.company_size,
      industry_vertical: lead.industry_vertical,
      annual_revenue_range: lead.annual_revenue_range,
      
      // Technical Context
      technology_stack: lead.technology_stack,
      domains: lead.domains,
      
      // Project Details
      budget_range: lead.budget_range,
      need_urgency: lead.need_urgency,
      project_timeline: lead.project_timeline,
      
      // Previous Activities
      previous_activities: lead.lead_activities
    };

    // Call OpenAI API with enhanced prompt
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI sales assistant that analyzes business leads. 
            Provide a structured analysis in the following format:

            1. Message Quality Analysis:
            - Evaluate the clarity and specificity of the inquiry
            - Identify key pain points and requirements
            - Rate message quality (1-10)

            2. Company Profile:
            - Analyze company size and industry fit
            - Evaluate technology alignment
            - Assess growth potential
            
            3. Project Evaluation:
            - Budget appropriateness
            - Timeline feasibility
            - Technical complexity assessment
            
            4. Engagement Recommendations:
            - Suggested approach
            - Key talking points
            - Risk factors to consider

            5. Opportunity Score:
            - Provide a score (1-100) based on all factors
            - List top 3 reasons for the score`
          },
          {
            role: 'user',
            content: `Analyze this lead:\n${JSON.stringify(leadContext, null, 2)}`
          }
        ],
      }),
    });

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;
    console.log('AI Analysis completed:', analysis);

    // Store analysis in lead_activities
    const { error: activityError } = await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        activity_type: 'ai_analysis',
        description: analysis
      });

    if (activityError) {
      console.error('Error storing analysis:', activityError);
    }

    // Extract opportunity score from analysis
    const opportunityScoreMatch = analysis.match(/Opportunity Score:[\s\S]*?(\d+)/);
    const opportunityScore = opportunityScoreMatch ? parseInt(opportunityScoreMatch[1]) : null;

    // Update lead with opportunity score if found
    if (opportunityScore !== null) {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          market_score: Math.round(opportunityScore * 0.25) // Convert to 25-point scale
        })
        .eq('id', leadId);

      if (updateError) {
        console.error('Error updating lead score:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ analysis, opportunityScore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-lead function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
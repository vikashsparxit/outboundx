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

    // Enhanced lead context for better analysis
    const leadContext = {
      message: lead.message,
      subject: lead.subject,
      email: lead.email,
      emails: lead.emails,
      domain: lead.domain,
      website: lead.website,
      company_size: lead.company_size,
      industry_vertical: lead.industry_vertical,
      annual_revenue_range: lead.annual_revenue_range,
      technology_stack: lead.technology_stack,
      domains: lead.domains,
      budget_range: lead.budget_range,
      need_urgency: lead.need_urgency,
      project_timeline: lead.project_timeline,
      country: lead.country,
      city: lead.city,
      state: lead.state,
      previous_activities: lead.lead_activities
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant specialized in analyzing sales leads and discovering business opportunities. 
            Analyze the provided lead information in detail, focusing on these key areas:

            1. Message Analysis (Score: 1-5)
            - Analyze email message content, tone, and quality
            - Identify key requirements and pain points
            - Extract timeline and budget indicators
            - Assess communication style and professionalism

            2. Contact Quality (Score: 1-5)
            - Evaluate email domain quality (business vs personal)
            - Assess contact information completeness
            - Determine decision-maker level
            - Check for multiple contact points

            3. Company Assessment (Score: 1-5)
            - Analyze company size and market position
            - Evaluate industry vertical and market potential
            - Review technology stack and technical sophistication
            - Identify growth indicators and company maturity

            4. Opportunity Evaluation (Score: 1-5)
            - Assess project scope and complexity
            - Evaluate budget potential and resource requirements
            - Analyze timeline and urgency factors
            - Calculate conversion probability

            For each section:
            - Provide a detailed analysis
            - Include specific evidence from the data
            - Assign a score (1-5)
            - List key findings and recommendations

            Return the analysis in this format:
            1. Message Analysis
            Score: X/5
            Analysis: [detailed analysis]
            Key Findings:
            - [bullet points]
            
            [Repeat for each section]`
          },
          {
            role: 'user',
            content: `Analyze this lead and provide detailed insights:\n${JSON.stringify(leadContext, null, 2)}`
          }
        ],
      }),
    });

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;
    
    // Extract discoveries from the analysis
    const discoveryMatch = analysis.match(/\{[\s\S]*\}/);
    if (discoveryMatch) {
      try {
        const { discoveries } = JSON.parse(discoveryMatch[0]);
        console.log('Extracted discoveries:', discoveries);

        // Store discoveries in the database
        for (const discovery of discoveries) {
          const { error: discoveryError } = await supabase
            .from('lead_discoveries')
            .insert({
              lead_id: leadId,
              ...discovery
            });

          if (discoveryError) {
            console.error('Error storing discovery:', discoveryError);
          }
        }
      } catch (error) {
        console.error('Error parsing discoveries:', error);
      }
    }

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

    return new Response(
      JSON.stringify({ 
        analysis,
        message: 'Analysis completed and discoveries stored'
      }),
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
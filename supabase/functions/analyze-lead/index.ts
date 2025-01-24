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

    // Enhanced lead context for better analysis
    const leadContext = {
      // Basic Information
      email: lead.email,
      message: lead.message,
      subject: lead.subject,
      domain: lead.domain,
      website: lead.website,
      
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
      
      // Location Information
      country: lead.country,
      city: lead.city,
      state: lead.state,
      
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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI sales assistant specializing in B2B lead analysis and company research.
            Analyze the lead data and provide a comprehensive analysis in the following format:

            1. Message Quality Analysis:
            - Evaluate inquiry clarity and specificity
            - Identify key pain points and requirements
            - Assess communication style and professionalism
            - Rate message quality (1-10)

            2. Company Research:
            - Company size and market position
            - Industry analysis and market trends
            - Key business challenges and opportunities
            - Technology landscape and requirements
            - Competitive analysis
            - Growth indicators and potential

            3. BEAM Score Components:
            - Budget Range Assessment (suggest if not provided)
            - Decision Maker Level Analysis (infer from communication)
            - Need Urgency Evaluation (based on message context)
            - Project Timeline Analysis
            - Company Size Verification
            - Industry Vertical Confirmation
            - Technology Stack Recommendations

            4. Project Evaluation:
            - Budget appropriateness and ROI potential
            - Timeline feasibility
            - Technical complexity assessment
            - Resource requirements
            - Risk factors and mitigation strategies
            
            5. Engagement Strategy:
            - Recommended approach
            - Key talking points
            - Value proposition alignment
            - Next steps and action items

            6. Opportunity Score:
            - Provide a score (1-100) based on all factors
            - List top 3 reasons for the score
            - Highlight key differentiators

            Additionally, extract and provide the following data points in a structured JSON format:
            {
              "budget_range": "string (Enterprise ($100k+), Mid-Market ($50k-$100k), Small Business ($10k-$50k), Startup (Under $10k))",
              "decision_maker_level": "string (C-Level Executive, VP / Director, Senior Manager, Manager, Individual Contributor)",
              "need_urgency": "string (Immediate Need, Next Quarter, Within 6 Months, Future Consideration)",
              "project_timeline": "string (Immediate Start, 1-3 Months, 3-6 Months, 6+ Months)",
              "company_size": "string (Enterprise (1000+ employees), Mid-Market (100-999 employees), Small Business (10-99 employees), Startup (1-9 employees))",
              "industry_vertical": "string",
              "annual_revenue_range": "string ($100M+, $50M-$100M, $10M-$50M, $1M-$10M, Under $1M)",
              "technology_stack": "string[]"
            }`
          },
          {
            role: 'user',
            content: `Analyze this lead and provide recommendations:\n${JSON.stringify(leadContext, null, 2)}`
          }
        ],
      }),
    });

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;
    console.log('AI Analysis completed:', analysis);

    // Extract JSON data from the analysis
    const jsonMatch = analysis.match(/\{[\s\S]*?\}/);
    let extractedData = {};
    if (jsonMatch) {
      try {
        extractedData = JSON.parse(jsonMatch[0]);
        console.log('Extracted BEAM data:', extractedData);

        // Update lead with extracted data
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            ...extractedData,
            updated_at: new Date().toISOString()
          })
          .eq('id', leadId);

        if (updateError) {
          console.error('Error updating lead with extracted data:', updateError);
        } else {
          console.log('Successfully updated lead with extracted data');
        }
      } catch (error) {
        console.error('Error parsing extracted data:', error);
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
      JSON.stringify({ 
        analysis, 
        opportunityScore,
        extractedData 
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
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
      email: lead.email,
      message: lead.message,
      subject: lead.subject,
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
            content: `You are an AI assistant specialized in analyzing business leads and discovering additional information. 
            Extract and validate information from the provided context, assigning confidence levels (high, medium, low) based on certainty.
            Focus on discovering:
            1. Additional contact information (phone numbers, email addresses)
            2. Company details (size, industry, revenue)
            3. Technology stack
            4. Location information
            
            Return the discoveries in this JSON format:
            {
              "discoveries": [
                {
                  "field_name": "string (e.g., phone_numbers, email, company_size)",
                  "discovered_value": "string",
                  "confidence_level": "high|medium|low",
                  "source": "string (where this information was found)",
                  "metadata": {}
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Analyze this lead and discover additional information:\n${JSON.stringify(leadContext, null, 2)}`
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
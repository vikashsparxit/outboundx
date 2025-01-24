import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getSystemPrompt } from './analysis-prompts.ts';
import { LeadContext, AnalysisResponse } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractBusinessDomain(email: string): string | null {
  if (!email) return null;
  
  const domain = email.split('@')[1];
  if (!domain) return null;

  // Remove common email provider domains
  const commonProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'ymail.com'];
  if (commonProviders.includes(domain.toLowerCase())) {
    return null;
  }

  return domain;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId } = await req.json();
    console.log('Analyzing lead:', leadId);

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch lead data
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

    // Extract business domain from email if available
    if (lead.email && lead.domain_type === 'business') {
      const businessDomain = extractBusinessDomain(lead.email);
      console.log('Extracted business domain:', businessDomain);
      
      if (businessDomain && businessDomain !== lead.domain) {
        // Update the lead's domain
        const { error: updateError } = await supabase
          .from('leads')
          .update({ domain: businessDomain })
          .eq('id', leadId);

        if (updateError) {
          console.error('Error updating lead domain:', updateError);
        } else {
          console.log('Updated lead domain to:', businessDomain);
          
          // Add a discovery for the business domain
          const { error: discoveryError } = await supabase
            .from('lead_discoveries')
            .insert({
              lead_id: leadId,
              field_name: 'business_domain',
              discovered_value: businessDomain,
              confidence_level: 'high',
              source: 'email_analysis',
              metadata: { extracted_from: lead.email }
            });

          if (discoveryError) {
            console.error('Error creating domain discovery:', discoveryError);
          }
        }
      }
    }

    // Prepare lead context for analysis
    const leadContext: LeadContext = {
      message: lead.message,
      subject: lead.subject,
      email: lead.email,
      emails: lead.emails,
      phone_numbers: lead.phone_numbers,
      domain: lead.domain,
      domain_type: lead.domain_type,
      website: lead.website,
      domains: lead.domains,
      company_size: lead.company_size,
      industry_vertical: lead.industry_vertical,
      annual_revenue_range: lead.annual_revenue_range,
      technology_stack: lead.technology_stack,
      budget_range: lead.budget_range,
      need_urgency: lead.need_urgency,
      project_timeline: lead.project_timeline,
      country: lead.country,
      city: lead.city,
      state: lead.state,
      previous_activities: lead.lead_activities
    };

    // Get AI analysis
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
            content: getSystemPrompt()
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
    
    // Extract discoveries and activity analysis
    const jsonMatch = analysis.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedData: AnalysisResponse = JSON.parse(jsonMatch[0]);
        console.log('Extracted data:', parsedData);

        // Store discoveries
        if (parsedData.discoveries) {
          for (const discovery of parsedData.discoveries) {
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
        }

        // Store activity analysis
        if (parsedData.activity_analysis) {
          const { error: analysisError } = await supabase
            .from('lead_activity_analysis')
            .upsert({
              lead_id: leadId,
              ...parsedData.activity_analysis,
              last_analyzed_at: new Date().toISOString()
            });

          if (analysisError) {
            console.error('Error storing activity analysis:', analysisError);
          }
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
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
        message: 'Analysis completed and data stored'
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
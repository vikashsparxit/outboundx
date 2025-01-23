import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "./activity-logger";

// BANT Score Components (max 25 points)
const calculateBantScore = (lead: any) => {
  let score = 0;
  
  // Budget (7 points)
  if (lead.budget_range) {
    switch (lead.budget_range.toLowerCase()) {
      case 'enterprise':
        score += 7;
        break;
      case 'mid-market':
        score += 5;
        break;
      case 'small business':
        score += 3;
        break;
    }
  }

  // Authority (6 points)
  if (lead.decision_maker_level) {
    switch (lead.decision_maker_level.toLowerCase()) {
      case 'c-level':
        score += 6;
        break;
      case 'director':
        score += 4;
        break;
      case 'manager':
        score += 2;
        break;
    }
  }

  // Need/Pain (6 points)
  if (lead.need_urgency) {
    switch (lead.need_urgency.toLowerCase()) {
      case 'immediate':
        score += 6;
        break;
      case 'next quarter':
        score += 4;
        break;
      case 'future':
        score += 2;
        break;
    }
  }

  // Timeline (6 points)
  if (lead.project_timeline) {
    switch (lead.project_timeline.toLowerCase()) {
      case 'immediate':
        score += 6;
        break;
      case '3 months':
        score += 4;
        break;
      case '6 months':
        score += 2;
        break;
    }
  }

  return score;
};

// Account Score Components (max 25 points)
const calculateAccountScore = (lead: any) => {
  let score = 0;

  // Company Size (10 points)
  if (lead.company_size) {
    switch (lead.company_size.toLowerCase()) {
      case 'enterprise':
        score += 10;
        break;
      case 'mid-market':
        score += 7;
        break;
      case 'small':
        score += 4;
        break;
    }
  }

  // Industry Vertical (8 points)
  if (lead.industry_vertical) {
    // Add priority industries that align with your target market
    const priorityIndustries = ['technology', 'healthcare', 'finance'];
    if (priorityIndustries.includes(lead.industry_vertical.toLowerCase())) {
      score += 8;
    } else {
      score += 4;
    }
  }

  // Annual Revenue (7 points)
  if (lead.annual_revenue_range) {
    switch (lead.annual_revenue_range.toLowerCase()) {
      case '>$100m':
        score += 7;
        break;
      case '$10m-$100m':
        score += 5;
        break;
      case '<$10m':
        score += 3;
        break;
    }
  }

  return score;
};

// Engagement Score Components (max 25 points)
const calculateEngagementScore = (lead: any) => {
  let score = 0;

  // Call Count (10 points)
  if (lead.call_count) {
    score += Math.min(lead.call_count * 2, 10);
  }

  // Email Response Rate (8 points)
  if (lead.bounce_count === 0) {
    score += 8;
  } else if (lead.bounce_count <= 2) {
    score += 4;
  }

  // Technology Stack Alignment (7 points)
  if (lead.technology_stack && Array.isArray(lead.technology_stack)) {
    const relevantTechCount = lead.technology_stack.length;
    score += Math.min(relevantTechCount * 2, 7);
  }

  return score;
};

// Market Score Components (max 25 points)
const calculateMarketScore = (lead: any) => {
  let score = 0;

  // Geographic Location (10 points)
  if (lead.country) {
    const priorityCountries = ['united states', 'canada', 'united kingdom'];
    if (priorityCountries.includes(lead.country.toLowerCase())) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // Lead Type Quality (8 points)
  if (lead.lead_type) {
    switch (lead.lead_type.toLowerCase()) {
      case 'referral':
        score += 8;
        break;
      case 'inbound':
        score += 6;
        break;
      case 'outbound':
        score += 4;
        break;
    }
  }

  // Client Type (7 points)
  if (lead.client_type) {
    switch (lead.client_type.toLowerCase()) {
      case 'enterprise':
        score += 7;
        break;
      case 'mid-market':
        score += 5;
        break;
      case 'small business':
        score += 3;
        break;
    }
  }

  return score;
};

export const calculateBeamScore = async (lead: any) => {
  const bantScore = calculateBantScore(lead);
  const accountScore = calculateAccountScore(lead);
  const engagementScore = calculateEngagementScore(lead);
  const marketScore = calculateMarketScore(lead);
  
  // Calculate total BEAM score (max 100 points)
  const beamScore = bantScore + accountScore + engagementScore + marketScore;

  // Store previous scores for history
  const previousScores = {
    bant_score: lead.bant_score,
    account_score: lead.account_score,
    engagement_score: lead.engagement_score,
    market_score: lead.market_score,
    beam_score: lead.beam_score
  };

  // Update scores in the database
  const { error } = await supabase
    .from('leads')
    .update({
      bant_score: bantScore,
      account_score: accountScore,
      engagement_score: engagementScore,
      market_score: marketScore,
      beam_score: beamScore
    })
    .eq('id', lead.id);

  if (error) {
    console.error('Error updating BEAM score:', error);
    throw error;
  }

  // Log the score update in scoring history
  await supabase
    .from('lead_scoring_history')
    .insert({
      lead_id: lead.id,
      previous_score: previousScores.beam_score,
      new_score: beamScore,
      score_type: 'beam',
      reason: 'Score recalculation'
    });

  // Log activity
  await logActivity(
    lead.id,
    'score_updated',
    `BEAM Score updated from ${previousScores.beam_score || 0} to ${beamScore}`
  );

  return {
    bant_score: bantScore,
    account_score: accountScore,
    engagement_score: engagementScore,
    market_score: marketScore,
    beam_score: beamScore
  };
};
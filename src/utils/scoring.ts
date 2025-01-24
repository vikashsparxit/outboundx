import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "./activity-logger";
import { Lead } from "@/types/lead";

// BANT Score Components (max 25 points)
const calculateBantScore = (lead: Lead) => {
  let score = 0;
  
  // Budget (7 points)
  if (lead.budget_range) {
    switch (lead.budget_range) {
      case 'Enterprise ($100k+)':
        score += 7;
        break;
      case 'Mid-Market ($50k-$100k)':
        score += 5;
        break;
      case 'Small Business ($10k-$50k)':
        score += 3;
        break;
      case 'Startup (Under $10k)':
        score += 1;
        break;
    }
  }

  // Authority (6 points)
  if (lead.decision_maker_level) {
    switch (lead.decision_maker_level) {
      case 'C-Level Executive':
        score += 6;
        break;
      case 'VP / Director':
        score += 4;
        break;
      case 'Senior Manager':
        score += 3;
        break;
      case 'Manager':
        score += 2;
        break;
      case 'Individual Contributor':
        score += 1;
        break;
    }
  }

  // Need Urgency (6 points)
  if (lead.need_urgency) {
    switch (lead.need_urgency) {
      case 'Immediate Need':
        score += 6;
        break;
      case 'Next Quarter':
        score += 4;
        break;
      case 'Within 6 Months':
        score += 2;
        break;
      case 'Future Consideration':
        score += 1;
        break;
    }
  }

  // Timeline (6 points)
  if (lead.project_timeline) {
    switch (lead.project_timeline) {
      case 'Immediate Start':
        score += 6;
        break;
      case '1-3 Months':
        score += 4;
        break;
      case '3-6 Months':
        score += 2;
        break;
      case '6+ Months':
        score += 1;
        break;
    }
  }

  return score;
};

// Engagement Score Components (max 25 points)
const calculateEngagementScore = (lead: Lead) => {
  let score = 0;

  // Call Count (10 points)
  if (lead.call_count) {
    if (lead.call_count >= 6) {
      score += 10;
    } else if (lead.call_count >= 3) {
      score += 6;
    } else if (lead.call_count >= 1) {
      score += 3;
    }
  }

  // Email Quality (8 points)
  if (lead.email_type) {
    switch (lead.email_type) {
      case 'business':
        score += 8;
        break;
      case 'personal':
        score += 4;
        break;
      case 'other':
        score += 2;
        break;
    }
  }

  // Message Quality (7 points)
  if (lead.message) {
    const messageLength = lead.message.length;
    if (messageLength > 200) {
      score += 7; // Detailed message
    } else if (messageLength > 50) {
      score += 4; // Basic message
    }
  }

  return score;
};

// Account Score Components (max 25 points)
const calculateAccountScore = (lead: Lead) => {
  let score = 0;

  // Company Size (10 points)
  if (lead.company_size) {
    switch (lead.company_size) {
      case 'Enterprise (1000+ employees)':
        score += 10;
        break;
      case 'Mid-Market (100-999 employees)':
        score += 7;
        break;
      case 'Small Business (10-99 employees)':
        score += 4;
        break;
      case 'Startup (1-9 employees)':
        score += 2;
        break;
    }
  }

  // Industry Vertical (8 points)
  if (lead.industry_vertical) {
    const highPriorityIndustries = ['Technology', 'Healthcare', 'Finance'];
    const mediumPriorityIndustries = ['Manufacturing', 'Professional Services'];
    
    if (highPriorityIndustries.includes(lead.industry_vertical)) {
      score += 8;
    } else if (mediumPriorityIndustries.includes(lead.industry_vertical)) {
      score += 5;
    } else {
      score += 3;
    }
  }

  // Annual Revenue (7 points)
  if (lead.annual_revenue_range) {
    switch (lead.annual_revenue_range) {
      case '$100M+':
        score += 7;
        break;
      case '$50M-$100M':
        score += 5;
        break;
      case '$10M-$50M':
        score += 3;
        break;
      case '$1M-$10M':
        score += 2;
        break;
      case 'Under $1M':
        score += 1;
        break;
    }
  }

  return score;
};

// Market Score Components (max 25 points)
const calculateMarketScore = (lead: Lead) => {
  let score = 0;

  // Geographic Location (10 points)
  if (lead.country) {
    const tier1Countries = ['United States', 'United Kingdom', 'Canada'];
    const tier2Countries = ['Germany', 'France', 'Australia', 'Japan', 'Singapore'];
    const tier3Countries = [
      'Spain', 'Italy', 'Netherlands', 'Sweden', 'Switzerland',
      'Norway', 'Denmark', 'Finland', 'Ireland', 'Belgium'
    ];
    
    const country = lead.country.toLowerCase();
    if (tier1Countries.some(c => c.toLowerCase() === country)) {
      score += 10;
    } else if (tier2Countries.some(c => c.toLowerCase() === country)) {
      score += 8;
    } else if (tier3Countries.some(c => c.toLowerCase() === country)) {
      score += 5;
    } else {
      score += 3;
    }
  }

  // Contact Completeness (8 points)
  if (lead.phone_numbers && lead.phone_numbers.length > 0) {
    score += 4;
  }
  if (lead.city && lead.state && lead.country) {
    score += 4;
  }

  // Technology Stack (7 points)
  if (lead.technology_stack && Array.isArray(lead.technology_stack)) {
    const techCount = lead.technology_stack.length;
    if (techCount >= 5) {
      score += 7;
    } else if (techCount >= 3) {
      score += 5;
    } else if (techCount >= 1) {
      score += 3;
    }
  }

  return score;
};

export const calculateBeamScore = async (lead: Lead) => {
  console.log('Calculating BEAM score for lead:', lead);
  
  const bantScore = calculateBantScore(lead);
  const accountScore = calculateAccountScore(lead);
  const engagementScore = calculateEngagementScore(lead);
  const marketScore = calculateMarketScore(lead);
  
  console.log('Individual scores:', {
    bantScore,
    accountScore,
    engagementScore,
    marketScore
  });

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

  console.log('Previous scores:', previousScores);
  console.log('New BEAM score:', beamScore);

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
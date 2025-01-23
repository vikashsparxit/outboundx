export const BUDGET_RANGES = [
  "Enterprise ($100k+)",
  "Mid-Market ($50k-$100k)",
  "Small Business ($10k-$50k)",
  "Startup (Under $10k)"
] as const;

export const COMPANY_SIZES = [
  "Enterprise (1000+ employees)",
  "Mid-Market (100-999 employees)",
  "Small Business (10-99 employees)",
  "Startup (1-9 employees)"
] as const;

export const INDUSTRY_VERTICALS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Professional Services",
  "Media & Entertainment",
  "Real Estate",
  "Other"
] as const;

export const DECISION_MAKER_LEVELS = [
  "C-Level Executive",
  "VP / Director",
  "Senior Manager",
  "Manager",
  "Individual Contributor"
] as const;

export const NEED_URGENCY = [
  "Immediate Need",
  "Next Quarter",
  "Within 6 Months",
  "Future Consideration"
] as const;

export const PROJECT_TIMELINES = [
  "Immediate Start",
  "1-3 Months",
  "3-6 Months",
  "6+ Months"
] as const;

export const CLIENT_TYPES = [
  "Enterprise",
  "Mid-Market",
  "Small Business",
  "Startup",
  "Government",
  "Non-Profit"
] as const;

export const ANNUAL_REVENUE_RANGES = [
  "$100M+",
  "$50M-$100M",
  "$10M-$50M",
  "$1M-$10M",
  "Under $1M"
] as const;

export const TECHNOLOGY_STACK_OPTIONS = [
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  ".NET",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes"
] as const;

// Using ISO 3166-1 for standardized country list
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "Brazil",
  "Singapore",
  // Add more countries as needed...
] as const;
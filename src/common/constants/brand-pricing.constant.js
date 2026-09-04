export const BRAND_PRICING_BLUE = "#4552DF";
export const BRAND_PRICING_BLUE_DARK = "#3441B8";

export const BRAND_PRICING_BILLING = {
  monthly: [
    { price: "$399", billed: "" },
    { price: "$699", billed: "" },
    { price: "$999", billed: "" },
  ],
  quarterly: [
    { price: "$359", billed: "billed $1,077/quarter" },
    { price: "$629", billed: "billed $1,887/quarter" },
    { price: "$899", billed: "billed $2,697/quarter" },
  ],
  yearly: [
    { price: "$319", billed: "billed $3,830/year" },
    { price: "$559", billed: "billed $6,710/year" },
    { price: "$799", billed: "billed $9,590/year" },
  ],
};

export const BRAND_PRICING_BILLING_OPTIONS = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly", badge: "Save 10%" },
  { id: "yearly", label: "Yearly", badge: "Save 20%" },
];

export const BRAND_PRICING_ENTRY_CARDS = [
  {
    id: "payg",
    name: "Pay-As-You-Go",
    price: "$0",
    unit: "/mo",
    highlighted: false,
    features: [
      "Discover, hire, and manage creators",
      "9.9% commission on affiliate, sponsored, and UGC creator payments",
      "3 gifted collaborations per month, commission-free",
      "No monthly fee, no commitment",
    ],
  },
  {
    id: "gifting",
    name: "Unlimited Gifting Add-On",
    price: "$99",
    unit: "/mo",
    highlighted: true,
    features: [
      "Unlimited gifted collaborations, commission-free",
      "Unlimited Shopify sales tracking",
      "Access to creator social channels (Instagram, TikTok, YouTube)",
      "Affiliate, sponsored, and UGC campaigns billed at standard 9.9% PAYG rate",
    ],
  },
];

export const BRAND_PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    highlighted: false,
    priceIndex: 0,
    features: [
      { text: "$0 commission on creator payments up to $5,000/mo", bold: true },
      { text: "Unlimited Shopify sales tracking" },
      { text: "Save up to 20% vs PAYG" },
      { text: "Unlimited gifted, commission-free" },
    ],
    spacers: 2,
  },
  {
    id: "growth",
    name: "Growth",
    highlighted: true,
    priceIndex: 1,
    features: [
      { text: "$0 commission on creator payments up to $12,500/mo", bold: true },
      { text: "Unlimited Shopify sales tracking" },
      { text: "Save up to 43% vs PAYG" },
      { text: "Unlimited gifted, commission-free" },
      { text: "Priority support" },
    ],
    spacers: 1,
  },
  {
    id: "pro",
    name: "Pro",
    highlighted: false,
    priceIndex: 2,
    features: [
      { text: "$0 commission on creator payments up to $30,000/mo", bold: true },
      { text: "Unlimited Shopify sales tracking" },
      { text: "Save up to 66% vs PAYG" },
      { text: "Unlimited gifted, commission-free" },
      { text: "Priority support" },
      { text: "Dedicated account manager" },
    ],
    spacers: 0,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    highlighted: false,
    custom: true,
    features: [
      { text: "Tailored limits on creator payments above $30,000/mo", bold: true },
      { text: "Unlimited Shopify sales tracking" },
      { text: "Fully managed campaigns available" },
      { text: "Unlimited gifted, commission-free" },
      { text: "Priority support" },
      { text: "Dedicated account manager" },
      { text: "Custom contract terms" },
      { text: "Priority onboarding + SLA" },
      { text: "Custom feature requests" },
    ],
    spacers: 0,
  },
];

export const BRAND_PRICING_COMPARE_ROWS = [
  { label: "Creator profiles unlocked", competitor: "350/mo", cleercut: "Unlimited" },
  { label: "Creator invites", competitor: "30/mo", cleercut: "Unlimited" },
  { label: "Creator hires", competitor: "5/mo", cleercut: "Unlimited" },
  { label: "Active campaigns", competitor: "1 at a time", cleercut: "Unlimited" },
  { label: "CRM pipeline boards", competitor: "4", cleercut: "Unlimited" },
  { label: "Creators tracked", competitor: "200", cleercut: "Unlimited" },
  { label: "Creator payouts", competitor: "20/mo", cleercut: "Unlimited" },
  { label: "Minimum commitment", competitor: "3 months", cleercut: "None" },
];

export const BRAND_PRICING_AGENCY_POINTS = [
  {
    title: "Full campaign strategy",
    copy: "We build your brief, budget, and timeline based on what's actually worked for brands in your category.",
  },
  {
    title: "Creator sourcing & vetting",
    copy: "Our team hand-picks and negotiates with creators who fit your brand, not just your budget.",
  },
  {
    title: "Content approval, handled",
    copy: "Every piece of content reviewed and approved before it goes live, so nothing surprises you.",
  },
  {
    title: "Custom sales and results reports",
    copy: "Reach, engagement, conversions, and ROI, broken down by creator and campaign, delivered by your account manager.",
  },
];

export const BRAND_PRICING_FAQS = [
  {
    question: "What's the difference between Pay-As-You-Go and the paid plans?",
    answer:
      "PAYG has no monthly fee and charges 9.9% commission on affiliate, sponsored, and UGC creator payments. Paid plans charge a flat monthly fee and remove that commission entirely, up to a set spend cap each month.",
  },
  {
    question: "Does upgrading to a higher plan give me more creator hires or invites?",
    answer:
      "No. Every plan, including free PAYG, includes unlimited creator hires, invites, and campaigns. Upgrading only changes your commission-free spend cap and support level, never your usage limits.",
  },
  {
    question: "What happens if I spend more than my plan's commission-free limit?",
    answer:
      "Spend above your plan's monthly cap is billed at the standard 9.9% rate. Your cap resets every month, regardless of whether you're billed monthly, quarterly, or yearly.",
  },
  {
    question: "Do I need the Unlimited Gifting Add-On if I'm already on Starter, Growth, or Pro?",
    answer:
      "No. Unlimited gifted collaborations, commission-free, are included on every paid plan already. Unlimited Gifting is a standalone option for brands who only run gifted campaigns and don't need a full tier.",
  },
  {
    question: "How does the 30-day free trial work?",
    answer:
      "New accounts get 30 days of unlimited, commission-free access across gifted, affiliate, and paid campaigns, no credit card required. Creators hired during the trial keep their commission-free terms for that collaboration, even if it completes after day 30.",
  },
  {
    question: "Is there a minimum commitment on any plan?",
    answer:
      "No. Every plan, including Quarterly and Yearly billing, can be cancelled anytime. Longer billing cycles are optional and only offered for a discount, they're never required.",
  },
  {
    question: "What's included in Enterprise pricing?",
    answer:
      "Enterprise is built for brands spending more than $30,000/month. It includes tailored commission-free limits, a dedicated account manager, custom contract terms, priority onboarding and SLA, and custom feature requests. Contact sales to discuss your plan.",
  },
];

export const BRAND_PRICING_CONTACT_MAIL =
  "mailto:partnerships@cleercut.com?subject=CleerCut%20Pricing%20Inquiry";

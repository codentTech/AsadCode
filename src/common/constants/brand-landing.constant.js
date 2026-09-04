export const BRAND_LANDING_TRUST_LOGOS = [
  "Northpark",
  "Midnighties",
  "Puff Herbals",
  "Suite Spa LA",
  "The Librarian",
  "Krumbled",
  "Masa",
];

export const BRAND_LANDING_WALKTHROUGH_TABS = [
  {
    id: "campaign-marketplace",
    label: "Campaign Marketplace",
    image: "/assets/images/landing/brands/campaign-marketplace.jpg",
    columns: [
      {
        title: "Launch in Minutes",
        copy: "Set deliverables, budget, and eligibility in one flow",
      },
      {
        title: "Creators Apply to You",
        copy: "Post your campaign and vetted creators come to you",
      },
      {
        title: "Usage Rights Built In",
        copy: "Exclusivity, revisions, and licensing defined upfront",
      },
      {
        title: "Invite Directly",
        copy: "Push invites to creators you have already shortlisted",
      },
    ],
  },
  {
    id: "creator-discovery",
    label: "Creator Discovery",
    image: "/assets/images/landing/brands/creator-discovery.jpg",
    columns: [
      {
        title: "Verified Audience Data",
        copy: "Creator data refreshed every 24 hours",
      },
      {
        title: "Thousands of Exclusive Creators",
        copy: "Every creator manually reviewed before approval",
      },
      {
        title: "Compare Side by Side",
        copy: "Applicants ranked by views, reach, engagement, and more",
      },
      {
        title: "Filter by Fit",
        copy: "Niche, location, platform, and audience demographics",
      },
    ],
  },
  {
    id: "manage-track",
    label: "Manage & Track",
    image: "/assets/images/landing/brands/manage-track.jpg",
    columns: [
      {
        title: "Automated Pipeline",
        copy: "Applicants are moved through stages automatically",
      },
      {
        title: "Deliverable Tracking",
        copy: "See what is submitted, approved, and outstanding",
      },
      {
        title: "Smart Inbox",
        copy: "Every creator conversation in one place",
      },
      {
        title: "Shopify Integration",
        copy: "Discount codes, gifting fulfilment, and commission tracking",
      },
    ],
  },
  {
    id: "pay-report",
    label: "Pay & Report",
    image: "/assets/images/landing/brands/pay-report.jpg",
    columns: [
      {
        title: "Auto-generated Contracts",
        copy: "Generate contracts in seconds to prevent legal back and forth",
      },
      {
        title: "Stripe Escrow",
        copy: "Payment is only released when content has been approved",
      },
      {
        title: "Advanced Reporting",
        copy: "Track ROI, AOV, Cost per Creator, and more",
      },
      {
        title: "Campaign Reports",
        copy: "Engagement, reach, and performance per creator",
      },
    ],
  },
];

export const BRAND_LANDING_DEFAULT_TAB = 1;

export const BRAND_LANDING_WHY_POINTS = [
  {
    title: "Verified data, refreshed daily",
    copy: "Your budget should never depend on old, scraped numbers. Creators connect their accounts directly, so every figure you see is authenticated.",
  },
  {
    title: "Your budget stays protected",
    copy: "Escrow-secured Stripe payments, auto-generated contracts, and a verified creator network mean you never risk spend on an unreliable creator.",
  },
  {
    title: "A CRM built for scale",
    copy: "Every creator, contract, and deliverable at a glance, with our CRM moving each of them through your pipeline automatically as milestones complete.",
  },
  {
    title: "Reporting included as standard",
    copy: "Most platforms charge a premium for advanced reporting. Ours is built in, with Shopify tying campaigns to real sales and ROI, not just engagement.",
  },
];

export const BRAND_LANDING_DEMO_BULLETS = [
  "Unlimited creator searches and profile views",
  "No contact unlocks or messaging credits",
  "Run as many campaigns as you want, on any plan",
];

export const BRAND_LANDING_FEATURE_CARDS = [
  {
    title: "Post once, and creators come to you",
    copy: "Set your deliverables, budget, and requirements in minutes, then let applications arrive. No lists, no cold emails, no chasing replies.",
    image: "/assets/images/landing/brands/post-once.jpg",
  },
  {
    title: "$0 payment processing fees",
    copy: "Competitors advertise low processing rates. We charge you nothing at all. Stripe's fee comes out of the creator's payout, not your bill.",
    image: "/assets/images/landing/brands/zero-fees.png",
    showFeeTable: true,
  },
  {
    title: "Send products straight from Shopify",
    copy: "Pick products from your store inside CleerCut and we handle the order. No exporting lists or raising fulfilments by hand.",
    image: "/assets/images/landing/brands/shopify-store.png",
  },
  {
    title: "Discount codes and sales attribution",
    copy: "Assign a unique code to every creator, then see exactly which ones drove orders and revenue.",
    image: "/assets/images/landing/brands/shopify-attribution.png",
  },
  {
    title: "Applicant Summary",
    copy: "Every applicant ranked side by side on reach, typical views, and view efficiency, so shortlisting takes minutes.",
    image: "/assets/images/landing/brands/applicant-summary.png",
  },
  {
    title: "Advanced campaign management",
    copy: "Bulk messaging, a shared calendar, task manager, message templates, and a CRM dashboard tracking every creator's progress, deadlines, and deliverables.",
    image: "/assets/images/landing/brands/campaign-management.png",
  },
];

export const BRAND_LANDING_FEE_ROWS = [
  { label: "Creator payments", typical: "$5,000", cleercut: "$5,000" },
  { label: "Commission", typical: "+$500.00", cleercut: "$0" },
  { label: "Processing", typical: "+$145.30", cleercut: "$0" },
  { label: "Plan fee", typical: "—", cleercut: "+$99.00" },
  { label: "You pay", typical: "$5,145.30", cleercut: "$5,099.00", emphasize: true },
];

export const BRAND_LANDING_FAQS = [
  {
    question: "Is it free to get started?",
    answer:
      "Yes. Signing up costs nothing and no credit card is required. You can browse creators, build shortlists, and post a campaign before you spend anything.",
  },
  {
    question: "Do you charge commission?",
    answer:
      "On pay-as-you-go it's 9.9% on paid collaborations and nothing on gifted ones. Monthly plans remove commission entirely up to your plan's spend cap. Either way, your first 30 days are commission-free.",
  },
  {
    question: "What happens after the 30 days?",
    answer:
      "Nothing changes unless you want it to. You stay on pay-as-you-go with no subscription and no contract. Moving to a monthly plan is worth it only once your campaign spend makes the maths work, and we'd rather you switch then than now.",
  },
  {
    question: "How do you verify creators?",
    answer:
      "Creators connect their own accounts when they sign up, so follower counts, engagement, and audience demographics come directly from Instagram, TikTok, and YouTube rather than from a scraped database. That data refreshes every 24 hours, and every creator is manually reviewed before approval.",
  },
  {
    question: "What protects my budget if a creator doesn't deliver?",
    answer:
      "Funds go into Stripe escrow the moment the contract is signed and are only released once you've approved the work. If a creator doesn't deliver, the money hasn't left your control.",
  },
  {
    question: "How is this different from finding creators myself?",
    answer:
      "Post a campaign and creators apply to you, so there's no list building or cold outreach. From there the contract, the payment, the deliverable tracking, and the reporting all happen in the same place instead of across a spreadsheet, a DM inbox, and a payment app.",
  },
];

export const BRAND_LANDING_DEMO_MAIL =
  "mailto:partnerships@cleercut.com?subject=Book%20a%20Demo";

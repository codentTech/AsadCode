import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";

export const SEO_FAQ_ITEMS = [
  {
    question: "What is Cleercut?",
    answer:
      "Cleercut is an all-in-one influencer marketing platform that helps brands discover verified creators, generate contracts, manage campaigns, and protect payments with escrow — all in one workspace.",
  },
  {
    question: "How does Cleercut compare to GRIN?",
    answer:
      "Cleercut offers similar features to GRIN — influencer discovery, contract management, payments, and campaign tracking — at a significantly lower price point, with a free tier requiring no credit card.",
  },
  {
    question: "What does Cleercut cost?",
    answer:
      "Cleercut offers a free tier with 3 campaigns and no credit card required. Paid brand plans start at $399/month (Starter), $525/month (Growth), and $699/month (Enterprise). Pay-As-You-Go is available at 9.9% commission per creator payment.",
  },
  {
    question: "Does Cleercut have a free plan?",
    answer:
      "Yes. Brands can try 3 campaigns free with no credit card required. Creators can apply to campaigns with transparent payment processing fees and no subscription required.",
  },
  {
    question: "What is escrow payment in influencer marketing?",
    answer:
      "Escrow payment holds campaign funds securely until deliverables are approved. Cleercut uses escrow to protect brand budgets and ensure creators are paid fairly once work is completed.",
  },
  {
    question: "How does Cleercut protect brands from creator fraud?",
    answer:
      "Cleercut verifies creators and brands, uses escrow payments, auto-generated contracts, and dual-sided reviews to reduce fraud risk and keep collaborations accountable.",
  },
  {
    question: "What platforms does Cleercut support (Instagram, TikTok, YouTube)?",
    answer:
      "Cleercut supports influencer campaigns across major platforms including Instagram, TikTok, and YouTube, with tools for discovery, contracts, messaging, and campaign tracking in one workspace.",
  },
  {
    question: "Who can sign up for CleerCut?",
    answer:
      "Any brand, agency, or content creator over the age of 18 can join CleerCut. Whether you're running your first campaign or managing multiple influencer partnerships, CleerCut is built to scale with you.",
  },
];

export const SOFTWARE_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  description:
    "All-in-one influencer marketing platform. Discover verified creators, generate contracts in seconds, protect your budget with escrow payments, and manage campaigns from outreach to deliverables.",
  url: SITE_URL,
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available. Paid plans from $399/month.",
  },
};

export function buildFaqPageSchema(items = SEO_FAQ_ITEMS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildWebPageSchema({ name, description, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
  };
}

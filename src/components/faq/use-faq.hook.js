import {
  BarChart,
  CreditCard,
  FileText,
  HelpCircle,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";

// Category icons mapping
const categoryIcons = {
  General: <HelpCircle className="w-6 h-6" />,
  "Profiles & Media Kits": <Users className="w-6 h-6" />,
  "Collaboration & Campaign Management": <MessageSquare className="w-6 h-6" />,
  "Payments & Escrow": <CreditCard className="w-6 h-6" />,
  "Legal & Contracts": <FileText className="w-6 h-6" />,
  "Analytics & Reporting": <BarChart className="w-6 h-6" />,
  "Safety & Verification": <Shield className="w-6 h-6" />,
  "Platform Tools & Features": <MessageSquare className="w-6 h-6" />,
  "Billing & Account Help": <CreditCard className="w-6 h-6" />,
};

// FAQ data
const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is CleerCut and how does it work?",
        answer:
          "CleerCut is an all-in-one platform that connects brands and creators for streamlined, trustworthy collaborations. Brands can post campaigns, discover verified creators, auto-generate contracts, manage all communication, track progress and handle payments — all in one workspace. Creators can easily create clean, professional media kits, quick-apply to campaigns, track earnings and get paid with peace of mind securely via our platform - no more waiting around for brands to reach out to you.",
      },
      {
        question: "Who can sign up for CleerCut?",
        answer:
          "Any brand, agency, or content creator over the age of 18 can join CleerCut. Whether you're running your first campaign or managing multiple influencer partnerships, CleerCut is built to scale with you.",
      },
      {
        question: "Do I need to verify who I am to use CleerCut?",
        answer:
          "Yes, all creators are required to prove account ownership. All brands must register via their official domain address or use one of our secondary review channels.",
      },
      {
        question: "What types of collaborations can I find on CleerCut?",
        answer:
          "You'll find campaigns for sponsored posts, UGC, gifted collaborations, affiliate deals, and more — across platforms like TikTok, Instagram, and YouTube.",
      },
      {
        question: "Is CleerCut free to use?",
        answer:
          "CleerCut is free to get started. Brands can try 3 campaigns with no service fees (8.5% service fee deducted per campaign thereafter). Creators can apply to as many campaigns as they like. Creators can try 3 campaigns with no service fees (4.5% service fee deducted per campaign thereafter).",
      },
    ],
  },
  {
    category: "Profiles & Media Kits",
    questions: [
      {
        question: "How do I set up my CleerCut profile?",
        answer:
          "After signing up, you'll be guided through a quick setup to add your bio, platform links, audience demographics, past work, and rates.",
      },
      {
        question: "What should I include in my creator media kit?",
        answer:
          "Include your niche, follower count, engagement rates, platform links, previous brand collaborations, testimonials, and sample content.",
      },
      {
        question: "Can brands view analytics on my profile?",
        answer:
          "Yes. Brands can view your audience data (age, gender, location), platform insights, and campaign history if you choose to share it.",
      },
      {
        question: "How can I make my profile stand out to brands or creators?",
        answer:
          "Use a clear profile photo, write a compelling bio, upload polished past work, and ask past collaborators for reviews.",
      },
      {
        question: "How does profile verification work?",
        answer:
          "Verification involves confirming identity and account ownership. You'll submit basic documentation, and our team approves it within 1–3 business days.",
      },
    ],
  },
  {
    category: "Collaboration & Campaign Management",
    questions: [
      {
        question: "How do I create or apply to a campaign?",
        answer:
          "Brands can post campaigns in minutes by selecting their niche, requirements, and deliverables. Creators can browse active campaigns via the Discover+ section and apply with a pitch.",
      },
      {
        question:
          "What happens after a brand or creator accepts a collaboration?",
        answer:
          "Once accepted, both parties sign an auto-generated contract, can message directly via the active campaigns section, and begin tracking progress inside the campaign dashboard.",
      },
      {
        question: "Can I negotiate terms within the platform?",
        answer:
          "Yes. You can discuss pricing, deadlines, and deliverables through messages before a contract is finalized.",
      },
      {
        question: "How are campaign deadlines and deliverables tracked?",
        answer:
          "Each campaign includes a timeline and task checklist. Both sides can mark tasks complete, request revisions, or flag missed items.",
      },
      {
        question: "What happens if someone ghosts or misses a deadline?",
        answer:
          "Our support team will step in. Escrow ensures no one is paid unless deliverables are met, and reviews help flag unreliable users. If a creator believes that they may miss a deadline, the brand may, at their discretion, amend the deadline. Consistently missing deadlines and/or ghosting may result in negative reviews and subsequently affecting future prospects.",
      },
    ],
  },
  {
    category: "Payments & Escrow",
    questions: [
      {
        question: "How does CleerCut's payment system work?",
        answer:
          "Brands fund campaigns upfront via secure escrow when they are agreeing to the contract terms. Funds are released to creators after the work is submitted and approved.",
      },
      {
        question: "What is escrow and how does it protect me?",
        answer:
          "Escrow holds payment until both sides fulfill their agreement. It protects brands from paying for incomplete work and guarantees creators get paid if they complete their work.",
      },
      {
        question: "When do I get paid as a creator?",
        answer:
          "Payments are released once the brand confirms deliverables are complete — or automatically after a set window if there's no dispute.",
      },
      {
        question: "What happens if a dispute arises over payment?",
        answer:
          "If a disagreement occurs, CleerCut support will review the contract and messages to resolve fairly. If needed, funds can be refunded or split.",
      },
      {
        question: "Are there any fees for using CleerCut's payment system?",
        answer:
          "Creators keep 95.5% of their rate after the creator service fee is deducted. Brands pay a 8.5% service fee per campaign after the initial free-trial period.",
      },
    ],
  },
  {
    category: "Legal & Contracts",
    questions: [
      {
        question: "Do I need a contract for every collaboration?",
        answer:
          "Yes, and CleerCut makes it quick and simple. Each campaign automatically generates a contract based on your agreed terms.",
      },
      {
        question: "Does CleerCut help with contract creation?",
        answer:
          "Yes. CleerCut auto-generates contracts using your campaign details — you can also edit or add your own clauses.",
      },
      {
        question: "Can I upload my own contracts or use platform templates?",
        answer:
          "Both. You can upload custom contracts or use CleerCut's templates, which are customizable per campaign.",
      },
      {
        question: "Is my data and content protected legally?",
        answer:
          "Yes. CleerCut complies with international privacy standards and offers tools to define ownership, rights, and usage within contracts.",
      },
      {
        question:
          "What regulations does CleerCut comply with (e.g., FTC, GDPR)?",
        answer:
          "We adhere to FTC endorsement guidelines, GDPR for user privacy, and other applicable regulations depending on your region.",
      },
    ],
  },
  {
    category: "Analytics & Reporting",
    questions: [
      {
        question: "What type of analytics does CleerCut provide?",
        answer:
          "We provide performance data on applicants, campaigns, finances and creator engagement — all visible in your dashboard.",
      },
      {
        question: "How do I access reports on campaign performance?",
        answer:
          "Campaign insights and downloadable summaries are available from each campaign page and inbox tab.",
      },
      {
        question: "Can I export data from CleerCut?",
        answer:
          "Yes. Brands can export performance reports and creator metrics to CSV or PDF format.",
      },
    ],
  },
  {
    category: "Safety & Verification",
    questions: [
      {
        question: "How does CleerCut prevent scams and ghosting?",
        answer:
          "Verification, dual reviews, escrow payments, and a transparent history of past campaigns help eliminate fraud and flakiness.",
      },
      {
        question: "What is the verification process for creators and brands?",
        answer:
          "It includes account verification, social link checks, and past work history review. It can take 1–3 business days.",
      },
      {
        question: "How do I report a suspicious user or bad collaboration?",
        answer:
          'Click "Report" on the user\'s profile or inside the campaign. Our team investigates every report within 24–48 hours.',
      },
    ],
  },
  {
    category: "Platform Tools & Features",
    questions: [
      {
        question: "What is the Smart Inbox and how does it work?",
        answer:
          "Our Smart Inbox organizes all conversations by campaign and stage — so you never lose track of deliverables, applicants, or messages.",
      },
      {
        question: "Can I save posts or campaigns I'm interested in?",
        answer:
          "Yes. Creators and brands can save favorite profiles or campaigns to revisit later.",
      },
      {
        question: "What is Explore and how is it curated?",
        answer:
          "Explore shows trending or highly rated creators and campaigns, tailored by your preferences and performance filters.",
      },
      {
        question:
          "Can I integrate CleerCut with other tools (e.g. Calendars, CRMs)?",
        answer:
          "Integrations are coming soon. At launch, you can export timelines and sync dates manually with your calendar.",
      },
    ],
  },
  {
    category: "Billing & Account Help",
    questions: [
      {
        question: "What happens if my payment fails?",
        answer:
          "If a payment doesn't go through, we'll notify you immediately. Your account remains active during a short grace period, after which premium features may be paused until resolved.",
      },
      {
        question: "Can I change the credit card linked to my account?",
        answer:
          "Yes. You can update your payment method at any time in your Billing settings.",
      },
      {
        question: "What should I do if I'm having trouble logging in?",
        answer:
          'Use the "Forgot Password" link or contact support at help@cleercut.co for quick assistance.',
      },
      {
        question: "Can I have multiple users on one brand account?",
        answer:
          "Currently, multiple people can sign in using a singular login and use it simultaneously. We hope to introduce multiple ID logins as a premium business feature in the future.",
      },
      {
        question: "Can I delete my account permanently?",
        answer:
          "Yes. Contact support to request permanent deletion. Please note: deleted accounts and data cannot be recovered.",
      },
    ],
  },
];

function useFaqHook() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [openQuestions, setOpenQuestions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const results = [];
    faqData.forEach((category) => {
      category.questions.forEach((qa) => {
        if (
          qa.question.toLowerCase().includes(query.toLowerCase()) ||
          qa.answer.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            ...qa,
            category: category.category,
          });
        }
      });
    });

    setSearchResults(results);
  };

  return {
    activeCategory,
    setActiveCategory,
    openQuestions,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    setIsSearching,
    toggleQuestion,
    handleSearch,
    faqData,
    categoryIcons,
  };
}

export default useFaqHook;

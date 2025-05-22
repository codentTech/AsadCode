import {
  BarChart3,
  Clipboard,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";

function useSolution() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  // Feature sections based on user type
  const brandFeatures = [
    {
      title: "1. Stop Getting Ghosted by Creators",
      description:
        "Work only with creators who have a track record. All applicants are verified, reviewed, and escrow-backed — so if they don't deliver, you're protected.",
      points: [
        "Dual-sided reviews from other brands",
        "Escrow-secured payments only released after work is delivered",
        "Clear deliverable tracking inside each campaign",
      ],
      icon: <Shield className="text-indigo-600" size={24} />,
    },
    {
      title: "2. Avoid the $5K Contracts and 30% Cuts",
      description:
        "Most platforms charge $2,000–$5,000+/month. Agencies take 15–30% of your campaign budget. CleerCut gives you flexible pricing that scales with your needs:",
      points: [
        "9.9% / 7.9% / 5.9% commission tiers",
        "Or flat monthly plans: $525/month (up to $10K spend) or $699/month (up to $20K spend)",
        "No long-term contracts. No inflated retainers. Just control.",
      ],
      icon: <DollarSign className="text-indigo-600" size={24} />,
    },
    {
      title: "3. Keep Every Conversation Organized — Without the Chaos",
      description:
        "CleerCut's Smart Inbox is built for campaign communication — not email clutter. Every message is clearly categorized and separated by type, so nothing gets lost:",
      points: [
        "Applications — Creators applying to your campaign",
        "Active collaborations — Ongoing projects in progress",
        "Completed deals — Closed campaigns for reference or follow-up",
        "Cold pitches — Unsolicited messages or new outreach",
      ],
      icon: <MessageSquare className="text-indigo-600" size={24} />,
    },
    {
      title: "4. Post Once. Get Qualified Applicants.",
      description:
        "No more cold DMs or chasing responses. Post your campaign and receive applications from creators who already match your filters. Everything's pre-vetted and ready to review.",
      points: [],
      icon: <Clipboard className="text-indigo-600" size={24} />,
    },
    {
      title: "5. Find the Right Creators in Minutes",
      description: "Stop guessing who's a fit. CleerCut profiles show everything up front:",
      points: [
        "Verified audience and platform data",
        "Niche and engagement breakdowns",
        "Performance reviews from other brands",
      ],
      icon: <Users className="text-indigo-600" size={24} />,
    },
    {
      title: "6. Track Campaign Progress in Real Time",
      description: "From kickoff to final post, you have full visibility.",
      points: [
        "Deliverables and creator status",
        "Payment stages and review status",
        "Team assignments and internal notes",
      ],
      icon: <Clock className="text-indigo-600" size={24} />,
    },
    {
      title: "7. Simplify Legal with Auto-Generated Contracts",
      description:
        "No more manual contract writing. CleerCut generates custom agreements based on your selected:",
      points: ["Deliverables", "Deadlines", "Payment terms"],
      icon: <FileText className="text-indigo-600" size={24} />,
    },
    {
      title: "8. See Your Budget in One Place",
      description: "Your finance dashboard shows every dollar at work.",
      points: [
        "Real-time spend by campaign or niche",
        "Escrow balances and pending payments",
        "Full transaction history",
      ],
      icon: <BarChart3 className="text-indigo-600" size={24} />,
    },
    {
      title: "9. Built for Teams",
      description:
        "Assign teammates to campaigns, leave notes, and toggle between projects without overlap.",
      points: [
        "Private internal notes",
        "Shared visibility across roles",
        "Clean handoffs and collaboration",
      ],
      icon: <Users className="text-indigo-600" size={24} />,
    },
  ];

  const creatorFeatures = [
    {
      title: "1. No More Guessing Who's Hiring",
      description:
        'Find live campaigns posted by real, verified brands actively looking for creators — not outdated Google Sheets or vague "collab?" DMs. Use advanced filters to match with brands that align with your audience and platform.',
      points: [],
      icon: <Shield className="text-indigo-600" size={24} />,
    },
    {
      title: "2. Know Which Brands Are Worth It",
      description:
        "Read ratings and reviews from other creators before committing to a collaboration. Avoid ghosting and late payments with transparent brand profiles. All payments are escrow-secured — you only begin once the brand's budget is funded.",
      points: [],
      icon: <Star className="text-indigo-600" size={24} />,
    },
    {
      title: "3. Say Goodbye to 30% Manager Cuts",
      description:
        "Most managers and agencies take 15–30% of your earnings just to handle communication. CleerCut only charges the standard 3.2% payment processing fee, and gives you full control of:",
      points: ["Your rates", "Your deliverables", "Your income tracking"],
      icon: <DollarSign className="text-indigo-600" size={24} />,
    },
    {
      title: "4. Keep Every Conversation in One Place",
      description:
        "Stay organized with CleerCut's Smart Inbox, built for creators managing multiple opportunities. Track:",
      points: ["Cold outreach", "Campaign applications", "Active brand communication"],
      icon: <MessageSquare className="text-indigo-600" size={24} />,
    },
    {
      title: "5. Scale Outreach Without the Spreadsheets",
      description:
        "Apply to multiple campaigns in one click using your CleerCut profile and saved pitches. No email hunting, no daily application limits — just streamlined outreach, ready when you are.",
      points: [],
      icon: <Clipboard className="text-indigo-600" size={24} />,
    },
    {
      title: "6. No More Digging for Emails",
      description:
        "Connect directly with brands through campaigns — no guessing formats, chasing LinkedIn profiles, or hoping your DM gets seen.",
      points: [],
      icon: <Users className="text-indigo-600" size={24} />,
    },
    {
      title: "7. Showcase Your Work, Automatically",
      description:
        "Your CleerCut profile acts as your always-on media kit. Showcase your content, audience insights, niche, reviews, and more — no PDF required.",
      points: [],
      icon: <FileText className="text-indigo-600" size={24} />,
    },
    {
      title: "8. Join a Real Creator Community",
      description:
        "CleerCut isn't just a tool — it's a growing network of creators sharing advice, asking questions, and supporting each other at every stage.",
      points: [],
      icon: <Users className="text-indigo-600" size={24} />,
    },
  ];

  // Get active feature list based on mode
  const features = isCreatorMode ? creatorFeatures : brandFeatures;
  return { isCreatorMode, features };
}

export default useSolution;

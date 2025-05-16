import { useState } from "react";
import {
  Check,
  Clipboard,
  MessageSquare,
  Clock,
  BarChart3,
  FileText,
  DollarSign,
  Users,
  Shield,
  Star,
} from "lucide-react";

export default function CleerCutSolution() {
  const [isCreatorMode, setIsCreatorMode] = useState(false);

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
      description:
        "Stop guessing who's a fit. CleerCut profiles show everything up front:",
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
        "Most managers and agencies take 15–30% of your earnings just to handle communication. CleerCut only charges the standard 2.9% payment processing fee, and gives you full control of:",
      points: ["Your rates", "Your deliverables", "Your income tracking"],
      icon: <DollarSign className="text-indigo-600" size={24} />,
    },
    {
      title: "4. Keep Every Conversation in One Place",
      description:
        "Stay organized with CleerCut's Smart Inbox, built for creators managing multiple opportunities. Track:",
      points: [
        "Cold outreach",
        "Campaign applications",
        "Active brand communication",
      ],
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header with mode toggle */}
      <header className="bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-4 text-center">
            <h2 className="text-white text-xl font-extrabold">
              {isCreatorMode
                ? "CleerCut empowers creators to spend less time pitching — and more time getting paid."
                : "CleerCut replaces outdated spreadsheets, ghosted DMs, and overpriced platforms — so you can actually scale."}
            </h2>
            <p className="mt-2 text-indigo-100 text-lg">
              {isCreatorMode
                ? "0% commission. Just the standard 2.9% payment processing fee."
                : "Work with creators who deliver, at a price that scales with your business."}
            </p>
          </div>
        </div>
      </header>

      <div className="flex justify-between items-center bg-primary p-5">
        <div className="flex items-center space-x-4">
          <span
            className={`font-medium ${!isCreatorMode ? "text-white" : "text-indigo-200"}`}
          >
            Brand
          </span>
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
              checked={isCreatorMode}
              onChange={() => setIsCreatorMode(!isCreatorMode)}
            />
            <label
              htmlFor="toggle"
              className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer bg-indigo-200"
            ></label>
          </div>
          <span
            className={`font-medium ${isCreatorMode ? "text-white" : "text-indigo-200"}`}
          >
            Creator
          </span>
        </div>
      </div>

      {/* Features Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300"
            >
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold ml-4 text-primary">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                {feature.description}
              </p>
              {feature.points.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 mt-1 text-primary" size={18} />
                      <span className="text-sm text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

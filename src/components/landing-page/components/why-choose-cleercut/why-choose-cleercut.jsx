import { ErrorOutline } from "@mui/icons-material";
import { CheckCircle, XCircleIcon } from "lucide-react";

export default function WhyChooseCleercut({ isCreatorMode }) {
  const brandFeatures = [
    {
      name: "3 Commission-Free Collaborations",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Try before committing",
      competitorNote: "No commission free options",
    },
    {
      name: "8.5% Commission",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Transparent, lower fees",
      competitorNote: "15–30% commission or high monthly subscription",
    },
    {
      name: "All-in-One: CRM, Contracts & Payments",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Manage everything in one place",
      competitorNote: "Scattered across multiple tools",
    },
    {
      name: "Auto-Generated Contracts",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Automatically created from campaign info",
      competitorNote: "Manual or non-existent",
    },
    {
      name: "Inbox Organized by Campaign",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Messages grouped by project",
      competitorNote: "Chaotic email threads",
    },
    {
      name: "Designed for Employee Teamwork",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Built-in tools for team collaboration",
      competitorNote: "One-login or disorganized access",
    },
    {
      name: "Active Campaign Tracking",
      cleercut: true,
      competitor: "warning",
      cleerCutNote: "Real-time progress tracking",
      competitorNote: "Available on GRIN at Enterprise level ($2500+)",
    },
    {
      name: "Post-Campaign Insights",
      cleercut: "warning",
      competitor: false,
      cleerCutNote: "Engagement + ROI analytics (coming soon)",
      competitorNote: "Often paywalled or not included",
    },
    {
      name: "Smart Creator Filtering",
      cleercut: true,
      competitor: "warning",
      cleerCutNote: "Filter by niche, audience, rates",
      competitorNote: "Basic or no filtering",
    },
    {
      name: "Verified Creator Profiles",
      cleercut: true,
      competitor: "warning",
      cleerCutNote: "Profiles verified with platform safeguards",
      competitorNote: "Often self-submitted, unverifiable",
    },
    {
      name: "Dual-Rated Reviews",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Both creators and brands reviewed",
      competitorNote: "Creator-only reviews",
    },
    {
      name: "Built for Brands and Creators",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Equal tools and protection for both",
      competitorNote: "Creator-first, limited brand tools",
    },
  ];

  const creatorFeatures = [
    {
      name: "3 Commission-Free Collaborations",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Try the platform before committing",
      competitorNote: "No commission free options",
    },
    {
      name: "4.5% Commission",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Transparent, lower fees",
      competitorNote: "10–30% on other platforms + agencies",
    },
    {
      name: "All-in-One Dashboard",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Messaging, contracts, payments in one spot",
      competitorNote: "Scattered across multiple tools and platforms",
    },
    {
      name: "Smart Inbox",
      cleercut: true,
      competitor: "warning",
      cleerCutNote:
        "Messages grouped by pending, active, and completed campaigns",
      competitorNote: "Chaotic email threads or basic inboxes",
    },
    {
      name: "Escrow Secured Payments",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Guaranteed payment on completed work",
      competitorNote: "No safeguards - risk of ghosting after creating content",
    },
    {
      name: "Advanced Campaign Filters",
      cleercut: true,
      competitor: "warning",
      cleerCutNote: "Sort by rate, niche and audience fit",
      competitorNote: "Basic or no targeting options",
    },
    {
      name: "Saved Pitch Templates",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Customize and reuse your best pitches for faster outreach",
      competitorNote: "Manual retyping or cold emails",
    },
    {
      name: "Finance Dashboard",
      cleercut: true,
      competitor: false,
      cleerCutNote: "See upcoming and completed payments in one view",
      competitorNote: "No centralized income tracking",
    },
    {
      name: "Verified Brand Profiles",
      cleercut: true,
      competitor: "warning",
      cleerCutNote: "Brands verified via domain authentication",
      competitorNote: "Often self-submitted, unverifiable",
    },
    {
      name: "Dispute Management Support",
      cleercut: true,
      competitor: false,
      cleerCutNote: "CleerCut mediates with contract review",
      competitorNote: "Creator-neglected",
    },
    {
      name: "Dual-Rated Reviews",
      cleercut: true,
      competitor: false,
      cleerCutNote: "Both brands and creators reviewed",
      competitorNote: "Creator-only reviews, no accountability for brands",
    },
  ];

  const currentFeatures = isCreatorMode ? creatorFeatures : brandFeatures;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Why Choose CleerCut Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative text-primary">
              Why Choose CleerCut?{" "}
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="mt-12 overflow-hidden shadow rounded-lg">
            <div className="bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-md font-bold text-gray-600 uppercase tracking-wider"
                      >
                        Feature
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-md font-semibold text-primary uppercase tracking-wider"
                      >
                        CleerCut
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-md font-bold text-gray-600 uppercase tracking-wider"
                      >
                        Competitor Platforms
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentFeatures.map((feature, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {feature.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            {feature.cleercut === true ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : feature.cleercut === "warning" ? (
                              <ErrorOutline className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span className="ml-2">{feature.cleerCutNote}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            {feature.competitor === true ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : feature.competitor === "warning" ? (
                              <ErrorOutline className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span className="ml-2">
                              {feature.competitorNote}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

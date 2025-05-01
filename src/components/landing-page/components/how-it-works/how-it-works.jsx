import {
  CampaignOutlined,
  Search,
  Handshake,
  AttachMoney,
} from "@mui/icons-material";

function HowCleerCutWorks({ isCreatorMode }) {
  const steps = [
    {
      title: isCreatorMode ? "Set Up Your Portfolio" : "Post a Campaign",
      description: isCreatorMode
        ? "Build a clean, professional portfolio in minutes. Showcase your past work, audience data, and reviews — no Canva or graphic design needed."
        : "Create a campaign, set your budget, and define your goals in minutes.",
      icon: <CampaignOutlined className="w-8 h-8" />,
    },
    {
      title: isCreatorMode
        ? "Discover Campaigns you Love"
        : "Find Top Creators",
      description: isCreatorMode
        ? "Quick-apply to campaigns that match your audience and rates. No more hours lost to cold pitch emails"
        : "Discover trending creators and sort applications using advanced filters for niche, audience, engagement and more.",
      icon: <Search className="w-8 h-8" />,
    },
    {
      title: isCreatorMode
        ? " Collaborate better with Smart Campaign management"
        : "Collaborate Seamlessly",
      description: isCreatorMode
        ? "Manage deadlines, track payments, and move all your communication to one organized place"
        : "Streamline partnerships with the Smart Inbox, track deliverables, and manage your budget with ease.",
      icon: <Handshake className="w-8 h-8" />,
    },
    {
      title: isCreatorMode
        ? "Get Paid with Peace of Mind"
        : "Payment & Contracts Simplified",
      description: isCreatorMode
        ? "CleerCut holds payments in escrow — no more endless revisions, ghosting or chasing down payments"
        : "Secure payments via escrow, auto-generate contracts, and streamlined dispute management.",
      icon: <AttachMoney className="w-8 h-8" />,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-tr from-blue-600/40 to-transparent">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            How CleerCut Works for {isCreatorMode ? "Creators" : "Brands"}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-indigo-600 rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isCreatorMode
              ? "Placeholder: Add overview text for creator mode"
              : "From finding the perfect creators to managing successful campaigns, all in one platform."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 w-full h-0.5 bg-primary transform -translate-y-1/2"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl relative z-10 group"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-6 group-hover:bg-indigo-600 group-hover:text-white transition mx-auto">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-center group-hover:text-indigo-600 transition">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center group-hover:text-gray-800 transition">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowCleerCutWorks;

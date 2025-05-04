import {
  CampaignOutlined,
  Search,
  Handshake,
  AttachMoney,
} from "@mui/icons-material";

function HowCleerCutWorks({ isCreatorMode }) {
  const steps = [
    {
      title: isCreatorMode ? "Set Up Your Portfolio" : "Create a Campaign",
      description: isCreatorMode
        ? "Build a clean, professional portfolio in minutes. Showcase your past work, audience data, and reviews — no Canva or graphic design needed."
        : "Create a campaign, set your budget, and define your goals in 5 quick steps.",
      image:
        "/assets/images/landing/create campaign on iphone perfected (1).png",
    },
    {
      title: isCreatorMode
        ? "Discover Campaigns you Love"
        : "Find Top Creators",
      description: isCreatorMode
        ? "Quick-apply to campaigns that match your audience and rates. No more hours lost to cold pitch emails"
        : "Invite creators to apply and sort through applications easily with advanced filters for niche, audience, engagement and more.",
      image: "/assets/images/landing/Discover Perfect.png",
    },
    {
      title: isCreatorMode
        ? " Collaborate better with Smart Campaign management"
        : "Collaborate Seamlessly",
      description: isCreatorMode
        ? "Manage deadlines, track payments, and move all your communication to one organized place"
        : "Streamline partnerships with the Smart Inbox, track deliverables, and manage your budget with ease.",
      image: "/assets/images/landing/inbox on macbook office perfect (1).png",
    },
    {
      title: isCreatorMode
        ? "Get Paid with Peace of Mind"
        : "Payment & Contracts Simplified",
      description: isCreatorMode
        ? "CleerCut holds payments in escrow — no more endless revisions, ghosting or chasing down payments"
        : "Secure payments via escrow, auto-generate contracts, and streamlined dispute management.",
      image: "/assets/images/landing/reports on mac Perfect (1).png",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-tr from-blue-600/40 to-transparent">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            {isCreatorMode
              ? "Our Creators Make The Difference"
              : "Brands Empowering Creators"}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-indigo-600 rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isCreatorMode
              ? "Connect with content creators who bring your brand vision to life"
              : "Discover forward-thinking brands ready to collaborate with top creators"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-2 rounded-xl shadow-xl hover:shadow-2xl overflow-hidden group"
            >
              <div className="rounded-xl overflow-hidden mb-6 h-48">
                <img
                  src={step.image}
                  alt={`${isCreatorMode ? "Creator" : "Brand"} - ${step.title}`}
                  className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-2">
                <h4 className="font-bold mb-3 text-primary">{step.title}</h4>
                <p className="text-gray-600 mb-4">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowCleerCutWorks;

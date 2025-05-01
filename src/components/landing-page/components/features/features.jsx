import {
  EditCalendarOutlined,
  MailOutline,
  DescriptionOutlined,
  VerifiedOutlined,
  Search,
  Paid,
  BarChartOutlined,
  FilterOutlined,
  HotelClassOutlined,
} from "@mui/icons-material";
import React from "react";

function Features({ isCreatorMode }) {
  const features = [
    {
      icon: <EditCalendarOutlined className="w-6 h-6" />,
      title: isCreatorMode
        ? "Clean, Professional Portfolio"
        : "Creator Analysis",
      description: isCreatorMode
        ? "Showcase your best work, audience insights, reviews, and niche in one powerful page. No more long hours creating media kits."
        : "Quickly view creators’ portfolios, reviews and audience demographics, all in one place.",
    },
    {
      icon: <MailOutline className="w-6 h-6" />,
      title: "Smart Inbox",
      description:
        "Keep all communication about past, current and future Campaigns organized with your new Smart Inbox. Say goodbye to messy Email threads.",
    },
    {
      icon: isCreatorMode ? (
        <BarChartOutlined className="w-6 h-6" />
      ) : (
        <DescriptionOutlined className="w-6 h-6" />
      ),
      title: isCreatorMode
        ? "Income + Deadline Tracking"
        : "Advanced Campaign Management",
      description: isCreatorMode
        ? "Manage your deadline and track your earnings — all in one place."
        : "Run smarter campaigns with real-time progress tracking, easy budget management and simplified creator coordination — all in one place.",
    },
    {
      icon: <VerifiedOutlined className="w-6 h-6" />,
      title: isCreatorMode ? "Verified Brand Access" : "Verified Creators",
      description: isCreatorMode
        ? "Apply to campaigns from vetted, trustworthy brands only."
        : "See what other Brands had to say about working with a creator before investing your money",
    },
    {
      icon: isCreatorMode ? (
        <DescriptionOutlined className="w-6 h-6" />
      ) : (
        <Search className="w-6 h-6" />
      ),
      title: isCreatorMode ? "Contract Automation" : "Easy Creator Discovery",
      description: isCreatorMode
        ? "Built-in contracts tied to each campaign to protect your work."
        : "Use advanced filters to find creators that align with your niche, audience and campaign needs",
    },
    {
      icon: <FilterOutlined className="w-6 h-6" />,
      title: isCreatorMode ? "Custom Application Filters" : null,
      description:
        "Find the campaigns that are the perfect fit for your audience.",
    },
    {
      icon: <Paid className="w-6 h-6" />,
      title: "Escrow Payments",
      description: isCreatorMode
        ? "Once a deal is agreed, we hold the payment securely. Get paid when your work is complete. No more chasing down brands for your hard-earned cash."
        : "Payments are held securely until both parties are satisfied - no risk, no confusion.",
    },
    {
      icon: <HotelClassOutlined className="w-6 h-6" />,
      title: isCreatorMode ? "Get Featured" : null,
      description:
        "Creators who complete campaigns can earn extra exposure on our homepage.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            Everything You Need
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-indigo-600 rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isCreatorMode
              ? "Essential tools to grow, collaborate, and get paid—stress free."
              : "Powerful features designed to make your creator partnerships successful"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          {features.map((feature, idx) => (
            <React.Fragment key={idx}>
              {feature.title && (
                <div key={idx} className="flex flex-col items-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;

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
      image: "/assets/images/landing/9CF53C2E-C1E7-4F7F-849B-F8C4AF33EA37.png",
      title: isCreatorMode
        ? "Clean, Professional Portfolio"
        : "Creator Analysis",
      description: isCreatorMode
        ? "Showcase your best work, audience insights, reviews, and niche in one powerful page. No more long hours creating media kits."
        : "Quickly view creators’ portfolios, reviews and audience demographics, all in one place.",
    },
    {
      image: "/assets/images/landing/9E2029F0-F0B3-49B1-8C80-2211136A9D2A.png",
      title: "Smart Inbox",
      description:
        "Keep all communication about past, current and future Campaigns organized with your new Smart Inbox. Say goodbye to messy Email threads.",
    },
    {
      image: isCreatorMode ? (
        <BarChartOutlined className="w-6 h-6" />
      ) : (
        "/assets/images/landing/1917237E-8DC4-42BB-8358-63F1958C00F6.png"
      ),
      title: isCreatorMode
        ? "Income + Deadline Tracking"
        : "Advanced Campaign Management",
      description: isCreatorMode
        ? "Manage your deadline and track your earnings — all in one place."
        : "Run smarter campaigns with real-time progress tracking, easy budget management and simplified creator coordination — all in one place.",
    },
    {
      image: "/assets/images/landing/5DAF8574-00A5-466A-8E9B-7760E38A3B5F.png",
      title: isCreatorMode ? "Verified Brand Access" : "Verified Creators",
      description: isCreatorMode
        ? "Apply to campaigns from vetted, trustworthy brands only."
        : "See what other Brands had to say about working with a creator before investing your money",
    },
    {
      image: isCreatorMode ? (
        <DescriptionOutlined className="w-6 h-6" />
      ) : (
        "/assets/images/landing/9CF53C2E-C1E7-4F7F-849B-F8C4AF33EA37.png"
      ),
      title: isCreatorMode ? "Contract Automation" : "Easy Creator Discovery",
      description: isCreatorMode
        ? "Built-in contracts tied to each campaign to protect your work."
        : "Use advanced filters to find creators that align with your niche, audience and campaign needs",
    },
    {
      image: <FilterOutlined className="w-6 h-6" />,
      title: isCreatorMode ? "Custom Application Filters" : null,
      description:
        "Find the campaigns that are the perfect fit for your audience.",
    },
    {
      image: "/assets/images/landing/A5FF6362-1ADF-42EC-A885-60C555993750.png",
      title: "Escrow Payments",
      description: isCreatorMode
        ? "Once a deal is agreed, we hold the payment securely. Get paid when your work is complete. No more chasing down brands for your hard-earned cash."
        : "Payments are held securely until both parties are satisfied - no risk, no confusion.",
    },
    {
      image: <HotelClassOutlined className="w-6 h-6" />,
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
            CleerCut Features for {isCreatorMode ? "Creators" : "Brands"}
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
                      <img src={feature.image} />
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

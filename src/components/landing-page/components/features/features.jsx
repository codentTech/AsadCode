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
      image: "/assets/images/landing/1917237E-8DC4-42BB-8358-63F1958C00F6.png",
      title: isCreatorMode
        ? "Deadline + Income Tracking"
        : "Advanced Campaign Management",
      description: isCreatorMode
        ? "Manage your deadline and track your earnings — all in one place."
        : "Run smarter campaigns with real-time progress tracking, easy budget management and simplified creator coordination — all in one place.",
    },
    {
      image: "/assets/images/landing/5DAF8574-00A5-466A-8E9B-7760E38A3B5F.png",
      title: isCreatorMode ? "Verified Brand" : "Verified Creators",
      description: isCreatorMode
        ? "Apply to campaigns from vetted, trustworthy brands only."
        : "See what other Brands had to say about working with a creator before investing your money",
    },
    {
      image: isCreatorMode
        ? "/assets/images/landing/414C0BE8-9E74-4525-B4A7-2506EE9724C1.png"
        : "/assets/images/landing/6749B5C6-2B6E-4EEB-A153-87CFC5A017BA.png",
      title: isCreatorMode ? "Finance Dashboard" : "Easy Creator Discovery",
      description: isCreatorMode
        ? "Built-in contracts tied to each campaign to protect your work."
        : "Use advanced filters to find creators that align with your niche, audience and campaign needs",
    },
    {
      image: "/assets/images/landing/E3289995-BF9A-45F2-9D8A-D0865CAC851C.png",
      title: isCreatorMode ? "Advanced Application Filters" : null,
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
      image: "/assets/images/landing/A0CE12CB-39E2-4517-BE6A-3724CFCE99E3.png",
      title: isCreatorMode ? "Dispute Management Support" : null,
      description:
        "If a brand backs out, CleerCut ensures you’re paid for what you delivered — fairly and fast.",
    },

    {
      image: "/assets/images/landing/9577CCD8-BB72-4924-BA6A-BDE85FB98500.png",
      title: isCreatorMode ? null : "Finance Management",
      description:
        "CleerCut lets you allocate budgets, track real-time spend by campaign or niche, and monitor all payment activity — including funds held in escrow, pending releases, and historical spend patterns — all in one clean dashboard.",
    },
    {
      image: "/assets/images/landing/9E7E8866-FDA3-4D92-BB9E-C02B902299FD.png",
      title: isCreatorMode ? null : "Team Coordination",
      description:
        "Built for modern marketing teams. Assign teammates to specific campaigns, leave internal notes, and seamlessly toggle across collaborations — so everyone stays aligned without stepping on toes.",
    },
    {
      image: "/assets/images/landing/42B15A63-0445-4D00-9867-3D294A259E2C.png",
      title: isCreatorMode ? null : "Auto-generated Contracts",
      description:
        "CleerCut automatically creates contracts based on your selected deliverables, deadlines, and payment terms — giving you professional, enforceable agreements in seconds.",
    },

    {
      image: "/assets/images/landing/4CD47FE0-B939-48A7-BFEE-AE90CDF15458.png",
      title: isCreatorMode ? "Quick-apply" : null,
      description:
        "Customize and save pitches to apply to campaigns in seconds.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-4xl font-bold mb-4 inline-block relative text-primary">
            CleerCut Features for {isCreatorMode ? "Creators" : "Brands"}
          </h2>
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
                  <p className="text-sm text-gray-600">{feature.description}</p>
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

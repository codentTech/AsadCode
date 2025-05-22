import React from "react";

function Features({ isCreatorMode }) {
  const features = [
    {
      icon: "/assets/images/landing/9E2029F0-F0B3-49B1-8C80-2211136A9D2A.png",
      title: "Smart Inbox",
      description: isCreatorMode
        ? "Track all messages, contracts, and campaign details by stage — from cold pitches to completed deals. No more cluttered email threads and lost DMs."
        : "Track messages, deliverables, contracts, and payments by campaign — with filtered pitches and internal notes in one streamlined inbox",
      position: isCreatorMode ? 3 : 1,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: "/assets/images/landing/A5FF6362-1ADF-42EC-A885-60C555993750.png",
      title: "Escrow Payments",
      description: isCreatorMode
        ? "Once a deal is signed, payment is held securely. You deliver the work — CleerCut guarantees you get paid. No chasing brands. No awkward follow-ups. "
        : "Payments are held securely and only released when approved work is delivered — no risk, no confusion.",
      position: isCreatorMode ? 2 : 2,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: "/assets/images/landing/42B15A63-0445-4D00-9867-3D294A259E2C.png",
      title: isCreatorMode ? null : "Auto-generated Contracts",
      description:
        "Instant contracts with customizable terms like usage rights and payments — no templates, no uploads, no legal back-and-forth.",
      position: isCreatorMode ? 12 : 3,
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: isCreatorMode
        ? "/assets/images/landing/414C0BE8-9E74-4525-B4A7-2506EE9724C1.png"
        : "/assets/images/landing/6749B5C6-2B6E-4EEB-A153-87CFC5A017BA.png",
      title: isCreatorMode ? "Creator Networking" : "Precision Discovery",
      description: isCreatorMode
        ? "CleerCut is more than just collaboration listings— it’s where creators get paid fairly (0% commission), stay protected from scams, join creator groups and attend networking events - with advanced networking tools coming soon."
        : "Filter creators by niche, platform, engagement, and audience insights — with tools that go beyond basic search",
      position: isCreatorMode ? 8 : 4,
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: "/assets/images/landing/5DAF8574-00A5-466A-8E9B-7760E38A3B5F.png",
      title: isCreatorMode ? "Verified Brand Campaigns" : "Verified Creator Profiles",
      description: isCreatorMode
        ? "Apply only to campaigns from vetted, trustworthy brands — no more ghosting, no more sketchy offers."
        : "Instantly view audience data, past work, and verified reviews — everything you need to vet a creator at a glance.",
      position: isCreatorMode ? 6 : 5,
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: "/assets/images/landing/9577CCD8-BB72-4924-BA6A-BDE85FB98500.png",
      title: isCreatorMode ? null : "Finance Dashboard",
      description:
        "Track budget, escrow status, and spend by campaign or niche — with a full payment history built in.",
      position: isCreatorMode ? 11 : 6,
      color: "bg-lime-100 text-lime-600",
    },
    {
      icon: "/assets/images/landing/9E7E8866-FDA3-4D92-BB9E-C02B902299FD.png",
      title: isCreatorMode ? null : "Team Collaboration",
      description:
        "Assign teammates, leave internal notes, and manage campaigns without overlap — built for lean, fast-moving teams.",
      position: isCreatorMode ? 10 : 7,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: "/assets/images/landing/9CF53C2E-C1E7-4F7F-849B-F8C4AF33EA37.png",
      title: isCreatorMode ? "Clean, Professional Portfolio" : "Dual-Sided Reviews",
      description: isCreatorMode
        ? "Showcase your rates, best work, audience demographics, reviews, and niches — all in one polished page. No more time wasted editing media kits."
        : "Reviews stay hidden until both parties submit — ensuring honest, fair feedback every time.",
      position: isCreatorMode ? 1 : 8,
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: "/assets/images/landing/1917237E-8DC4-42BB-8358-63F1958C00F6.png",
      title: isCreatorMode ? "Deadline + Income Tracking" : "Filtered Pitches",
      description: isCreatorMode
        ? "Stay on top of deliverables and know exactly what you’re earning — with built-in deadline reminders and payout visibility."
        : "Filter unsolicited pitches by niche, audience, and engagement — all in a separate tab so your main inbox stays focused and clean.",
      position: isCreatorMode ? 5 : 9,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: "/assets/images/landing/E3289995-BF9A-45F2-9D8A-D0865CAC851C.png",
      title: isCreatorMode ? "Advanced Application Filters" : null,
      description:
        "Find campaigns that match your niche, audience, and platform — so you spend less time scrolling and more time landing paid work",
      position: isCreatorMode ? 4 : 0,
      color: "bg-rose-100 text-rose-600",
    },
    {
      icon: "/assets/images/landing/A0CE12CB-39E2-4517-BE6A-3724CFCE99E3.png",
      title: isCreatorMode ? "Dispute Management Support" : null,
      description:
        "If something goes wrong, CleerCut steps in. We make sure you’re paid fairly for the work you deliver.",
      position: isCreatorMode ? 9 : 11,
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: "/assets/images/landing/4CD47FE0-B939-48A7-BFEE-AE90CDF15458.png",
      title: isCreatorMode ? "Quick-apply Templates" : null,
      description:
        "Save custom pitch templates and apply to campaigns in seconds — without rewriting every time.",
      position: isCreatorMode ? 7 : 0,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  // Sort the features based on position
  const sortedFeatures = [...features].sort((a, b) => a.position - b.position);

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-4xl font-bold mb-4 inline-block relative text-primary">
            CleerCut Features For {isCreatorMode ? "Creators" : "Brands"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFeatures.map((feature, idx) => (
            <React.Fragment key={idx}>
              {feature.title && (
                <div className="px-4 md:px-8 group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0 border border-gray-100">
                  <div className="flex gap-4 items-start mb-4">
                    <div
                      className={`w-14 h-14 flex items-center justify-center ${feature.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-18 pl-1">{feature.description}</p>
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

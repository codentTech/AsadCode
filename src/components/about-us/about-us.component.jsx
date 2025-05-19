import { CheckCircle, Heart, Target } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white text-5xl sm:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            About CleerCut
          </h1>
          <p className="text-xl sm:text-2xl text-indigo-100 max-w-7xl mx-auto font-light">
            The first all-in-one platform designed to simplify and safeguard influencer
            collaborations — from first message to final payment.
          </p>
        </div>
      </header>

      {/* Our Story Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary mb-4">Our Story</h2>
          <p className="text-lg text-gray-600 max-w-7xl mx-auto">
            We created CleerCut because influencer marketing is broken. Brands waste hours chasing
            down creators, managing scattered spreadsheets, and hoping for results. Creators are
            often left in the dark, unpaid, or ghosted without accountability.
          </p>
          <p className="mt-6 text-lg text-gray-600 max-w-7xl mx-auto">
            CleerCut fixes that. Whether you’re a brand running 15 campaigns or a creator landing
            your first paid deal, we bring clarity, structure, and trust to collaborations.
          </p>
        </div>

        <div className="h-px w-full bg-indigo-100 mb-8" />

        {/* Mission and Vision */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-primary">Who We Are</h2>
            <p className="text-gray-600 mt-3 text-lg max-w-7xl mx-auto">
              We're redefining influencer marketing to be fair, efficient, and empowering for both
              creators and brands.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Our Mission */}
            <div className="md:w-1/2">
              <div className="flex items-center mb-5">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary ml-3">Our Mission</h3>
              </div>
              <div className="flex ml-2 mb-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  <strong>Influencer marketing:</strong> To make influencer marketing seamless,
                  transparent, and fair — for everyone involved.
                </p>
              </div>
              <div className="flex ml-2 mb-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  <strong>Brand:</strong> Looking for vetted, high-performing creators — without the
                  agency fees or friction.
                </p>
              </div>
              <div className="flex ml-2 mb-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  <strong>Creator:</strong> Ready to turn their influence into income and take
                  control of their business.
                </p>
              </div>
            </div>

            {/* Our Values */}
            <div className="md:w-1/2 md:border-l border-indigo-200 md:pl-6">
              <div className="flex items-center mb-5">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Heart className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary ml-3">What We Believe</h3>
              </div>
              <ul className="space-y-3">
                {[
                  {
                    title: 'Collaboration should be simple:',
                    desc: 'No more email chains, chasing people down for updates, or messy spreadsheets.',
                  },
                  {
                    title: 'Trust should be built-in:',
                    desc: 'Verified profiles, escrow payments, and mutual reviews protect both sides.',
                  },
                  {
                    title: 'Creators are professionals:',
                    desc: 'Media kits, contracts, and performance data should be easy to manage.',
                  },
                  {
                    title: 'Brands deserve results:',
                    desc: 'Brands should know exactly who they’re working with — and what they’re getting.',
                  },
                ].map((value, idx) => (
                  <li className="ml-2 flex items-start" key={idx}>
                    <CheckCircle className="w-5 h-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>{value.title}</strong> {value.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

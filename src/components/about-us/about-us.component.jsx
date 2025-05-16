import {
  ArrowRight,
  CheckCircle,
  Target,
  Users,
  ShieldCheck,
  Award,
  Heart,
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-white text-5xl font-bold mb-3">
              About CleerCut
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              The first all-in-one platform designed to simplify and safeguard
              influencer collaborations — from first message to final payment.
            </p>
          </div>
        </div>
      </header>

      {/* Our Story Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
          <div className="max-w-3xl mx-auto text-lg text-gray-600 text-left">
            <p className="mb-3">
              We created CleerCut because influencer marketing is broken. Brands
              waste hours chasing down creators, managing scattered
              spreadsheets, and crossing their fingers that campaigns deliver.
              Creators are left in the dark, often unpaid or ghosted without
              accountability.
            </p>
            <p className="mb-6">
              CleerCut fixes that. Our platform brings clarity, structure, and
              trust to the collaboration process. Whether you’re a brand running
              15 campaigns or a creator landing your first paid deal, CleerCut
              helps you move faster, work smarter, and build better
              partnerships.
            </p>
          </div>
        </div>
        <hr />

        {/* Mission and Vision */}
        <div className="rounded-lg p-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-primary">Who We Are</h2>
            <p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
              We're redefining influencer marketing to be fair and efficient.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Our Mission */}
            <div className="md:w-1/2">
              <div className="flex items-center mb-5">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary ml-3">
                  Our Mission
                </h3>
              </div>
              <div className="flex ml-2">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  To make influencer marketing seamless, transparent, and fair —
                  for everyone involved.
                </p>
              </div>
            </div>

            {/* Our Values */}
            <div className="md:w-1/2 md:border-l border-indigo-200 md:pl-6">
              <div className="flex items-center mb-5">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Heart className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary ml-3">
                  What We Believe
                </h3>
              </div>
              <ul className="space-y-6">
                {[
                  {
                    title: "Collaboration should be simple:",
                    desc: "No more email chains, chasing people down for updates, or messy spreadsheets.",
                  },
                  {
                    title: "Trust should be built-in:",
                    desc: "Verified profiles, escrow payments, and mutual reviews protect both sides.",
                  },
                  {
                    title: "Creators are professionals:",
                    desc: "Media kits, contracts, and performance data should be easy to manage.",
                  },
                  {
                    title: "Brands deserve results:",
                    desc: "Brands should know exactly who they’re working with — and what they’re getting.",
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

      {/* Who We're For Section */}
      <section className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-5 text-white">
            Who We're For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Brands */}
            <div className="bg-indigo-700 rounded-2xl p-8 hover:bg-indigo-800 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-indigo-600 rounded-full mb-6">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Brands</h3>
                <p className="text-indigo-100 mb-6">
                  Looking for vetted, high-performing creators — without the
                  agency fees or friction.
                </p>
                <div className="bg-primary text-white rounded-full px-6 py-3 font-medium flex items-center mt-2 hover:bg-indigo-500 transition-colors">
                  Brand Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* For Creators */}
            <div className="bg-indigo-700 rounded-lg p-8 hover:bg-indigo-800 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary rounded-full mb-6">
                  <Award className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Creators</h3>
                <p className="text-indigo-100 mb-6">
                  Ready to turn their influence into income and take control of
                  their business.
                </p>
                <div className="bg-primary text-white rounded-full px-6 py-3 font-medium flex items-center mt-2 hover:bg-indigo-500 transition-colors">
                  Creator Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-indigo-800 text-indigo-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-white text-lg font-bold mb-4">CleerCut</h3>
              <p className="max-w-xs">
                Simplifying and safeguarding influencer collaborations from
                first message to final payment.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Press
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Community
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-indigo-700 mt-8 pt-8 text-center md:text-left md:flex md:justify-between md:items-center">
            <p>© 2025 CleerCut. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
              <a
                href="#"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

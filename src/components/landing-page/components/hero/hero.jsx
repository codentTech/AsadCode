import { ArrowForward } from "@mui/icons-material";

function Hero({ isCreatorMode, setIsCreatorMode }) {
  return (
    <section className="relative pt-20 overflow-hidden bg-white">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-50 via-white to-indigo-50 opacity-70"></div>
        {/* Animated blob shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-indigo-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-12 pb-12 md:pb-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:space-x-12 lg:space-x-20">
          {/* Content Area */}
          <div className="w-full md:w-1/2 mb-16 md:mb-0 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-3xl blur-2xl opacity-30 transform rotate-3"></div>
            <div className="relative z-10">
              {/* Animated underline for heading */}
              {/* <div
                className="relative mb-4 cursor-pointer"
                onClick={() => setIsCreatorMode(!isCreatorMode)}
              >
                <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md">
                  {isCreatorMode ? "Creator" : "Brand"} Collaboration Platform
                </span>
              </div> */}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-3">
                “The ultimate{" "}
                <span className="text-indigo-600">all-in-one platform</span>{" "}
                {isCreatorMode
                  ? "to land more collaborations with trusted brands”"
                  : "to collaborate with trusted creators”"}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                {isCreatorMode
                  ? "Showcase your value, apply faster, and get paid securely — all in one place."
                  : "Discover vetted creators, manage smarter campaigns and track everything – all in one place."}
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Primary CTA with animation */}
                <button className="group relative px-8 py-4 overflow-hidden rounded-full transition duration-300">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-indigo-800 transition-all duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-700 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"></div>
                  <div className="absolute top-0 right-0 w-1/4 h-full bg-white/20 skew-x-12 transform -translate-x-32 group-hover:translate-x-96 transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center text-white font-semibold text-lg">
                    Join Waitlist
                    <ArrowForward className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Image Area with Floating Elements */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10 perspective-1000">
              {/* Main image with 3D hover effect */}
              <div className="relative group transform transition-all duration-700 hover:rotate-y-12">
                {/* Image Frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl transform -rotate-3 scale-105 blur-sm opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-indigo-100">
                  {/* Image */}
                  <img
                    src={
                      isCreatorMode
                        ? "/assets/images/landing/hero-bg-2.jpeg"
                        : "/assets/images/landing/hero-bg.jpeg"
                    }
                    alt="Brand collaboration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 to-transparent"></div>

                  {/* Animated overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 transform rotate-12 transition-transform duration-700 group-hover:rotate-3 group-hover:scale-110">
                  <div className="relative bg-white rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">
                        Campaign Live
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating UI elements with independent animations */}
                <div className="absolute top-10 -left-10 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500">
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-700 font-bold">EM</span>
                      </div>
                      <div>
                        <span className="text-xs text-indigo-500">
                          New Creator
                        </span>
                        <p className="text-sm font-semibold">Emma Mitchell</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats card animation */}
                <div className="absolute -bottom-8 right-10 transform -rotate-3 translate-y-0 hover:translate-y-2 transition-all duration-500">
                  <div className="relative bg-white rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          Engagement
                        </span>
                        <span className="text-sm font-bold text-indigo-700">
                          +24.8%
                        </span>
                      </div>
                      <div className="h-8 w-8 flex items-center justify-center">
                        <span className="text-green-500">↑</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary floating image */}
              {/* <div className="absolute -bottom-12 -left-18 w-32 h-32 lg:w-48 lg:h-48 transform translate-x-0 hover:translate-x-2 hover:translate-y-2 transition-all duration-500">
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 to-indigo-300 rounded-xl transform rotate-6 scale-105 blur-sm opacity-30"></div>
               <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg border border-indigo-100">
                 <img 
                    src="/assets/images/landing/hero-bg-2.jpeg" 
                   alt="Creator profile" 
                   className="w-full h-full object-cover"
                 />
               </div>
             </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-8 md:py-3 transform skew-y-1"></div>
    </section>
  );
}

export default Hero;

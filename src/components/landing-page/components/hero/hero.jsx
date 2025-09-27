import Modal from "@/common/components/modal/modal.component";
import { JoinFullOutlined } from "@mui/icons-material";
import JoinCleerCut from "../join-cleercut/join-cleercut";
import useHero from "./use-hero";

function Hero({ isCreatorMode }) {
  const { isOpen, setIsOpen, closeModal } = useHero();
  return (
    <section className="relative pt-8 overflow-hidden bg-white">
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
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-3">
                The ultimate <span className="text-primary">all-in-one platform</span>{" "}
                {isCreatorMode
                  ? "to land more collaborations with trusted brands"
                  : "to collaborate with trusted creators"}
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                {isCreatorMode
                  ? "Showcase your value, quick-apply to collaborations, and get paid securely - 0% commission. Just the standard 3.2% payment processing fee"
                  : "Discover verified creators, generate contracts in seconds, protect your budget with escrow, and manage campaigns from outreach to deliverables — all in one streamlined workspace."}
              </p>

              {!isCreatorMode && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-bold">Try 3 Campaigns Free</span> → No Fees → No Setup Calls
                  → No Credit Card Required.
                </p>
              )}

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Primary CTA with animation */}
                <button
                  onClick={() => setIsOpen(true)}
                  className="group relative px-8 py-2 overflow-hidden rounded-lg transition duration-300"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-indigo-800 transition-all duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-700 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"></div>
                  <div className="absolute top-0 right-0 w-1/4 h-full bg-white/20 skew-x-12 transform -translate-x-32 group-hover:translate-x-96 transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center text-white font-semibold text-lg">
                    <JoinFullOutlined className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    Join
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

                {/* Floating UI elements with independent animations */}
                <div
                  className={`${isCreatorMode ? "w-52" : "w-36"} absolute top-[1rem] left-5 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500`}
                >
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-lg py-1 px-2 shadow-lg">
                    <div className="flex items-center">
                      {/* <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div> */}
                      <div>
                        <span className="text-[10px] text-black">
                          {isCreatorMode
                            ? "Meyers Nutrition has sent you an offer"
                            : "Auto generating contract"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isCreatorMode && (
                  <div className="text-center w-40 text-white rounded-lg left-5 bg-primary absolute top-32 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500">
                    <div className="relative shadow-lg py-1 px-2">
                      <div className="flex items-center">
                        {/* <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div> */}
                        <div>
                          <span className="text-[10px] text-white">Campaign marked: Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isCreatorMode && (
                  <div
                    className={`${isCreatorMode ? "w-28 top-52 lg:top-72" : "w-36 top-36"} absolute left-5 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500`}
                  >
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-lg py-1 px-2 shadow-lg">
                      <div className="flex items-center space-x-2">
                        {/* <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div> */}
                        <div>
                          <span className="text-[10px] text-black">
                            {isCreatorMode
                              ? "No revisions needed"
                              : "1st draft received for review"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isCreatorMode && (
                  <div className="w-44 absolute top-48 right-5 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500">
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-lg py-1 px-2 shadow-lg">
                      <div className="flex items-center">
                        {/* <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div> */}
                        <div>
                          <span className="text-[10px] text-black">$550 payment received</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isCreatorMode && (
                  <div className="w-48 text-white rounded-lg bg-primary absolute top-24 right-5 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500">
                    <div className="relative py-1 px-2 shadow-lg">
                      <div className="flex items-center">
                        {/* <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div> */}
                        <div>
                          <span className="text-[10px]">Content draft submitted for review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`${isCreatorMode ? "top-60 right-16 lg:top-64 lg:right-56" : "top-30 lg:top-60 right-16"} w-44 text-white rounded-lg bg-primary absolute  transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500`}
                >
                  <div className="relative rounded-lg px-2 py-1 shadow-lg">
                    <div className="flex items-center space-x-2">
                      {/* <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div> */}
                      <div>
                        <span className="text-[10px]">
                          {isCreatorMode
                            ? "You received a rating on your recent campaign ⭐️⭐️⭐️⭐️⭐"
                            : "payment released to creator"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-8 md:py-3 transform skew-y-1"></div>

      <Modal title="Join CleerCut" show={isOpen} onClose={closeModal}>
        <JoinCleerCut closeModal={closeModal} />
      </Modal>
    </section>
  );
}

export default Hero;

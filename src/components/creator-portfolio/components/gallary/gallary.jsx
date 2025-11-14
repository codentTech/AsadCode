import React from "react";
import { RefreshCw } from "lucide-react";
import useGallary from "./use-gallary";
import Niche from "@/components/niche/niche";

const Gallary = ({ refreshKey, creatorId = null }) => {
  const {
    activeTab,
    setActiveTab,
    selectedNiche,
    setSelectedNiche,
    filteredPortfolio,
    portfolioItems,
    creatorCategories,
    isLoading,
    refreshGallery,
  } = useGallary(refreshKey, creatorId);

  const handleNicheChange = (niche) => {
    setSelectedNiche(niche);
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Gallery</h3>
          <button
            onClick={refreshGallery}
            className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
            title="Refresh gallery"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Content Type Filter */}
        <div className="flex space-x-2">
          <div
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1 cursor-pointer rounded-full text-sm ${
              activeTab === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </div>
          <div
            onClick={() => setActiveTab("video")}
            className={`px-4 py-1 cursor-pointer rounded-full text-sm ${
              activeTab === "video"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Videos
          </div>
          <div
            onClick={() => setActiveTab("image")}
            className={`px-4 py-1 cursor-pointer rounded-full text-sm ${
              activeTab === "image"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Images
          </div>
        </div>
      </div>

      {/* Niche Filter */}
      <div className="mb-3">
        <Niche
          categories={creatorCategories}
          onNicheChange={handleNicheChange}
          selectedNiche={selectedNiche}
        />
      </div>

      {/* Portfolio Grid */}
      {filteredPortfolio.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
            >
              <div className="relative aspect-[9/16] w-full bg-gray-900 flex items-center justify-center">
                {item.type === "video" ? (
                  <video
                    key={item.id}
                    src={item.url}
                    className="w-full h-full object-contain bg-black"
                    preload="metadata"
                    controls
                    playsInline
                    poster={item.thumbnail || undefined}
                    style={{
                      pointerEvents: "auto",
                    }}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium text-gray-800 truncate">{item.caption}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{item.niche}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No media found</div>
          <p className="text-gray-500 text-sm">
            {activeTab === "all"
              ? "Your portfolio gallery is empty. Add some images or videos to showcase your work!"
              : `No ${activeTab}s found in your portfolio.`}
          </p>
        </div>
      )}
    </section>
  );
};

export default Gallary;

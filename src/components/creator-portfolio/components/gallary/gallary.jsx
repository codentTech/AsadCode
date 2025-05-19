import React from "react";
import useGallary from "./use-gallary";
import Niche from "@/components/niche/niche";

function Gallary() {
  const { activeTab, setActiveTab, filteredPortfolio } = useGallary();
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row justify-between items-center mb-6">
        <h3>Portfolio Gallery</h3>

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

      {activeTab === "video" && (
        <div className="mb-3">
          <Niche />
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredPortfolio.map((item) => (
          <div
            key={item.id}
            className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-48 object-cover"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <div className="w-12 h-12 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
                    <img src="/assets/images/landing/play.svg" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-600 truncate">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallary;

"use client";

import useBrandWalkthrough from "./use-brand-walkthrough.hook";

export default function BrandWalkthrough() {
  const { tabs, activeTab, handleTabChange } = useBrandWalkthrough();

  return (
    <section id="features" className="py-16 md:py-20 bg-gradient-to-tr from-blue-300/20 to-transparent overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-4xl font-bold mb-3 text-primary">
            Everything your campaign needs, in one place
          </h2>
          <p className="text-sm md:text-base text-gray-600">From first search to final report</p>
        </div>

        <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto">
          <div
            className="flex md:grid md:grid-cols-4 gap-2 min-w-max md:min-w-0 bg-white/70 rounded-xl p-1.5 border border-gray-100"
            role="tablist"
            aria-label="Product walkthrough"
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(index)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-white hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mb-6 md:mb-8">
          <div
            className="pointer-events-none absolute -inset-4 md:-inset-6 rounded-[2rem] bg-indigo-300/40 blur-3xl opacity-70"
            aria-hidden
          />
          <div className="relative z-10 rounded-xl overflow-hidden bg-white shadow-[0_8px_40px_rgba(129,140,248,0.25)] border border-gray-100">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-gray-50">
              {tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  className={`absolute inset-0 flex items-center justify-center p-2 sm:p-3 ${
                    activeTab === index ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  role="tabpanel"
                  aria-hidden={activeTab !== index}
                >
                  <img
                    src={tab.image}
                    alt={`${tab.label} product screenshot`}
                    className="max-h-full max-w-full w-auto h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid">
          {tabs.map((tab, index) => (
            <div
              key={`${tab.id}-columns`}
              className={`col-start-1 row-start-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${
                activeTab === index ? "visible" : "invisible pointer-events-none"
              }`}
              aria-hidden={activeTab !== index}
            >
              {tab.columns.map((column) => (
                <div
                  key={column.title}
                  className="bg-white/80 rounded-xl border border-gray-100 p-4 shadow-sm"
                >
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1.5">
                    {column.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-snug">{column.copy}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

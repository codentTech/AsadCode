import CustomButton from "@/common/components/custom-button/custom-button.component";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";
import useFaqHook from "./use-faq.hook";

export default function FAQPage() {
  const {
    activeCategory,
    setActiveCategory,
    openQuestions,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    setIsSearching,
    toggleQuestion,
    handleSearch,
    faqData,
    categoryIcons,
  } = useFaqHook();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-indigo-100 text-lg max-w-4xl mx-auto">
            Everything you need to know about using CleerCut for seamless
            brand-creator collaborations
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border-indigo-100 rounded-lg 
                           focus:outline-none bg-indigo-500 
                           placeholder-indigo-300 text-white shadow-lg"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {isSearching ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-primary">
                Search Results ({searchResults.length})
              </h2>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="mx-auto h-12 w-12 text-indigo-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No results found
                </h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search terms or browse the categories
                  below.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden divide-y divide-gray-200">
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-6 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-primary">
                        {result.question}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-primary">
                        {result.category}
                      </span>
                    </div>
                    <p className="mt-3 text-gray-600">{result.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Category Navigation */}
            <div className="overflow-x-auto">
              <div className="inline-flex space-x-2 min-w-full pb-2">
                {faqData.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => setActiveCategory(category.category)}
                    className={`px-5 py-3 text-sm rounded-lg font-medium flex items-center transition-all whitespace-nowrap
                      ${
                        activeCategory === category.category
                          ? "bg-primary text-white shadow-md"
                          : "bg-white text-primary hover:bg-indigo-100"
                      }`}
                  >
                    <span className="mr-2">
                      {categoryIcons[category.category]}
                    </span>
                    {category.category}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm flex justify-end mt-2 text-primary">
              Scroll right for more →
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white mt-5 rounded-2xl shadow-md overflow-hidden">
              {faqData
                .find((category) => category.category === activeCategory)
                ?.questions.map((item, qIndex) => {
                  const isOpen = openQuestions[`${activeCategory}-${qIndex}`];
                  return (
                    <div
                      key={qIndex}
                      className="border-b border-indigo-100 last:border-b-0"
                    >
                      <button
                        className={`w-full px-6 py-5 flex justify-between items-center hover:bg-indigo-50 transition-colors
                          ${isOpen ? "bg-indigo-50" : "bg-white"}`}
                        onClick={() => toggleQuestion(activeCategory, qIndex)}
                      >
                        <h3 className="text-lg font-medium text-left text-indigo-900">
                          {item.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 py-5 bg-indigo-50 text-gray-700">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* Contact Section */}
        <div className="text-white mt-16 text-center">
          <div className="bg-primary rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl text-white font-bold mb-4">
              Still have questions?
            </h2>
            <p className="mb-6">
              Our support team is ready to help you with any questions or
              concerns.
            </p>
            <div className="flex justify-center space-x-4">
              <CustomButton
                text="Contact Support"
                className="w-auto btn-white-cancel"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

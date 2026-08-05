"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import { HelpCircle, Search } from "lucide-react";
import useFaqHook from "./use-faq.hook";

export default function FAQPage() {
  const {
    activeCategory,
    searchQuery,
    searchResults,
    isSearching,
    setIsSearching,
    setSearchQuery,
    handleCategorySelect,
    handleSearch,
    faqData,
    categoryIcons,
    categorySectionId,
  } = useFaqHook();

  return (
    <HeaderFooterLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <header className="bg-primary shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold text-white">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-4xl text-lg text-indigo-100">
              Everything you need to know about using CleerCut for seamless
              brand-creator collaborations
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border-indigo-100 bg-indigo-500 py-3 pl-10 pr-3 text-white shadow-lg placeholder-indigo-300 focus:outline-none"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {isSearching ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-primary">
                  Search Results ({searchResults.length})
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearching(false);
                  }}
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Clear Search
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-16 text-center">
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
                <div className="divide-y divide-gray-200 overflow-hidden rounded-xl bg-white shadow-md">
                  {searchResults.map((result, idx) => (
                    <div
                      key={`${result.category}-${idx}`}
                      className="p-6 transition-colors hover:bg-indigo-50"
                    >
                      <div className="flex justify-between gap-3">
                        <h3 className="text-left text-lg font-medium text-primary">
                          {result.question}
                        </h3>
                        <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-primary">
                          {result.category}
                        </span>
                      </div>
                      <p className="mt-3 text-left text-gray-600">{result.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="inline-flex min-w-full space-x-2 pb-2">
                  {faqData.map((category) => (
                    <button
                      key={category.category}
                      type="button"
                      onClick={() => handleCategorySelect(category.category)}
                      className={`flex items-center whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium transition-all ${
                        activeCategory === category.category
                          ? "bg-primary text-white shadow-md"
                          : "bg-white text-primary hover:bg-indigo-100"
                      }`}
                    >
                      <span className="mr-2">{categoryIcons[category.category]}</span>
                      {category.category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex justify-end text-sm text-primary">
                Scroll right for more →
              </div>

              <div className="mt-5 space-y-8">
                {faqData.map((category) => (
                  <section
                    key={category.category}
                    id={categorySectionId(category.category)}
                    className="scroll-mt-24 overflow-hidden rounded-2xl bg-white shadow-md"
                  >
                    <h2 className="border-b border-indigo-100 bg-indigo-50 px-6 py-4 text-left text-lg font-semibold text-primary">
                      {category.category}
                    </h2>
                    <div className="divide-y divide-indigo-100">
                      {category.questions.map((item) => (
                        <div key={item.question} className="px-6 py-4 text-left">
                          <p className="text-lg font-medium text-indigo-900">
                            <strong>{item.question}</strong>
                          </p>
                          <p className="mt-2 text-gray-700">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}

          <div className="mt-16 text-center text-white">
            <div className="rounded-2xl bg-primary p-8 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Still have questions?
              </h2>
              <p className="mb-6">
                Our support team is ready to help you with any questions or
                concerns.
              </p>
              <div className="flex justify-center space-x-4">
                <CustomButton
                  text="Contact Support"
                  className="btn-white-cancel w-auto"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </HeaderFooterLayout>
  );
}

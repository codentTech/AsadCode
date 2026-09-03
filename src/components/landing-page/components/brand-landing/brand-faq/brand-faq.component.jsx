"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import useBrandFaq from "./use-brand-faq.hook";

export default function BrandFaq() {
  const { faqs, openIndex, handleToggle } = useBrandFaq();

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-2/5">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 leading-tight">
              Questions we get asked most
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Still have one?{" "}
              <a
                href="mailto:partnerships@cleercut.com"
                className="text-primary font-semibold hover:underline"
              >
                Contact us
              </a>{" "}
              and we&apos;ll be happy to help.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Looking for more?{" "}
              <Link href="/faq" className="text-primary font-semibold hover:underline">
                Browse the full FAQ
              </Link>
            </p>
          </div>

          <div className="w-full lg:w-3/5 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(index)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm md:text-base font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

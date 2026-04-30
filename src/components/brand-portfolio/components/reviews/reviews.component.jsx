"use client";

import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { ChevronDown, Star } from "lucide-react";
import useBrandReviews from "./use-brand-reviews.hook";
import { Loader2 } from "lucide-react";

function Reviews() {
  const { setReviewSort, options, sortedReviews, isLoading } = useBrandReviews();

  return (
    <section className="rounded-2xl bg-white p-3 shadow-md sm:p-6 md:p-8">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 md:flex-row md:items-center md:gap-4">
        <h3 className="text-sm font-semibold text-gray-800 sm:text-lg md:text-xl">Reviews from Creators</h3>

        <div className="relative w-full md:w-64">
          <SimpleSelect
            placeHolder="Select an option"
            options={options}
            onChange={({ value }) => setReviewSort(value)}
          />
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : sortedReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 overflow-hidden sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl bg-gray-50 p-3 shadow transition duration-200 hover:shadow-lg sm:p-5"
            >
              <div className="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
                <img
                  src={review.logo}
                  alt={review.creator}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-800 sm:text-sm">{review.creator}</p>
                  <p className="text-[10px] text-gray-500 sm:text-xs">{review.date}</p>
                </div>
              </div>

              <p className="mb-2 line-clamp-3 text-[10px] text-gray-700 sm:text-xs">{review.text}</p>

              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center sm:p-10">
          <h4 className="mb-2 text-sm font-semibold text-gray-800 sm:text-lg">No reviews yet</h4>
          <p className="text-xs text-gray-500 sm:text-sm">
            Reviews from creators will appear here once they complete campaigns and submit feedback.
          </p>
        </div>
      )}
    </section>
  );
}

export default Reviews;

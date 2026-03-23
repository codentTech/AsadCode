"use client";

import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { ChevronDown, Star } from "lucide-react";
import useBrandReviews from "./use-brand-reviews.hook";
import { Loader2 } from "lucide-react";

function Reviews() {
  const { setReviewSort, options, sortedReviews, isLoading } = useBrandReviews();

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Reviews from Creators</h3>

        <div className="relative w-full md:w-64">
          <SimpleSelect
            placeHolder="Select an option"
            options={options}
            onChange={({ value }) => setReviewSort(value)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : sortedReviews.length > 0 ? (
        /* Grid of Reviews */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition duration-200"
            >
              {/* Creator Header */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={review.logo}
                  alt={review.creator}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{review.creator}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-gray-700 mb-2 line-clamp-3">{review.text}</p>

              {/* Rating */}
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
        /* Empty State */
        <div className="border border-dashed border-gray-200 rounded-lg p-10 text-center bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">No reviews yet</h4>
          <p className="text-sm text-gray-500">
            Reviews from creators will appear here once they complete campaigns and submit feedback.
          </p>
        </div>
      )}
    </section>
  );
}

export default Reviews;

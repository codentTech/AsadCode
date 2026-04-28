import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { ChevronDown, Star } from "lucide-react";
import useReviews from "./use-reviews.hook";

function Reviews({ creatorId = null }) {
  const { setReviewSort, options, sortedReviews, isLoading, isError } = useReviews(creatorId);

  return (
    <section className="rounded-2xl bg-white p-3 shadow-md sm:p-6 md:p-8">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 md:flex-row md:items-center md:gap-4">
        <h3 className="text-sm font-semibold text-primary sm:text-lg md:text-xl">Reviews from Brands</h3>

        {sortedReviews.length > 0 && (
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
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-5 rounded-xl animate-pulse h-40" />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <p className="py-8 text-center text-xs text-gray-500 sm:text-sm">
          Unable to load reviews. Please try again later.
        </p>
      )}

      {/* Empty */}
      {!isLoading && !isError && sortedReviews.length === 0 && (
        <p className="py-8 text-center text-xs text-gray-500 sm:text-sm">
          No reviews from brands yet. Complete campaigns and get feedback from brands here.
        </p>
      )}

      {/* Grid of Reviews */}
      {!isLoading && !isError && sortedReviews.length > 0 && (
        <div className="grid grid-cols-1 gap-3 overflow-hidden sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl bg-gray-50 p-3 shadow transition duration-200 hover:shadow-lg sm:p-5"
            >
              {/* Brand Header */}
              <div className="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
                <img
                  src={review.logo}
                  alt={review.brand}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-800 sm:text-sm">{review.brand}</p>
                  <p className="text-[10px] text-gray-500 sm:text-xs">{review.date}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="mb-2 text-[10px] text-gray-700 sm:text-xs">{review.text}</p>

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
      )}
    </section>
  );
}

export default Reviews;

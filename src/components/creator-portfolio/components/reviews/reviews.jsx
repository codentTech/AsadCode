import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { ChevronDown, Star } from "lucide-react";
import useReviews from "./use-reviews";

function Reviews() {
  const { setReviewSort, options, sortedReviews } = useReviews();
  return (
    <section className="bg-white rounded-2xl shadow-md p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Reviews from Brands
        </h3>

        <div className="relative w-full md:w-64">
          <SimpleSelect
            placeHolder="Select an option"
            options={options}
            onChange={({ value }) => setReviewSort(value)}
          />
          {/* <select
            value={reviewSort}
            onChange={(e) => setReviewSort(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select> */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition duration-200"
          >
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={review.logo}
                alt={review.brand}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="font-semibold text-gray-800">{review.brand}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-xs text-gray-700 mb-2">{review.text}</p>

            {/* Rating */}
            <div className="flex gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? "fill-current text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reviews;

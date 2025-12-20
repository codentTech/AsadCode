import Loading from "@/common/components/loadar/loading.component";
import { formatDate } from "@/common/utils/formate-date";
import { Star } from "lucide-react";
import useCreatorCollaborationHistory from "./use-creator-collaboration-history.hook";

const CollaborationHistory = ({ creatorProfileId }) => {
  const { history, isLoading, isError } = useCreatorCollaborationHistory(creatorProfileId);

  return (
    <div className="w-full border rounded-lg p-3 border-gray-200">
      <div className="bg-white mb-4">
        <h3 className="text-sm font-bold text-gray-800 mb-2">Collaboration History</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loading />
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-xs text-gray-500">Failed to load collaboration history</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-gray-500">No collaboration history available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.campaignId}
              className="rounded-lg p-3 bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {item.brand?.logo ? (
                  <img
                    src={item.brand.logo}
                    alt={item.brand.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-600">
                      {item.brand?.name?.charAt(0)?.toUpperCase() || "B"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">
                        {item.brand?.name || "Unknown Brand"}
                      </h4>
                      <p className="text-xs text-gray-700 mt-0.5 truncate">{item.campaignName}</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Completed: {item.completionDate ? formatDate(item.completionDate) : "N/A"}
                      </p>
                    </div>
                  </div>
                  {item.brandReview && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < item.brandReview.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-700">{item.brandReview.review}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborationHistory;

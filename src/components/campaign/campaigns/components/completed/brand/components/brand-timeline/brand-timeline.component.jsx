import { CheckCircle } from "lucide-react";
import React from "react";
import useBrandTimeline from "./use-brand-timeline.hook";
import Loading from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";

const BrandTimelineSteps = ({ campaignId, creatorId }) => {
  const { timelineSteps, timelineLoading, formatDate } = useBrandTimeline(campaignId, creatorId);

  if (timelineLoading) {
    return <Loading />;
  }

  if (!timelineSteps || timelineSteps.length === 0) {
    return <NotFound message="No timeline steps found" />;
  }

  return (
    <div className="space-y-2">
      {timelineSteps.map((step) => (
        <div key={step.id} className="relative p-2 rounded border border-gray-200 bg-white">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900">
                Step {step.step_number}: {step.title}
              </h4>
              <p className="text-xs text-gray-600">{step.description}</p>
              {step.completed_at && (
                <div className="text-xs text-gray-500 mt-1">
                  Completed: {formatDate(step.completed_at)}
                </div>
              )}
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandTimelineSteps;

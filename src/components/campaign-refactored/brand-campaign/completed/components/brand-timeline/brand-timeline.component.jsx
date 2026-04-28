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
        <div key={step.id} className="relative rounded border border-gray-200 bg-white p-2 sm:p-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600 sm:h-5 sm:w-5" />
            <div className="min-w-0 flex-1 text-left">
              <h4 className="text-xs font-bold text-gray-900 sm:text-sm">
                Step {step.step_number}: {step.title}
              </h4>
              <p className="text-[11px] leading-snug text-gray-600 sm:text-xs">{step.description}</p>
              {step.completed_at && (
                <div className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                  Completed: {formatDate(step.completed_at)}
                </div>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center self-start rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800 sm:px-2.5 sm:text-xs">
              Completed
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandTimelineSteps;

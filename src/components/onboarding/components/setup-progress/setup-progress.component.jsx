import { Check, Gauge } from "lucide-react";

const SetupProgress = ({ steps = [], percent, compact = false }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-3.5">
    <div className="flex items-start gap-2">
      <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-black">Setup Progress</p>
          {typeof percent === "number" ? (
            <span className="text-[10px] font-semibold tabular-nums text-primary">{percent}%</span>
          ) : null}
        </div>
        {typeof percent === "number" ? (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        ) : null}
        {compact ? null : (
          <div className="mt-2 space-y-1.5">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-[11px] text-gray-600">{step.label}</span>
                {step.status === "complete" ? (
                  <span className="inline-flex shrink-0 items-center text-[10px] font-medium text-primary">
                    <Check className="mr-0.5 h-3 w-3" />
                    Done
                  </span>
                ) : step.status === "pending" ? (
                  <span className="shrink-0 text-[10px] text-gray-400">Pending</span>
                ) : (
                  <span className="shrink-0 text-[10px] font-medium text-primary">
                    {step.count} selected
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SetupProgress;

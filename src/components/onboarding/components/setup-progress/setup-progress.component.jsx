import React from "react";
import { Check, CheckCircle } from "lucide-react";

const SetupProgress = ({ steps, percent }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h4 className="font-semibold text-gray-900 mb-3">Setup Progress</h4>
    {typeof percent === "number" && (
      <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
        <div
          className="bg-primary h-1 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    )}
    <div className="space-y-2 text-sm">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{step.label}</span>
          {step.status === "complete" ? (
            <span className="text-primary text-xs flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Complete
            </span>
          ) : step.status === "pending" ? (
            <span className="text-gray-400 text-xs">Pending</span>
          ) : (
            <span className="text-primary">{step.count} selected</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default SetupProgress;

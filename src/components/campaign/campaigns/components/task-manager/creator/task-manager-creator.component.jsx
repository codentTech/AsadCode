import CustomButton from "@/common/components/custom-button/custom-button.component";
import useCreatorTaskManager from "./use-creator-task-manager.hook";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

const TaskManagerCreator = ({ setSelectedCampaign, getCampaignById, formatCampaignData }) => {
  const {
    // State
    tasks,
    getCreatorTasksState,
    isInitialLoad,

    // Actions
    handleTaskAction,
    getActionText,
    formatName,
    getPriority,
  } = useCreatorTaskManager(setSelectedCampaign, getCampaignById, formatCampaignData);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Upcoming Tasks</h3>
        <p className="text-xs text-gray-500 mt-0.5">Actions needed across all collaborations</p>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isInitialLoad && getCreatorTasksState.isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm font-medium">
              You're all caught up. No actions needed right now.
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const priority = getPriority(task);
            const isOverdue = priority === "overdue";
            const isDueSoon = priority === "due-soon";

            return (
              <div
                key={task.id}
                className={`bg-gray-50 border rounded-lg p-3 hover:shadow-sm transition-all ${
                  isOverdue
                    ? "border-red-300 bg-red-50/30"
                    : isDueSoon
                      ? "border-orange-300 bg-orange-50/30"
                      : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Priority Indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isOverdue ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : isDueSoon ? (
                      <Clock className="w-4 h-4 text-orange-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{formatName(task)}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-primary truncate">
                        {task.campaign?.campaign_title || "Unknown Campaign"}
                      </span>
                      {task.due_date && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span
                            className={`text-xs flex-shrink-0 ${
                              isOverdue
                                ? "text-red-600 font-medium"
                                : isDueSoon
                                  ? "text-orange-600"
                                  : "text-gray-500"
                            }`}
                          >
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end mt-2">
                      <CustomButton
                        text={getActionText(task)}
                        onClick={() => handleTaskAction(task)}
                        disabled={getCreatorTasksState.isLoading}
                        className="btn-primary text-xs px-3 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskManagerCreator;

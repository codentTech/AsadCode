import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import useBrandTaskManager from "./use-brand-task-manager.hook";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/common/utils/date.utils";

const TaskManagerBrandModal = ({
  show,
  onClose,
  selectedCampaignId = null,
  isMultiCreator = true,
}) => {
  const {
    selectedCampaign,
    selectedCampaignValue,
    tasks,
    campaignOptions,
    getBrandTasksState,
    handleCampaignSelect,
    handleTaskAction,
    getActionText,
    formatName,
    getPriority,
  } = useBrandTaskManager(show, selectedCampaignId, onClose);

  return (
    <Modal show={show} title="Task Manager" onClose={onClose} size="lg" height="fixed">
      <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-3">
        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-base font-bold text-gray-900 sm:text-lg">Pending Tasks</h3>
            <div className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
              {tasks.length}
            </div>
          </div>
          {isMultiCreator && (
            <div className="w-full min-w-0 sm:max-w-[280px] sm:shrink-0">
              <SimpleSelect
                placeHolder="All Campaigns"
                options={campaignOptions}
                value={selectedCampaignValue}
                onChange={handleCampaignSelect}
              />
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-0.5 lg:max-h-96">
          {getBrandTasksState.isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Loading tasks...</p>
            </div>
          ) : getBrandTasksState.isError ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm font-medium">
                {getBrandTasksState.message || "Failed to load tasks"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Please try again later.</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm font-medium">
                No action needed. You're all caught up.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedCampaign === "all"
                  ? "All tasks are complete across all campaigns."
                  : "No tasks for this campaign."}
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
                  className={`rounded-lg border bg-white p-2.5 transition-all hover:shadow-sm sm:p-3 ${
                    isOverdue
                      ? "border-red-300 bg-red-50/30"
                      : isDueSoon
                        ? "border-orange-300 bg-orange-50/30"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isOverdue ? (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        ) : isDueSoon ? (
                          <Clock className="w-4 h-4 text-orange-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{formatName(task)}</h4>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs font-medium text-primary truncate">
                            {task.campaign?.campaign_title || "Unknown Campaign"}
                          </span>
                          {task.creator && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-600 truncate">
                                {task.creator.first_name && task.creator.last_name
                                  ? `${task.creator.first_name} ${task.creator.last_name}`
                                  : task.creator.email || "Creator"}
                              </span>
                            </>
                          )}
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
                                {formatDate(task.due_date)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full shrink-0 sm:w-auto sm:self-center">
                      <CustomButton
                        text={getActionText(task)}
                        onClick={() => handleTaskAction(task)}
                        disabled={getBrandTasksState.isLoading}
                        className="btn-primary w-full sm:w-auto"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-3 shrink-0 border-t border-gray-200 pt-2 sm:mt-4 sm:pt-3">
          <p className="text-[11px] leading-snug text-gray-500 sm:text-xs">
            Tasks are automatically generated and removed when actions are completed.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default TaskManagerBrandModal;

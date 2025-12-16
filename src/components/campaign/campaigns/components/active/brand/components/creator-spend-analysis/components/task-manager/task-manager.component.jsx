import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import { AddCircle } from "@mui/icons-material";
import useTaskManager from "./use-task-manager.hook";
import { TASK_STATUS } from "@/common/constants/campaign.constant";

const TaskManagerModal = ({
  show,
  onClose,
  selectedCampaign: propSelectedCampaign,
  isMultiCreator = true,
}) => {
  const {
    // State
    selectedCampaign,
    showAddTask,
    newTaskText,
    filteredTasks,
    campaignOptions,
    campaignLookup,

    // Redux states
    createTaskState,
    updateTaskState,
    getAllTasksState,

    // Actions
    handleTaskAction,
    addCustomTask,
    handleCampaignSelect,
    handleNewTaskTextChange,
    toggleAddTask,
    cancelAddTask,
  } = useTaskManager(show, propSelectedCampaign, isMultiCreator);

  return (
    <Modal show={show} title="Task Manager" onClose={onClose} size="lg">
      <div className="p-1">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">Pending Tasks</h3>
            <div className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
              {filteredTasks.length}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMultiCreator && (
              <div className="w-full min-w-[230px]">
                <SimpleSelect
                  placeHolder="All Campaigns"
                  options={campaignOptions}
                  value={selectedCampaign}
                  onChange={handleCampaignSelect}
                />
              </div>
            )}

            <button className="bg-gray-200 p-2 rounded-full" onClick={toggleAddTask}>
              <AddCircle className="text-primary" />
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-2">
              {/* Error Message */}
              {createTaskState.isError && createTaskState.message && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {createTaskState.message}
                </div>
              )}

              <CustomInput
                placeholder="What needs to be done?"
                value={newTaskText}
                onChange={handleNewTaskTextChange}
                className="!bg-white"
              />
              <div className="flex justify-end gap-2">
                <CustomButton
                  text="Add Task"
                  onClick={addCustomTask}
                  disabled={
                    !newTaskText.trim() ||
                    (isMultiCreator && selectedCampaign === "all") ||
                    (!isMultiCreator && !propSelectedCampaign?.id) ||
                    createTaskState.isLoading
                  }
                  className="btn-primary text-sm px-3 py-1"
                />
                <CustomButton
                  text="Cancel"
                  onClick={cancelAddTask}
                  className="btn-outline text-sm px-3 py-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Compact Task List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {getAllTasksState.isLoading ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No pending tasks</p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedCampaign === "all"
                  ? "All caught up! Create new tasks to get started."
                  : "No tasks for this campaign."}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all hover:border-gray-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {task.task_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-primary truncate">
                          {task.campaign?.campaign_title ||
                            campaignLookup[task.campaign?.id] ||
                            "Unknown Campaign"}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                            task.status === TASK_STATUS.REVIEW
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {task.status === TASK_STATUS.REVIEW ? (
                      <CustomButton
                        text="Mark Complete"
                        onClick={() => handleTaskAction(task)}
                        disabled={updateTaskState.isLoading}
                        className="btn-primary"
                      />
                    ) : (
                      <CustomButton text="Completed" disabled className="btn-outline" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">Once you complete the task, the task is removed.</p>
        </div>
      </div>
    </Modal>
  );
};

export default TaskManagerModal;

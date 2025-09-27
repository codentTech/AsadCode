import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import {
  createTask,
  getAllTasks,
  updateTask,
} from "@/provider/features/campaign-tasks/campaign-tasks.slice";
import { getAllCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import { AddCircle } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TaskManagerModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const {
    tasks,
    createTask: createTaskState,
    updateTask: updateTaskState,
    deleteTask: deleteTaskState,
    getAllTasks: getAllTasksState,
  } = useSelector((state) => state.campaignTasks);
  const { campaigns = [] } = useSelector((state) => state.campaigns);

  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCampaign, setNewTaskCampaign] = useState("");

  // Load data when modal opens
  useEffect(() => {
    if (show) {
      dispatch(getAllTasks());
      dispatch(getAllCampaigns());
    }
  }, [show, dispatch]);

  // Transform campaigns for dropdown
  const campaignOptions = [
    { label: "All Campaigns", value: "all" },
    ...(campaigns || []).map((campaign) => ({
      label: campaign.campaign_title,
      value: campaign.id,
    })),
  ];

  // Filter tasks based on selected campaign
  const filteredTasks = tasks.filter(
    (task) => selectedCampaign === "all" || task.campaign_id === selectedCampaign
  );

  // Handle task action - mark as complete
  const handleTaskAction = async (task) => {
    await dispatch(
      updateTask({
        taskId: task.id,
        updateData: { status: "complete" },
      })
    ).unwrap();
  };

  // Add custom task
  const addCustomTask = async () => {
    if (newTaskText.trim() && newTaskCampaign) {
      await dispatch(
        createTask({
          task_name: newTaskText,
          campaign_id: newTaskCampaign,
        })
      ).unwrap();

      setNewTaskText("");
      setNewTaskCampaign("");
      setShowAddTask(false);
    }
  };

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
            <div className="w-full min-w-[230px]">
              <SimpleSelect
                placeHolder="All Campaigns"
                options={campaignOptions}
                value={selectedCampaign}
                onChange={({ value }) => setSelectedCampaign(value)}
              />
            </div>

            <button className="bg-gray-200 p-2 rounded-full" onClick={() => setShowAddTask(true)}>
              <AddCircle className="text-primary" />
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between gap-6">
                <CustomInput
                  placeholder="What needs to be done?"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="!bg-white"
                />
                <SimpleSelect
                  placeHolder="Select Campaign"
                  options={campaignOptions.filter((c) => c.value !== "all")}
                  value={newTaskCampaign}
                  onChange={({ value }) => setNewTaskCampaign(value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <CustomButton
                  text="Add Task"
                  onClick={addCustomTask}
                  disabled={!newTaskText.trim() || !newTaskCampaign || createTaskState.isLoading}
                  className="btn-primary text-sm px-3 py-1"
                />
                <CustomButton
                  text="Cancel"
                  onClick={() => {
                    setShowAddTask(false);
                    setNewTaskText("");
                    setNewTaskCampaign("");
                  }}
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
                          {task.campaign?.campaign_title || "Unknown Campaign"}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                            task.status === "review"
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
                    {task.status === "review" ? (
                      <CustomButton
                        text="Mark Complete"
                        onClick={() => handleTaskAction(task)}
                        disabled={updateTaskState.isLoading}
                        className="btn-primary text-xs px-3 py-1"
                      />
                    ) : (
                      <CustomButton
                        text="Completed"
                        disabled
                        className="btn-outline text-xs px-3 py-1 bg-green-50 text-green-700 border-green-200"
                      />
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

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import {
  Bold,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Italic,
  List,
  ListOrdered,
  Paperclip,
  Plus,
  Redo,
  Square,
  Underline,
  Undo,
  Trash2,
  Pencil,
} from "lucide-react";
import { useState, useRef } from "react";
import useContentPlanning from "./use-content-planning.hook";
import useMonthlyGoals from "./use-monthly-goals.hook";
import CalendarModal from "../../../calendar-modal/calendar-modal.component";

const upcomingTasks = [
  {
    campaign: "BeautyPlus New Eyeliner Campaign",
    task: "Sign Agreement",
    date: "Feb 12, 2025",
    status: "pending",
    type: "agreement",
  },
  {
    campaign: "New Season, New Shades",
    task: "Feed Post",
    date: "Feb 25, 2025",
    status: "in-progress",
    type: "content",
    submitBy: "Feb 20, 2025",
  },
  {
    campaign: "Espresso+ Campaign",
    task: "Feed Post (Revision Requested)",
    date: "Feb 22, 2025",
    status: "pending",
    type: "content",
    submitBy: "Feb 18, 2025",
  },
];

const ContentPlanning = ({ selectedCampaign }) => {
  // Use the custom hook for content planner functionality
  const {
    showContentPlanner,
    showCalendar,
    showGoals,
    activePlannerTab,
    plannerContent,
    contentPlanners,
    showAddTitle,
    newTitle,
    selectedPlanner,
    getAllContentPlannersState,
    createContentPlannerState,
    updateContentPlannerState,
    deleteContentPlannerState,
    setActivePlannerTab,
    handleContentChange,
    handleContentChangeAndSave,
    handleAutoSave,
    openContentPlanner,
    closeContentPlanner,
    openCalendar,
    closeCalendar,
    openGoals,
    closeGoals,
    handleAddTitle,
    handleSaveTitle,
    handleCancelAddTitle,
    handleSelectPlanner,
    handleNewTitleChange,
    handleDeletePlanner,
    handleEditTitle,
    handleUpdateTitle,
  } = useContentPlanning(selectedCampaign);

  // Use monthly goals hook
  const {
    goalMonth,
    goalsByWeek,
    campaignGoals,
    createMonthlyGoalState,
    updateMonthlyGoalState,
    deleteMonthlyGoalState,
    navigateGoalMonth,
    addGoal,
    toggleGoalCompletion,
    updateGoalTitle,
    deleteGoal,
  } = useMonthlyGoals(selectedCampaign);

  // Local state for other functionality
  const [selectedDate, setSelectedDate] = useState(25);
  const [currentMonth, setCurrentMonth] = useState({ month: 6, year: 2025 });
  const [addingGoalToWeek, setAddingGoalToWeek] = useState(null);
  const [newGoalTitle, setNewGoalTitle] = useState("");

  // Calendar data structure for tasks
  const [calendarTasks, setCalendarTasks] = useState({
    15: [
      {
        id: 1,
        text: "Draft skincare video script",
        completed: false,
        tag: { label: "Campaign Deadline", value: "bg-red-100 text-red-800" },
      },
      {
        id: 2,
        text: "Research trending skincare topics",
        completed: true,
        tag: { label: "Research", value: "bg-yellow-100 text-yellow-800" },
      },
    ],
    18: [
      {
        id: 3,
        text: "Film fitness equipment review",
        completed: false,
        tag: { label: "Campaign Deadline", value: "bg-red-100 text-red-800" },
      },
      {
        id: 4,
        text: "Edit previous video",
        completed: false,
        tag: { label: "Post Production", value: "bg-purple-100 text-purple-800" },
      },
    ],
    22: [
      {
        id: 5,
        text: "Unbox tech gadgets",
        completed: false,
        tag: { label: "Campaign Deadline", value: "bg-red-100 text-red-800" },
      },
      {
        id: 6,
        text: "Prepare lighting setup",
        completed: true,
        tag: { label: "Preparation", value: "bg-orange-100 text-orange-800" },
      },
    ],
    25: [
      {
        id: 7,
        text: "Record fashion haul intro",
        completed: false,
        tag: { label: "Record clips for Loreal", value: "bg-blue-100 text-blue-800" },
      },
      {
        id: 8,
        text: "Style outfits for shoot",
        completed: false,
        tag: { label: "Preparation", value: "bg-orange-100 text-orange-800" },
      },
      {
        id: 9,
        text: "Upload to social platforms",
        completed: true,
        tag: { label: "Distribution", value: "bg-teal-100 text-teal-800" },
      },
    ],
  });

  // Color tags for calendar
  const [colorTags, setColorTags] = useState([
    { label: "Campaign Deadline", value: "bg-red-100 text-red-800" },
    { label: "Record clips for Loreal", value: "bg-blue-100 text-blue-800" },
    { label: "Content Creation", value: "bg-green-100 text-green-800" },
    { label: "Post Production", value: "bg-purple-100 text-purple-800" },
    { label: "Research", value: "bg-yellow-100 text-yellow-800" },
    { label: "Preparation", value: "bg-orange-100 text-orange-800" },
    { label: "Distribution", value: "bg-teal-100 text-teal-800" },
  ]);

  const [newTaskText, setNewTaskText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("bg-gray-100 text-gray-800");

  const plannerTabs = ["Hook Ideas", "Script", "Shot Ideas", "General Notes"];
  const editorRef = useRef(null);
  const idCounter = useRef(0);
  const getNextId = () => ++idCounter.current;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const colorOptions = [
    "bg-red-100 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-yellow-100 text-yellow-800",
    "bg-orange-100 text-orange-800",
    "bg-teal-100 text-teal-800",
    "bg-pink-100 text-pink-800",
  ];

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: getNextId(),
        text: newTaskText,
        completed: false,
        tag: selectedTag,
      };

      setCalendarTasks((prev) => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newTask],
      }));

      setNewTaskText("");
    }
  };

  const toggleTask = (taskId) => {
    setCalendarTasks((prev) => ({
      ...prev,
      [selectedDate]:
        prev[selectedDate]?.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ) || [],
    }));
  };

  const addColorTag = () => {
    if (newTagName.trim()) {
      setColorTags((prev) => [...prev, { label: newTagName, value: newTagColor }]);
      setNewTagName("");
      setShowAddTag(false);
    }
  };

  const getTagColor = (tagName) => {
    const tag = colorTags.find((t) => t.label === tagName);
    return tag ? tag.value : "bg-gray-100 text-gray-800";
  };

  const handleCampaignClick = (campaign) => {
    // Navigate to campaign page
  };

  // Handle adding new goal
  const handleAddGoalClick = (weekNumber) => {
    setAddingGoalToWeek(weekNumber);
    setNewGoalTitle("");
  };

  const handleAddGoalSubmit = async () => {
    if (!newGoalTitle.trim()) return;

    const goalData = {
      title: newGoalTitle.trim(),
      completed: false,
      week_number: addingGoalToWeek,
      month: goalMonth.month,
      year: goalMonth.year,
    };

    await addGoal(addingGoalToWeek, goalData);
    setAddingGoalToWeek(null);
    setNewGoalTitle("");
  };

  const handleAddGoalCancel = () => {
    setAddingGoalToWeek(null);
    setNewGoalTitle("");
  };

  const handleAddGoalKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddGoalSubmit();
    } else if (e.key === "Escape") {
      handleAddGoalCancel();
    }
  };

  const formatRichText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  const getTaskCTA = (task) => {
    return (
      <CustomButton
        text={task.type === "agreement" ? "Sign Agreement" : "Submit Content"}
        className="btn-outline !h-7"
      />
    );
  };

  // Get dot indicators for calendar dates
  const getDateIndicators = (day) => {
    const tasks = calendarTasks[day] || [];
    const hasDeadline = tasks.some((task) => task.tag.label === "Campaign Deadline");
    const hasDraft = tasks.some((task) => task.tag.label === "1st Draft Deadline");
    const hasOther = tasks.some(
      (task) => !["Campaign Deadline", "1st Draft Deadline"].includes(task.tag.label)
    );

    return { hasDeadline, hasDraft, hasOther };
  };

  return (
    <div className="w-[27%] bg-white border-l border-gray-200">
      <div className="p-4 space-y-3">
        {/* Content Planner */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                Content Planner
              </h2>
              <button
                onClick={openContentPlanner}
                className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-2">
            <div className="space-y-1.5">
              {/* Existing Content Planners */}
              {contentPlanners.map((planner) => (
                <div
                  key={planner.id}
                  className="group px-3 py-2 bg-blue-50 rounded-md text-xs text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-between"
                  onClick={() => handleSelectPlanner(planner)}
                >
                  <span className="flex-1">{planner.title}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTitle(planner);
                      }}
                      className="p-1 hover:bg-blue-200 rounded transition-colors"
                      title="Edit title"
                    >
                      <Pencil size={12} className="text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlanner(planner.id);
                      }}
                      className="p-1 hover:bg-red-200 rounded transition-colors"
                      title="Delete planner"
                    >
                      <Trash2 size={12} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Title Input */}
              {showAddTitle ? (
                <div className="space-y-2">
                  <CustomInput
                    placeholder="Enter content planner title..."
                    value={newTitle}
                    onChange={handleNewTitleChange}
                    className="text-xs"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <CustomButton
                      text={selectedPlanner ? "Update" : "Save"}
                      onClick={selectedPlanner ? handleUpdateTitle : handleSaveTitle}
                      disabled={
                        !newTitle.trim() ||
                        (selectedPlanner
                          ? updateContentPlannerState.isLoading
                          : createContentPlannerState.isLoading)
                      }
                      className="btn-primary text-xs px-3 py-1"
                    />
                    <CustomButton
                      text="Cancel"
                      onClick={handleCancelAddTitle}
                      className="btn-outline text-xs px-3 py-1"
                    />
                  </div>
                </div>
              ) : (
                <button
                  className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-xs text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={handleAddTitle}
                >
                  + Add More
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between space-x-2">
          <CustomButton
            text="Calendar & Tasks"
            className="btn-outline w-full"
            onClick={openCalendar}
          />
          <CustomButton text="Monthly Goals" onClick={openGoals} />
        </div>

        {/* Upcoming Tasks */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 mt-4">
            Upcoming Tasks
          </h3>
          <div className="space-y-2">
            {upcomingTasks.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-2 hover:border-gray-300 hover:shadow-sm transition-all duration-200 bg-white"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.campaign}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Due: {item.date}</span>
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "pending"
                              ? "bg-orange-400"
                              : item.status === "in-progress"
                                ? "bg-blue-400"
                                : "bg-green-400"
                          }`}
                        />
                      </div>
                      {item.submitBy && (
                        <p className="text-xs text-orange-600 mt-1">Submit by {item.submitBy}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      {item.task}
                    </span>
                    {getTaskCTA(item)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Planner Modal */}
      <Modal
        show={showContentPlanner}
        title={selectedPlanner ? selectedPlanner.title : "Content Planner"}
        onClose={closeContentPlanner}
        size="xl"
      >
        <div className="flex h-[600px]">
          <div className="w-48 border-r border-gray-200 pr-4">
            <div className="space-y-2">
              {plannerTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePlannerTab(tab)}
                  className={`w-full p-3 rounded-lg text-sm text-left transition-colors ${
                    activePlannerTab === tab
                      ? "bg-slate-100 text-slate-900 border-l-2 border-slate-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 px-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{activePlannerTab}</h3>

              {/* Rich Text Toolbar */}
              <div className="border border-gray-200 flex items-center gap-2 p-2 rounded-t-lg bg-gray-50">
                <button
                  onClick={() => formatRichText("bold")}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("italic")}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("underline")}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => formatRichText("insertUnorderedList")}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("insertOrderedList")}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => formatRichText("undo")}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("redo")}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Add Image"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              {/* Rich Text Editor */}
              <div
                ref={editorRef}
                contentEditable
                className="border border-gray-200 w-full h-96 p-4 border-t-0 rounded-b-lg focus:outline-none bg-white overflow-y-auto focus:border-slate-300"
                style={{ minHeight: "400px" }}
                dangerouslySetInnerHTML={{ __html: plannerContent[activePlannerTab] }}
                onBlur={(e) => {
                  const content = e.target.innerHTML;
                  handleContentChangeAndSave(activePlannerTab, content);
                }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Auto-saved • Last updated: just now</span>
              <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800">
                <Paperclip className="w-3 h-3" />
                Add Media
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Calendar & To Do List Modal */}
      <CalendarModal
        show={showCalendar}
        onClose={closeCalendar}
        selectedCampaign={selectedCampaign}
      />

      {/* Goals Modal */}
      <Modal show={showGoals} title="Monthly Goals" onClose={closeGoals} size="xl">
        <div className="p-3">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3 bg-gray-100 rounded-md p-2">
            <button
              onClick={() => navigateGoalMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {monthNames[goalMonth.month - 1]} {goalMonth.year}
            </h3>
            <button
              onClick={() => navigateGoalMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekly Goals Grid */}
          <div className="grid grid-cols-2 gap-6">
            {["week1", "week2", "week3", "week4"].map((week, index) => {
              const colors = [
                "bg-orange-50 border-orange-200", // Week 1 - Soft Orange
                "bg-pink-50 border-pink-200", // Week 2 - Soft Pink
                "bg-green-50 border-green-200", // Week 3 - Soft Green
                "bg-blue-50 border-blue-200", // Week 4 - Soft Blue
              ];

              const weekNumber = index + 1;
              const weekGoals = goalsByWeek[week] || [];

              return (
                <div key={week} className={`border rounded-md p-3 ${colors[index]} h-fit`}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800 text-lg">Week {weekNumber}</h4>
                    <button
                      onClick={() => handleAddGoalClick(weekNumber)}
                      disabled={createMonthlyGoalState.isLoading}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4 border border-black rounded-full" />
                      Add more
                    </button>
                  </div>
                  <div className="h-36 overflow-y-auto space-y-1">
                    {weekGoals.map((goal) => (
                      <div key={goal.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => toggleGoalCompletion(goal)}
                          disabled={updateMonthlyGoalState.isLoading}
                          className="w-4 h-4 text-slate-600 rounded flex-shrink-0 disabled:opacity-50"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={goal.title}
                            onChange={(e) => updateGoalTitle(goal, e.target.value)}
                            disabled={updateMonthlyGoalState.isLoading}
                            className={`w-full text-sm bg-transparent border-b ${colors[index]} outline-none pb-1 ${
                              goal.completed ? "line-through text-gray-500" : "text-gray-700"
                            } focus:border-slate-500 transition-colors disabled:opacity-50`}
                            placeholder={`Enter Week ${weekNumber} goal...`}
                          />
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          disabled={deleteMonthlyGoalState.isLoading}
                          className="p-1 hover:bg-red-200 rounded transition-colors disabled:opacity-50"
                          title="Delete goal"
                        >
                          <Trash2 size={12} className="text-red-600" />
                        </button>
                      </div>
                    ))}

                    {/* Add new goal input field */}
                    {addingGoalToWeek === weekNumber && (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          disabled
                          className="w-4 h-4 text-slate-600 rounded flex-shrink-0 opacity-50"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={newGoalTitle}
                            onChange={(e) => setNewGoalTitle(e.target.value)}
                            onKeyDown={handleAddGoalKeyPress}
                            onBlur={() => {
                              // Small delay to allow submit button click to work
                              setTimeout(() => {
                                if (addingGoalToWeek === weekNumber) {
                                  handleAddGoalCancel();
                                }
                              }, 150);
                            }}
                            className={`w-full text-sm bg-transparent border-b ${colors[index]} outline-none pb-1 text-gray-700 focus:border-slate-500 transition-colors`}
                            placeholder={`Enter Week ${weekNumber} goal...`}
                            autoFocus
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentPlanning;

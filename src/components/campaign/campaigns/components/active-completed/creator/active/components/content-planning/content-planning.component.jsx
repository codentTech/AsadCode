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
} from "lucide-react";
import { useRef, useState } from "react";

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

const ContentPlanning = () => {
  const [showContentPlanner, setShowContentPlanner] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [activePlannerTab, setActivePlannerTab] = useState("Hook Ideas");
  const [selectedDate, setSelectedDate] = useState(25);
  const [currentMonth, setCurrentMonth] = useState({ month: 6, year: 2025 });
  const [goalMonth, setGoalMonth] = useState({ month: 6, year: 2025 });

  const [plannerContent, setPlannerContent] = useState({
    "Hook Ideas": "Brainstorm engaging opening lines...",
    Script: "Full video script goes here...",
    "Shot Ideas": "Different angles and shots to capture...",
    "General Notes": "Additional thoughts and reminders...",
  });

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

  // Goals data structure
  const [monthlyGoals, setMonthlyGoals] = useState({
    week1: [
      { id: 1, text: "Post 3 reels on Instagram", completed: false },
      { id: 2, text: "Film 2 YouTube videos", completed: true },
    ],
    week2: [
      { id: 3, text: "Collaborate with 1 creator", completed: false },
      { id: 4, text: "Reach 10k followers", completed: false },
    ],
    week3: [
      { id: 5, text: "Try 5 trending sounds on TikTok", completed: true },
      { id: 6, text: "Optimize video thumbnails", completed: false },
    ],
    week4: [
      { id: 7, text: "Negotiate 2 brand deals", completed: false },
      { id: 8, text: "Increase engagement by 15%", completed: false },
    ],
  });

  const plannerTabs = ["Hook Ideas", "Script", "Shot Ideas", "General Notes"];
  const editorRef = useRef(null);

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
        id: Date.now(),
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

  const navigateGoalMonth = (direction) => {
    setGoalMonth((prev) => {
      const newMonth = direction === "next" ? prev.month + 1 : prev.month - 1;
      if (newMonth > 12) return { month: 1, year: prev.year + 1 };
      if (newMonth < 1) return { month: 12, year: prev.year - 1 };
      return { ...prev, month: newMonth };
    });
  };

  const addGoal = (week) => {
    const newGoal = {
      id: Date.now(),
      text: "",
      completed: false,
    };

    setMonthlyGoals((prev) => ({
      ...prev,
      [week]: [...prev[week], newGoal],
    }));
  };

  const handleCampaignClick = (campaign) => {
    // Navigate to campaign page
    console.log("Navigate to campaign:", campaign);
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
                onClick={() => setShowContentPlanner(true)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-2">
            <div className="space-y-1.5">
              {plannerTabs.map((tab) => (
                <div
                  key={tab}
                  className="px-3 py-2 bg-gray-50 rounded-md text-xs text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100"
                  onClick={() => setShowContentPlanner(true)}
                >
                  {tab}
                </div>
              ))}
              <button
                className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-xs text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setShowContentPlanner(true)}
              >
                + Add More
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between space-x-2">
          <CustomButton
            text="Calendar & Tasks"
            className="btn-outline w-full"
            onClick={() => setShowCalendar(true)}
          />
          <CustomButton text="Monthly Goals" onClick={() => setShowGoals(true)} />
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
        title="Content Planner"
        onClose={() => setShowContentPlanner(false)}
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
                onBlur={(e) =>
                  setPlannerContent({
                    ...plannerContent,
                    [activePlannerTab]: e.target.innerHTML,
                  })
                }
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
      {/* Calendar & To Do List Modal */}
      <Modal
        show={showCalendar}
        title="Calendar & To Do List"
        onClose={() => setShowCalendar(false)}
        size="xl"
      >
        <div className="grid grid-cols-5 gap-4 p-1">
          {/* Calendar (60%) */}
          <div className="col-span-3">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                {monthNames[currentMonth.month - 1]} {currentMonth.year}
              </h3>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-xs font-semibold text-gray-500 text-left">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const isSelected = selectedDate === day;
                  const hasAnyTask = calendarTasks[day] && calendarTasks[day].length > 0;

                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`relative h-8 w-8 flex items-center justify-center text-xs font-medium cursor-pointer rounded-full transition-all ${
                        isSelected
                          ? "bg-primary text-white shadow-md scale-105"
                          : hasAnyTask
                            ? "bg-white shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300"
                            : "hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      {day}

                      {/* Task indicator dot */}
                      {calendarTasks[day] && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compact Legend */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  {colorTags.slice(0, 3).map((tag) => (
                    <div key={tag.label} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${tag.value.split(" ")[0]}`}></div>
                      <span className="text-gray-600">{tag.label}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {!showAddTag && (
                    <button
                      onClick={() => setShowAddTag(true)}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      Add category
                    </button>
                  )}
                </div>
              </div>

              {showAddTag && (
                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="space-y-2">
                    <CustomInput
                      type="text"
                      placeholder="Category name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                    />
                    <div className="flex gap-1">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewTagColor(color)}
                          className={`w-5 h-5 rounded-full ${color.split(" ")[0]} ${
                            newTagColor === color ? "ring-1 ring-gray-400" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addColorTag}
                        className="px-3 py-1 bg-primary text-white text-xs rounded font-medium hover:bg-gray-800"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddTag(false)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Task List (40%) */}
          <div className="col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg h-full">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">
                  {monthNames[currentMonth.month - 1]} {selectedDate}, {currentMonth.year}
                </h3>
                <p className="text-xs text-gray-500">
                  {(calendarTasks[selectedDate] || []).length} tasks scheduled
                </p>
              </div>

              {/* Tasks */}
              <div className="p-3 max-h-64 overflow-y-auto space-y-2">
                {(calendarTasks[selectedDate] || []).length === 0 ? (
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">No tasks for this day</p>
                  </div>
                ) : (
                  (calendarTasks[selectedDate] || []).map((task) => (
                    <div
                      key={task.id}
                      className={`group rounded-lg border transition-all ${
                        task.completed
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="p-2">
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="mt-0.5 hover:scale-110 transition-transform"
                          >
                            {task.completed ? (
                              <CheckSquare className="w-4 h-4 text-green-500" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>

                          <div className="flex-1">
                            <p
                              className={`text-xs font-medium leading-relaxed ${
                                task.completed ? "line-through text-gray-500" : "text-gray-700"
                              }`}
                            >
                              {task.text}
                            </p>

                            <div className="flex items-center justify-between mt-1">
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded ${getTagColor(task.tag.label)}`}
                              >
                                {task.tag.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Task */}
              <div className="p-3 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1 text-sm">
                  Add Task
                </h4>

                <div className="space-y-2">
                  <CustomInput
                    type="text"
                    placeholder="Add a new task"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                  />

                  <SimpleSelect
                    placeHolder="Select an option"
                    options={colorTags}
                    onChange={(value) => setSelectedTag(value)}
                  />

                  <CustomButton text="Add Task" onClick={addTask} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Goals Modal */}
      <Modal show={showGoals} title="Monthly Goals" onClose={() => setShowGoals(false)} size="xl">
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

              return (
                <div key={week} className={`border rounded-md p-3 ${colors[index]} h-fit`}>
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">Week {index + 1}</h4>
                  <div className="space-y-1">
                    {monthlyGoals[week]?.map((goal) => (
                      <div key={goal.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => {
                            setMonthlyGoals((prev) => ({
                              ...prev,
                              [week]: prev[week].map((g) =>
                                g.id === goal.id ? { ...g, completed: !g.completed } : g
                              ),
                            }));
                          }}
                          className="w-4 h-4 text-slate-600 rounded flex-shrink-0"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={goal.text}
                            onChange={(e) => {
                              setMonthlyGoals((prev) => ({
                                ...prev,
                                [week]: prev[week].map((g) =>
                                  g.id === goal.id ? { ...g, text: e.target.value } : g
                                ),
                              }));
                            }}
                            className={`w-full text-sm bg-transparent border-b ${colors[index]} outline-none pb-1 ${
                              goal.completed ? "line-through text-gray-500" : "text-gray-700"
                            } focus:border-slate-500 transition-colors`}
                            placeholder="Enter goal..."
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addGoal(week)}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mt-4 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add more
                    </button>
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

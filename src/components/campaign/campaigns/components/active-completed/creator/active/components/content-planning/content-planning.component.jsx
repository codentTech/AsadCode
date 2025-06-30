import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import {
  Calendar,
  Edit3,
  Plus,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
  Target,
  CheckSquare,
  Square,
} from "lucide-react";
import { useState, useRef } from "react";

const upcomingTasks = [
  {
    campaign: "Summer Skincare Collection",
    task: "Sign contract",
    date: "Jun 15",
    status: "pending",
  },
  {
    campaign: "Fitness Equipment Review",
    task: "Submit content",
    date: "Jun 18",
    status: "in-progress",
  },
  {
    campaign: "Tech Gadget Unboxing",
    task: "Submit payment info",
    date: "Jun 22",
    status: "pending",
  },
  {
    campaign: "Fashion Haul Video",
    task: "Final review",
    date: "Jun 25",
    status: "pending",
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

  return (
    <div className="w-[27%] space-y-4">
      {/* Content Planner */}
      <div className="bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Content Planner</h2>
            <button
              onClick={() => setShowContentPlanner(true)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {plannerTabs.map((tab) => (
              <div
                key={tab}
                className="p-2 bg-gray-100 rounded text-xs text-gray-600 cursor-pointer hover:bg-blue-50"
                onClick={() => setShowContentPlanner(true)}
              >
                {tab}
              </div>
            ))}
            <CustomButton
              text="+ Add More"
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-gray-400 hover:text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Calendar & To Do List Button */}
      <div className="mx-4">
        <CustomButton text="Calendar & To Do List" onClick={() => setShowCalendar(true)} />
      </div>

      {/* Goals Button */}
      <div className="mx-4">
        <CustomButton text="Goals" onClick={() => setShowGoals(true)} />
      </div>

      {/* Upcoming Tasks */}
      <div className="mx-4">
        <h3 className="text-lg font-semibold text-gray-800 pb-2">Upcoming Tasks</h3>
        <div className="space-y-3">
          {upcomingTasks.map((item, index) => (
            <div
              key={index}
              className="rounded-lg p-2 bg-gray-100 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 group cursor-pointer"
              onClick={() => handleCampaignClick(item.campaign)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    item.status === "pending"
                      ? "bg-red-500"
                      : item.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 group-hover:text-indigo-900">
                    {item.task}
                  </p>
                  <p className="text-xs text-gray-500">{item.campaign}</p>
                </div>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Content Planner Modal */}
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
                  className={`w-full p-3 rounded text-sm text-left transition-colors ${
                    activePlannerTab === tab
                      ? "bg-indigo-100 text-indigo-700 border-l-2 border-indigo-500"
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
              <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-t-lg bg-gray-50">
                <button
                  onClick={() => formatRichText("bold")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("italic")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("underline")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => formatRichText("insertUnorderedList")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("insertOrderedList")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => formatRichText("undo")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("redo")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button className="p-1 hover:bg-gray-200 rounded" title="Add Image">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              {/* Rich Text Editor */}
              <div
                ref={editorRef}
                contentEditable
                className="w-full h-96 p-4 border border-gray-200 border-t-0 rounded-b-lg focus:outline-none bg-white overflow-y-auto"
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
              <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                <Paperclip className="w-3 h-3" />
                Add Media
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Enhanced Calendar & To Do List Modal */}
      <Modal
        show={showCalendar}
        title="Calendar & To Do List"
        onClose={() => setShowCalendar(false)}
        size="xl"
      >
        <div className="grid grid-cols-5 gap-6 h-[600px]">
          {/* Calendar (60%) */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {monthNames[currentMonth.month - 1]} {currentMonth.year}
            </h3>

            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`p-2 text-sm cursor-pointer hover:bg-gray-100 rounded relative ${
                    selectedDate === day
                      ? "bg-indigo-100 text-indigo-800 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                  {calendarTasks[day] && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Color Legend */}
            <div className="space-y-2">
              {colorTags.slice(0, 3).map((tag) => (
                <div key={tag.label} className="flex items-center text-xs">
                  <div className={`w-3 h-3 rounded mr-2 ${tag.value.split(" ")[0]}`}></div>
                  <span className="text-gray-600">{tag.label}</span>
                </div>
              ))}

              {!showAddTag ? (
                <button
                  onClick={() => setShowAddTag(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  + Add color tag
                </button>
              ) : (
                <div className="space-y-2 p-2 bg-gray-50 rounded">
                  <CustomInput
                    type="text"
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                  <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewTagColor(color)}
                        className={`w-4 h-4 rounded ${color.split(" ")[0]} ${
                          newTagColor === color ? "ring-2 ring-gray-400" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={addColorTag}
                      className="px-2 py-1 bg-indigo-600 text-white text-xs rounded"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddTag(false)}
                      className="px-2 py-1 bg-gray-300 text-xs rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* To Do List (40%) */}
          <div className="col-span-2 border-l border-gray-200 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {monthNames[currentMonth.month - 1]} {selectedDate}, {currentMonth.year}
            </h3>

            <div className="space-y-3 mb-4">
              {(calendarTasks[selectedDate] || []).map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-green-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <div className="flex justify-between w-full items-center">
                    <p
                      className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                    >
                      {task.text}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getTagColor(task.tag.label)}`}
                    >
                      {task.tag.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Task */}
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
      </Modal>

      {/* Goals Modal */}
      <Modal show={showGoals} title="Monthly Goals" onClose={() => setShowGoals(false)} size="md">
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateGoalMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold">
              {monthNames[goalMonth.month - 1]} {goalMonth.year}
            </h3>
            <button
              onClick={() => navigateGoalMonth("next")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekly Goals Grid */}
          <div className="grid grid-cols-2 gap-6 pb-10">
            {["week1", "week2", "week3", "week4"].map((week, index) => (
              <div
                key={week}
                className={`border border-gray-200 rounded-lg p-4 ${[0, 3].includes(index) ? "bg-red-50" : "bg-green-50"}`}
              >
                <h4 className="font-semibold text-gray-800 mb-3">Week {index + 1}</h4>
                <div className="space-y-2">
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
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
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
                        className={`flex-1 text-sm bg-transparent border-none outline-none ${
                          goal.completed ? "line-through text-gray-500" : "text-gray-700"
                        }`}
                        placeholder="Enter goal..."
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addGoal(week)}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentPlanning;

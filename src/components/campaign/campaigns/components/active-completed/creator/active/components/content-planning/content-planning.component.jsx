import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import { Calendar, Edit3 } from "lucide-react";
import { useState } from "react";

const upcomingDeadlines = [
  { campaign: "Summer Skincare Collection", date: "Jun 15" },
  { campaign: "Fitness Equipment Review", date: "Jun 18" },
  { campaign: "Tech Gadget Unboxing", date: "Jun 22" },
  { campaign: "Fashion Haul Video", date: "Jun 25" },
];

const monthlyGoals = {
  Instagram: ["Post 3 reels weekly", "Reach 10k followers", "Increase engagement by 15%"],
  TikTok: ["Daily uploads", "Try 5 trending sounds", "Collaborate with 2 creators"],
  YouTube: ["Upload 2 long-form videos", "Optimize thumbnails", "Improve retention rate"],
  TikTok: ["Earn $5000 this month", "Negotiate 3 long-term deals", "Diversify income streams"],
};

const ContentPlanning = () => {
  const [showContentPlanner, setShowContentPlanner] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activePlannerTab, setActivePlannerTab] = useState("Hook Ideas");
  const [plannerContent, setPlannerContent] = useState({
    "Hook Ideas": "Brainstorm engaging opening lines...",
    Script: "Full video script goes here...",
    "Shot Ideas": "Different angles and shots to capture...",
    "General Notes": "Additional thoughts and reminders...",
  });

  const plannerTabs = ["Hook Ideas", "Script", "Shot Ideas", "General Notes"];

  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  return (
    <div className="w-1/5 space-y-4">
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

      {/* Calendar Icon */}
      <div className="mx-4">
        <CustomButton
          text="Calendar & Goals"
          onClick={() => setShowCalendar(true)}
          startIcon={<Calendar className="w-6 h-6 text-white" />}
        />
      </div>

      {/* Upcoming Deadlines */}
      <div className="mx-4">
        <h3 className="text-lg font-semibold text-gray-800 pb-2">Upcoming Deadline</h3>

        <div className="space-y-3">
          {upcomingDeadlines.map((item, index) => (
            <div
              key={index}
              className="rounded-lg p-2 bg-gray-100 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0 group-hover:bg-indigo-700"></div>
                <div className="flex justify-between w-full">
                  <p className="text-xs font-medium text-gray-600 group-hover:text-indigo-900">
                    {item.campaign}
                  </p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        show={showContentPlanner}
        title="Content Planner"
        onClose={() => setShowContentPlanner(false)}
        size="lg"
      >
        <div className="flex h-96">
          <div className="w-48 border-r border-gray-200">
            <div className="space-y-2">
              {plannerTabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActivePlannerTab(tab)}
                  className={`w-full p-2 rounded text-sm ${
                    activePlannerTab === tab
                      ? "bg-indigo-100 text-primary border-r border-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  } text-left`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 px-4">
            <TextArea
              label={activePlannerTab}
              value={plannerContent[activePlannerTab]}
              className="!h-64"
              onChange={(e) =>
                setPlannerContent({
                  ...plannerContent,
                  [activePlannerTab]: e.target.value,
                })
              }
              placeholder={`Enter your ${activePlannerTab.toLowerCase()} here...`}
            />
            <div className="flex justify-end mt-2 text-xs text-gray-600">
              Auto-saved • Last updated: just now
            </div>
          </div>
        </div>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        show={showCalendar}
        title="Calendar & Goals"
        onClose={() => setShowCalendar(false)}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-8">
          {/* Calendar */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">June 2025</h3>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`p-2 text-xs cursor-pointer hover:bg-gray-100 rounded ${
                    day === 15
                      ? "bg-red-100 text-red-800"
                      : day === 18
                        ? "bg-blue-100 text-blue-800"
                        : day === 22
                          ? "bg-green-100 text-green-800"
                          : "text-gray-700"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
                <span className="text-gray-600">Campaign Deadline</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
                <span className="text-gray-600">Recording Day</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                <span className="text-gray-600">Content Planning</span>
              </div>
            </div>
          </div>

          {/* Monthly Goals */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Monthly Goals</h3>
            <div className="space-y-4">
              {Object.entries(monthlyGoals).map(([platform, goals]) => (
                <div key={platform}>
                  <div
                    className={`flex justify-between gap-2 items-center px-3 py-1 rounded-lg text-xs font-medium mb-2 ${getPlatformColor(platform)}`}
                  >
                    <div className="rounded-md">{getPlatformIcon(platform)}</div>
                    <div>{platform}</div>
                  </div>
                  <div className="space-y-2">
                    {goals.map((goal, index) => (
                      <div key={index} className="flex items-center">
                        <input type="checkbox" className="w-3 h-3 text-indigo-600 rounded mr-2" />
                        <span className="text-xs text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentPlanning;

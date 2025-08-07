import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import { Avatar } from "@mui/material";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import BrandTimelineSteps from "../brand-timeline/brand-timeline";
import MessageThreadModal from "../message-thread-modal/message-thread-modal.component";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({ isCompleted = false }) => {
  const { getPlatformColor, getPlatformIcon } = useGetplatform();
  const {
    privateNotes,
    messageThreadHook,
    creator,
    // Keep existing functionality
    project,
    editingItem,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    toggleDeliverable,
    toggleTimelineStep,
  } = useDeliverablesProgress();

  const handleExportReport = () => {
    console.log("Exporting campaign report...");
  };

  const handleProcessPayments = () => {
    console.log("Processing final payments...");
  };

  const platforms = {
    instagram: { followers: 285000, verified: true },
    youtube: { followers: 95000, verified: true },
    twitter: { followers: 42000, verified: false },
  };

  const formatFollowers = (count) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      {/* Sticky Profile Section */}
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-2 top-0 bg-white z-10">
        <div className="relative">
          <Avatar
            src={avatar}
            alt="Sam Waters"
            className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
          >
            S
          </Avatar>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
          {isCompleted && (
            <span className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </span>
          )}
        </div>
        <h3>
          Sam Waters <span className="text-xs font-bold text-gray-600">(27 Years)</span>
        </h3>

        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(4) ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}{" "}
          <span className="text-sm text-gray-500 ml-1">(245 reviews)</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Los Angeles, CA</span>
        </div>

        {isCompleted && (
          <div className="flex gap-3">
            <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Campaign Completed
            </div>
            <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Review Submitted
            </div>
          </div>
        )}
        {isCompleted && (
          <div className="w-full flex flex-col gap-3 mt-2">
            {Object.entries(platforms).map(([platform, data]) => (
              <div
                key={platform}
                className="flex items-center justify-between bg-gray-100 rounded-lg px-1 pr-3
                                    hover:bg-gray-100/80 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <span className={`${getPlatformColor(platform)} p-1 rounded-md`}>
                    {getPlatformIcon(platform)}
                  </span>
                  <span className="text-xs capitalize font-semibold text-gray-700">{platform}</span>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {formatFollowers(data.followers)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header - Quick Actions */}
        <div className="p-4 border-b">
          <div className="flex flex-col justify-between items-start">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {isCompleted ? "Final Actions" : "Quick Actions"}
            </h4>

            <div className="w-full space-y-4">
              {isCompleted ? (
                <>
                  {/* Primary Actions - Completed State */}
                  <div className="flex flex-col 2xl:flex-row gap-3">
                    <CustomButton text="Export Report" onClick={handleExportReport} />
                    <CustomButton
                      text="Payment Summary"
                      className="btn-primary w-full whitespace-nowrap"
                      onClick={handleProcessPayments}
                    />
                  </div>

                  {/* Secondary Actions Group */}
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Additional Reports</h4>
                      <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-1 ml-3" />
                    </div>
                    <div className="w-full">
                      <CustomButton text="Performance Report" className="w-full btn-secondary" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Primary Actions - Active State */}
                  <div className="flex flex-col 2xl:flex-row gap-3">
                    <CustomButton text="Mark Complete" />
                    <CustomButton text="Release Payment" />
                  </div>

                  {/* Secondary Actions Group */}
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Campaign Actions</h4>
                      <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-1 ml-3" />
                    </div>
                    <div className="space-y-2">
                      {/* Communication Actions */}
                      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2">
                        <CustomButton
                          text="Send Message"
                          className="w-full btn-secondary"
                          onClick={messageThreadHook.openMessageModal}
                        />
                        <CustomButton text="Request Revision" className="w-full btn-secondary" />
                      </div>

                      {/* Payment Action */}
                      <CustomButton text="Edit Payment Details" className="w-full btn-secondary" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">
                Contract Agreement
              </h4>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span>1 Instagram video</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                </li>
                <li className="flex items-start gap-2">
                  <span>2 Instagram stories</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                </li>
                <li className="flex items-start gap-2">
                  <span>
                    {isCompleted ? "Completed:" : "Deadline:"}
                    <span className="font-semibold ml-1">20 May 2025</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>
                    Final Payment: <span className="font-semibold">$600</span>
                    {isCompleted && (
                      <span className="text-green-600 ml-2 text-xs">(Processed)</span>
                    )}
                  </span>
                </li>
              </ul>
            </div>

            {/* Timeline */}
            <div className="border-y p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Project Timeline</h4>
              <BrandTimelineSteps />
            </div>
          </div>

          <div className="w-full border-t">
            <div className="px-4 pb-4">
              {isCompleted && (
                <div className="bg-white rounded-lg p-4 shadow border">
                  <h4 className="text-base font-medium text-gray-800 mb-2">Leave a review</h4>
                  <TextArea placeholder="leave a review" />
                  <div className="flex justify-end gap-4">
                    <CustomButton text="Cancel" className="btn-cancel" />
                    <CustomButton text="Save" className="btn-primary" />
                  </div>
                </div>
              )}
              {/* Private Notes Section */}
              <div className="bg-white rounded-lg p-4 shadow mt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {isCompleted ? "Campaign Notes" : "Private Notes"}
                </h4>
                <ul className="space-y-3 text-sm text-gray-700 mb-4">
                  {privateNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">📝</span>
                      <div className="flex flex-col">
                        <span>{note.text}</span>
                        <span className="text-xs text-gray-400 mt-1">{note.timestamp}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                {!isCompleted && (
                  <React.Fragment>
                    <TextArea label="Add a new note..." />
                    <div className="flex justify-end gap-4">
                      <CustomButton text="Cancel" className="btn-cancel" />
                      <CustomButton text="Save" className="btn-primary" />
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Thread Modal - Replaces the simple Modal */}
      <MessageThreadModal
        isOpen={messageThreadHook.isModalOpen}
        onClose={messageThreadHook.closeMessageModal}
        creator={creator}
      />
    </div>
  );
};

export default DeliverablesProgress;

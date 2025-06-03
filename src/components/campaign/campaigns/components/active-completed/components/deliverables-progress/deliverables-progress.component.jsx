import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import { Avatar } from "@mui/material";
import {
  Award,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Edit2,
  Edit3,
  MapPin,
  MessageSquare,
  Receipt,
  RotateCcw,
  Star,
  TrendingUp,
} from "lucide-react";
import useDeliverablesProgress from "./use-deliverables-progress.hook";
import React from "react";

const DeliverablesProgress = ({ isCompleted = false }) => {
  const {
    getStatusColor,
    getStatusIcon,
    project,
    privateNotes,
    editingItem,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    toggleDeliverable,
    toggleTimelineStep,
    messageDialogOpen,
    setMessageDialogOpen,
  } = useDeliverablesProgress();

  const handleExportReport = () => {
    // console.log("Exporting campaign report...");
  };

  const handleProcessPayments = () => {
    // console.log("Processing final payments...");
  };

  return (
    <div className="w-1/4 bg-white flex flex-col border h-screen pb-20">
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
        <h3>Sam Waters</h3>

        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(4) ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Los Angeles, CA</span>
        </div>
        <p className="primary-text text-center">
          Fitness and lifestyle creator based in Los Angeles
        </p>
        {isCompleted && (
          <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Campaign Completed
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <CustomButton
                      text="Export Report"
                      startIcon={<Download className="w-4 h-4" />}
                      onClick={handleExportReport}
                    />
                    <CustomButton
                      text="Payment Summary"
                      startIcon={<Receipt className="w-4 h-4" />}
                      onClick={handleProcessPayments}
                    />
                  </div>

                  {/* Secondary Actions Group */}
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Additional Reports</h4>
                      <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-1 ml-3" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <CustomButton
                        text="Performance Report"
                        startIcon={<TrendingUp className="w-4 h-4" />}
                        className="w-full btn-secondary"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Primary Actions - Active State */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <CustomButton
                      text="Mark Complete"
                      startIcon={<CheckCircle2 className="w-4 h-4" />}
                    />
                    <CustomButton
                      text="Release Payment"
                      startIcon={<DollarSign className="w-4 h-4" />}
                    />
                  </div>

                  {/* Secondary Actions Group */}
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Campaign Actions</h4>
                      <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-1 ml-3" />
                    </div>
                    <div className="space-y-2">
                      {/* Communication Actions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomButton
                          text="Send Message"
                          startIcon={<MessageSquare className="w-4 h-4" />}
                          className="w-full btn-secondary"
                          onClick={() => setMessageDialogOpen(true)}
                        />
                        <CustomButton
                          text="Request Revision"
                          startIcon={<RotateCcw className="w-4 h-4" />}
                          className="w-full btn-secondary"
                        />
                      </div>

                      {/* Payment Action */}
                      <CustomButton
                        text="Edit Payment Details"
                        startIcon={<Edit3 className="w-4 h-4" />}
                        className="w-full btn-secondary"
                      />
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
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">🎥</span>
                  <span>1 Instagram video</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">📸</span>
                  <span>2 Instagram stories</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">📅</span>
                  <span>
                    {isCompleted ? "Completed:" : "Deadline:"}
                    <span className="font-semibold ml-1">20 May 2025</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">💰</span>
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
              <h4 className="text-lg font-semibold text-gray-800 mb-2 pb-2 border-b">
                Project Timeline
              </h4>
              {project.timeline.map((step, index) => (
                <div key={step.id} className="w-full flex items-center py-2 space-x-3">
                  <div
                    onClick={!isCompleted ? () => toggleTimelineStep(step.id) : undefined}
                    className={`rounded-full flex items-center justify-center ${
                      step.completed || isCompleted
                        ? "bg-primary border-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isCompleted ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-sm w-full flex justify-between">
                    <span
                      className={`${step.completed || isCompleted ? "text-primary" : "text-gray-600"}`}
                    >
                      {step.step}
                    </span>
                    <span className="text-gray-600 ml-2">{step.date}</span>
                  </div>
                  {index < project.timeline.length - 1 && (
                    <div className="absolute left-3 mt-6 w-0.5 h-6 bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Deliverables */}
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Deliverables</h4>
              <div className="space-y-4">
                {project.deliverables.map((deliverable) => (
                  <div
                    key={deliverable.id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          onClick={
                            !isCompleted ? () => toggleDeliverable(deliverable.id) : undefined
                          }
                          className={`mt-1 rounded-full flex items-center justify-center ${
                            deliverable.completed || isCompleted
                              ? "bg-primary border-primary text-white"
                              : "border-gray-300 hover:border-gray-400"
                          } ${isCompleted ? "cursor-default" : "cursor-pointer"}`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>

                        <div className="flex-1">
                          {editingItem?.type === "deliverable" &&
                          editingItem?.id === deliverable.id &&
                          !isCompleted ? (
                            <div className="space-y-3">
                              <CustomInput
                                type="text"
                                value={editForm.title}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, title: e.target.value })
                                }
                              />
                              <div className="flex space-x-3">
                                <CustomInput
                                  type="date"
                                  value={editForm.deadline}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, deadline: e.target.value })
                                  }
                                />
                                <CustomInput
                                  type="number"
                                  value={editForm.amount}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, amount: Number(e.target.value) })
                                  }
                                  placeholder="Amount"
                                />
                              </div>
                              <div className="flex w-[60%] space-x-2">
                                <CustomButton text="Save" onClick={handleSave} />
                                <CustomButton
                                  text="cancel"
                                  className="btn-cancel"
                                  onClick={handleCancel}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3
                                className={`text-sm ${
                                  deliverable.completed || isCompleted
                                    ? "text-gray-500"
                                    : "text-gray-600"
                                }`}
                              >
                                {deliverable.title}
                              </h3>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>{deliverable.deadline}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{deliverable.amount}</span>
                                </div>

                                <div
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                                    isCompleted
                                      ? "bg-green-100 text-green-800"
                                      : getStatusColor(deliverable.status)
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-3 h-3" />
                                  ) : (
                                    getStatusIcon(deliverable.status)
                                  )}
                                  <span className="capitalize">
                                    {isCompleted
                                      ? "Completed"
                                      : deliverable.status.replace("-", " ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {(!editingItem || editingItem.id !== deliverable.id) && !isCompleted && (
                        <div className="flex items-center">
                          <CustomButton
                            onClick={() => handleEdit("deliverable", deliverable)}
                            className="text-gray-400 hover:text-gray-600"
                            text="Edit"
                            endIcon={<Edit3 className="w-4 h-4" />}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full border-t">
            <div className="p-4">
              {/* Progress Summary */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {isCompleted ? "Final Summary" : "Progress Summary"}
              </h3>
              <div className="bg-white border rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed:</span>
                    <span className="font-medium">
                      {isCompleted
                        ? `${project.deliverables.length}/${project.deliverables.length}`
                        : `${project.deliverables.filter((d) => d.completed).length}/${project.deliverables.length}`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: isCompleted
                          ? "100%"
                          : `${(project.deliverables.filter((d) => d.completed).length / project.deliverables.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{isCompleted ? "Total Paid:" : "Amount Earned:"}</span>
                    <span className="font-medium text-primary">
                      $
                      {isCompleted
                        ? project.deliverables.reduce((sum, d) => sum + d.amount, 0)
                        : project.deliverables
                            .filter((d) => d.completed)
                            .reduce((sum, d) => sum + d.amount, 0)}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-green-600 font-medium">Campaign Status:</span>
                      <span className="font-medium text-green-600">Successfully Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {isCompleted && (
                <div className="bg-white rounded-lg p-4 shadow border mt-4">
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

      {/* Message Creator Dialog */}
      <Modal
        title={`Message to Sam Waters`}
        show={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        <TextArea label="Your Message" />
        <div className="w-full flex justify-end gap-3">
          <CustomButton
            text="Cancel"
            className="btn-cancel"
            onClick={() => setMessageDialogOpen(false)}
          />

          <CustomButton text="Send Message" className="btn-primary" />
        </div>
      </Modal>
    </div>
  );
};

export default DeliverablesProgress;

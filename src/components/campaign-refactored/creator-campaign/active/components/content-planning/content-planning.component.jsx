import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import {
  Bold,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Italic,
  List,
  ListOrdered,
  Paperclip,
  Plus,
  Redo,
  Underline,
  Undo,
  Trash2,
  Pencil,
} from "lucide-react";
import { useContentPlanningViewModel } from "./use-content-planning.hook";
import CalendarModal from "@/components/campaign-refactored/brand-campaign/active/components/calendar-modal/calendar-modal.component";
import TaskManagerCreator from "@/components/campaign-refactored/creator-campaign/active/components/task-manager-creator/task-manager-creator.component";

const ContentPlanning = ({ selectedCampaign, setSelectedCampaign, getCampaignById, formatCampaignData }) => {
  const {
    showContentPlanner,
    showCalendar,
    showGoals,
    contentPlanners,
    plannerSections,
    activeSectionId,
    sectionContent,
    showAddTitle,
    newTitle,
    selectedPlanner,
    isEditingTitle,
    createContentPlannerState,
    updateContentPlannerState,
    createContentPlannerSectionState,
    updateContentPlannerSectionState,
    deleteContentPlannerSectionState,
    setActiveSectionId,
    handleSectionContentChange,
    handleSectionContentSave,
    handleAddSection,
    handleDeleteSection,
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
    goalMonth,
    goalsByWeek,
    createMonthlyGoalState,
    updateMonthlyGoalState,
    deleteMonthlyGoalState,
    navigateGoalMonth,
    toggleGoalCompletion,
    updateGoalTitle,
    deleteGoal,
    addingGoalToWeek,
    newGoalTitle,
    setNewGoalTitle,
    renamingSectionId,
    renameInput,
    setRenameInput,
    goalTitles,
    setGoalTitles,
    updateTimeoutsRef,
    editorRef,
    monthNames,
    activeSection,
    handleAddGoalClick,
    handleAddGoalCancel,
    handleAddGoalKeyPress,
    formatRichText,
    handleSectionRenameStart,
    handleSectionRenameCancel,
    handleSectionRenameSubmit,
  } = useContentPlanningViewModel(selectedCampaign);

  return (
    <div className="w-full bg-white border-l border-gray-200">
      <div className="space-y-3 p-2.5 sm:p-4">
        {/* Content Planner */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
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
                  className="group flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-2.5 py-2 text-[10px] text-blue-700 transition-colors hover:bg-blue-100 sm:px-3 sm:text-xs"
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
                      text={isEditingTitle ? "Update" : "Save"}
                      onClick={isEditingTitle ? handleUpdateTitle : handleSaveTitle}
                      disabled={
                        !newTitle.trim() ||
                        (isEditingTitle
                          ? updateContentPlannerState.isLoading
                          : createContentPlannerState.isLoading)
                      }
                      className="btn-primary"
                    />
                    <CustomButton
                      text="Cancel"
                      onClick={handleCancelAddTitle}
                      className="btn-outline"
                    />
                  </div>
                </div>
              ) : (
                <button
                  className="w-full rounded-md border border-dashed border-gray-300 px-3 py-2 text-[10px] text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 sm:text-xs"
                  onClick={handleAddTitle}
                >
                  + Add More
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2">
          <CustomButton
            text="Calendar & Tasks"
            className="btn-outline w-full"
            onClick={openCalendar}
          />
          <CustomButton text="Monthly Goals" className="btn-primary w-full" onClick={openGoals} />
        </div>

        {/* Upcoming Tasks */}
        {selectedCampaign ? (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <TaskManagerCreator
              setSelectedCampaign={setSelectedCampaign}
              getCampaignById={getCampaignById}
              formatCampaignData={formatCampaignData}
            />
          </div>
        ) : null}
      </div>

      {/* Content Planner Modal */}
      <Modal
        show={showContentPlanner}
        title={selectedPlanner ? selectedPlanner.title : "Content Planner"}
        onClose={closeContentPlanner}
        size="xl"
      >
        <div className="flex h-[85dvh] flex-col sm:h-[600px] sm:flex-row">
          <div className="w-full border-b border-gray-200 pb-3 sm:w-64 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <div className="space-y-2">
              {plannerSections.map((section) => {
                const isActive = section.id === activeSectionId;
                const isRenaming = renamingSectionId === section.id;

                if (isRenaming) {
                  return (
                    <div
                      key={section.id}
                      className="rounded-lg border border-slate-300 bg-slate-50 p-3"
                    >
                      <input
                        value={renameInput}
                        onChange={(event) => setRenameInput(event.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none"
                        autoFocus
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleSectionRenameSubmit();
                          } else if (event.key === "Escape") {
                            handleSectionRenameCancel();
                          }
                        }}
                      />
                      <div className="mt-2 flex justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={handleSectionRenameCancel}
                          className="rounded border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-100"
                          disabled={updateContentPlannerSectionState.isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSectionRenameSubmit}
                          className="rounded bg-slate-700 px-2 py-1 text-white hover:bg-slate-800 disabled:opacity-60"
                          disabled={
                            updateContentPlannerSectionState.isLoading || !renameInput.trim()
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={section.id}
                    className={`group flex rounded-lg border transition-colors ${
                      isActive
                        ? "border-slate-400 bg-slate-100"
                        : "border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSectionId(section.id)}
                      className="flex w-full items-center justify-between px-3 py-2 text-sm text-left"
                    >
                      <span className="flex-1 truncate text-slate-800">{section.title}</span>
                      <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSectionRenameStart(section);
                          }}
                          className="rounded p-1 hover:bg-slate-200"
                          title="Rename section"
                          disabled={updateContentPlannerSectionState.isLoading}
                        >
                          <Pencil size={12} className="text-slate-700" />
                        </button>
                        <button
                          type="button"
                          onClick={async (event) => {
                            event.stopPropagation();
                            await handleDeleteSection(section.id);
                          }}
                          className="rounded p-1 hover:bg-red-200"
                          title="Delete section"
                          disabled={
                            deleteContentPlannerSectionState.isLoading ||
                            plannerSections.length <= 1
                          }
                        >
                          <Trash2 size={12} className="text-red-600" />
                        </button>
                      </span>
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddSection}
                disabled={!selectedPlanner || createContentPlannerSectionState.isLoading}
                className={`w-full rounded-md border border-dashed px-3 py-2 text-xs transition-colors ${
                  !selectedPlanner || createContentPlannerSectionState.isLoading
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                + Add Section
              </button>
            </div>
          </div>

          <div className="flex-1 pt-3 sm:px-6 sm:pt-0">
            {activeSection ? (
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">{activeSection.title}</h3>

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
                  dangerouslySetInnerHTML={{
                    __html: sectionContent[activeSectionId] || "",
                  }}
                  onInput={(event) =>
                    handleSectionContentChange(activeSectionId, event.currentTarget.innerHTML)
                  }
                  onBlur={(event) =>
                    handleSectionContentSave(activeSectionId, event.currentTarget.innerHTML)
                  }
                />
              </div>
            ) : (
              <div className="flex h-full flex-1 items-center justify-center text-sm text-gray-500">
                {selectedPlanner
                  ? "No sections available. Add a section to get started."
                  : "Select a content planner to view sections."}
              </div>
            )}
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
        <div className="p-2.5 sm:p-3">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3 bg-gray-100 rounded-md p-2">
            <button
              onClick={() => navigateGoalMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-xl">
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
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
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-800 sm:text-lg">Week {weekNumber}</h4>
                    <button
                      onClick={() => handleAddGoalClick(weekNumber)}
                      disabled={createMonthlyGoalState.isLoading}
                      className="flex items-center gap-1 text-[10px] text-slate-600 transition-colors hover:text-slate-800 disabled:opacity-50 sm:gap-2 sm:text-sm"
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
                            value={goalTitles[goal.id] ?? goal.title}
                            onChange={(e) => {
                              const newTitle = e.target.value;
                              // Update local state immediately for responsive UI
                              setGoalTitles((prev) => ({
                                ...prev,
                                [goal.id]: newTitle,
                              }));
                              // Clear existing timeout for this goal
                              if (updateTimeoutsRef.current[goal.id]) {
                                clearTimeout(updateTimeoutsRef.current[goal.id]);
                              }
                              // Set new timeout to debounce API call
                              updateTimeoutsRef.current[goal.id] = setTimeout(() => {
                                updateGoalTitle(goal, newTitle);
                                delete updateTimeoutsRef.current[goal.id];
                              }, 800); // 800ms debounce
                            }}
                            onBlur={(e) => {
                              // Clear timeout and update immediately on blur
                              if (updateTimeoutsRef.current[goal.id]) {
                                clearTimeout(updateTimeoutsRef.current[goal.id]);
                                delete updateTimeoutsRef.current[goal.id];
                              }
                              // Only update if value changed
                              if (goalTitles[goal.id] !== goal.title) {
                                updateGoalTitle(goal, goalTitles[goal.id] ?? e.target.value);
                              }
                            }}
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

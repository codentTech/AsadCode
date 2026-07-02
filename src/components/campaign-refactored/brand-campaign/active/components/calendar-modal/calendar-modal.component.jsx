import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { AddCircle } from "@mui/icons-material";
import { CheckSquare, ChevronLeft, ChevronRight, Square, Trash2 } from "lucide-react";
import useCalendarModal from "./use-calendar-modal.hook";

const CalendarModal = ({ show, onClose, selectedCampaign }) => {
  const {
    selectedDate,
    currentMonth,
    newTaskText,
    selectedTag,
    showAddTag,
    newTagName,
    newTagColor,
    calendarTasks,
    categoryOptions,
    allCategories,
    monthNames,
    isHexColor,
    createTaskState,
    createCategoryState,
    handleDateClick,
    navigateMonth,
    addTask,
    toggleTask,
    addColorTag,
    getTagColor,
    getDateIndicators,
    handleNewTaskTextChange,
    handleNewTagNameChange,
    handleNewTagColorChange,
    handleTagSelection,
    toggleAddTag,
    cancelAddTag,
    handleDeleteCategoryClick,
    showDeleteConfirmation,
    categoryToDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useCalendarModal(show, selectedCampaign);

  const weekdayLabels = [
    { short: "Su", full: "Sun" },
    { short: "Mo", full: "Mon" },
    { short: "Tu", full: "Tue" },
    { short: "We", full: "Wed" },
    { short: "Th", full: "Thu" },
    { short: "Fr", full: "Fri" },
    { short: "Sa", full: "Sat" },
  ];

  return (
    <Modal show={show} title="Calendar" onClose={onClose} size="xl">
      <div className="flex w-full min-w-0 flex-col gap-4 lg:grid lg:grid-cols-5 lg:items-start lg:gap-4">
        <div className="flex min-w-0 flex-col gap-3 lg:col-span-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="min-w-0 truncate text-base font-bold text-gray-900 sm:text-lg">
              {monthNames[currentMonth.month - 1]} {currentMonth.year}
            </h3>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => navigateMonth("prev")}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateMonth("next")}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-gray-100 p-2 sm:p-3">
            <div className="grid grid-cols-7 gap-x-0.5 gap-y-1 sm:gap-x-1 sm:gap-y-1.5">
              {weekdayLabels.map((day) => (
                <div
                  key={day.full}
                  className="px-0.5 py-1 text-center text-[10px] font-semibold leading-tight text-gray-500 sm:text-xs"
                >
                  <span className="sm:hidden">{day.short}</span>
                  <span className="hidden sm:inline">{day.full}</span>
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const indicators = getDateIndicators(day);
                const isSelected = selectedDate === day;
                const hasAnyTask = indicators.taskColors && indicators.taskColors.length > 0;

                return (
                  <div key={day} className="flex flex-col items-center gap-0.5 py-0.5">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleDateClick(day)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDateClick(day);
                        }
                      }}
                      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[11px] font-medium transition-all sm:h-9 sm:w-9 sm:text-xs ${
                        isSelected
                          ? "scale-105 bg-primary text-white shadow-md"
                          : hasAnyTask
                            ? "border border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow-md"
                            : "hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      {day}
                    </div>
                    {hasAnyTask && (
                      <div className="flex min-h-[5px] items-center justify-center gap-0.5">
                        {indicators.taskColors.map((taskColor, index) => (
                          <div
                            key={index}
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              isHexColor(taskColor.color)
                                ? ""
                                : taskColor.color.split(" ")[0] || "bg-gray-500"
                            }`}
                            style={
                              isHexColor(taskColor.color)
                                ? { backgroundColor: taskColor.color }
                                : undefined
                            }
                            title={taskColor.label}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-3">
            <div className="space-y-2">
              <div className="space-y-1">
                <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:text-sm">
                  Default Categories
                </h4>
                <div className="grid grid-cols-1 gap-1.5 xs:grid-cols-2">
                  {allCategories
                    .filter((cat) => cat.isDefault)
                    .map((category) => (
                      <div
                        key={category.label}
                        className="flex min-w-0 items-center gap-2 text-xs"
                      >
                        <div
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            isHexColor(category.color) ? "" : category.color.split(" ")[0]
                          }`}
                          style={
                            isHexColor(category.color)
                              ? { backgroundColor: category.color }
                              : undefined
                          }
                        />
                        <span className="min-w-0 break-words text-gray-600">{category.label}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-gray-700 sm:text-sm">
                    Custom Categories
                  </h4>
                  {!showAddTag && (
                    <button
                      type="button"
                      onClick={toggleAddTag}
                      className="shrink-0 rounded-full bg-gray-200 p-1.5 sm:p-2"
                    >
                      <AddCircle className="text-primary" fontSize="small" />
                    </button>
                  )}
                </div>
                {allCategories.filter((cat) => !cat.isDefault).length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5 xs:grid-cols-2">
                    {allCategories
                      .filter((cat) => !cat.isDefault)
                      .map((category) => (
                        <div
                          key={category.id || category.label}
                          className="group flex min-w-0 items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <div
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                isHexColor(category.color) ? "" : category.color.split(" ")[0]
                              }`}
                              style={
                                isHexColor(category.color)
                                  ? { backgroundColor: category.color }
                                  : undefined
                              }
                            />
                            <span className="min-w-0 break-words text-gray-600">
                              {category.label}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategoryClick(category.id, category.label)}
                            className="shrink-0 p-1 text-red-500 opacity-0 transition-opacity hover:text-red-700 group-hover:opacity-100"
                            title="Delete category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-500">No custom categories yet</p>
                )}
              </div>
            </div>

            {showAddTag && (
              <div className="mt-2 rounded border border-gray-200 bg-gray-50 p-2">
                <div className="space-y-2">
                  <CustomInput
                    type="text"
                    placeholder="Category name"
                    value={newTagName}
                    onChange={handleNewTagNameChange}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-600">Color:</label>
                    <input
                      type="color"
                      value={
                        typeof newTagColor === "string" && newTagColor.startsWith("#")
                          ? newTagColor
                          : "#6366f1"
                      }
                      onChange={(e) => handleNewTagColorChange(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border border-gray-300"
                      title="Choose a color"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={addColorTag}
                      className="rounded bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-gray-800"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={cancelAddTag}
                      className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col lg:col-span-2">
          <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white lg:max-h-[min(70vh,36rem)]">
            <div className="shrink-0 border-b border-gray-200 p-3">
              <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                {monthNames[currentMonth.month - 1]} {selectedDate}
              </h3>
              <p className="text-xs text-gray-500">
                {(calendarTasks[selectedDate] || []).length} tasks scheduled
              </p>
            </div>

            <div className="max-h-[min(50vh,24rem)] overflow-y-auto p-3">
              {(calendarTasks[selectedDate] || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center px-2 py-6 text-center">
                  <p className="text-sm text-gray-500">No tasks for this day</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(calendarTasks[selectedDate] || []).map((task) => (
                    <div
                      key={task.id}
                      className={`group rounded-lg border transition-all ${
                        task.completed
                          ? "border-gray-200 bg-gray-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="p-2 sm:p-2.5">
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => toggleTask(task.id)}
                            disabled={task.isAutoGenerated}
                            className={`mt-0.5 shrink-0 ${task.isAutoGenerated ? "cursor-not-allowed" : "transition-transform hover:scale-110"}`}
                          >
                            {task.completed ? (
                              <CheckSquare className="h-4 w-4 text-green-500" />
                            ) : (
                              <Square
                                className={`h-4 w-4 ${task.isAutoGenerated ? "text-gray-300" : "text-gray-400"}`}
                              />
                            )}
                          </button>

                          <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                            <p
                              className={`min-w-0 text-xs font-medium leading-relaxed ${
                                task.completed ? "text-gray-500 line-through" : "text-gray-700"
                              }`}
                            >
                              {task.text}{" "}
                              {task.isAutoGenerated && (
                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-600">
                                  Auto
                                </span>
                              )}
                            </p>

                            <span
                              className={`inline-flex w-fit max-w-full shrink-0 items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                                isHexColor(getTagColor(task.tag.label))
                                  ? "text-white"
                                  : getTagColor(task.tag.label)
                              }`}
                              style={
                                isHexColor(getTagColor(task.tag.label))
                                  ? { backgroundColor: getTagColor(task.tag.label) }
                                  : undefined
                              }
                            >
                              <span className="truncate">{task.tag.label}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-gray-200 p-3">
              <h4 className="mb-2 text-sm font-semibold text-gray-900">Add Task</h4>

              <div className="space-y-2">
                <CustomInput
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTaskText}
                  onChange={handleNewTaskTextChange}
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                />

                <SimpleSelect
                  placeHolder="Choose category"
                  options={categoryOptions}
                  onChange={handleTagSelection}
                  value={selectedTag}
                />

                <CustomButton
                  text="Add Task"
                  onClick={addTask}
                  className="btn-primary w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        show={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Delete Category"
        content={`Are you sure you want to delete "${categoryToDelete?.label}"? This action cannot be undone.`}
      />
    </Modal>
  );
};

export default CalendarModal;

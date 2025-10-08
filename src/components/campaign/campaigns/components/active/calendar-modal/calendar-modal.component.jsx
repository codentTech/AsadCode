import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import { CheckSquare, ChevronLeft, ChevronRight, Plus, Square } from "lucide-react";
import useCalendarModal from "./use-calendar-modal.hook";
import { AddCircle } from "@mui/icons-material";

const CalendarModal = ({ show, onClose, selectedCampaign }) => {
  const {
    // State
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
    colorOptions,

    // Redux states
    createTaskState,
    createCategoryState,

    // Actions
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
  } = useCalendarModal(show, selectedCampaign);

  return (
    <Modal show={show} title="Calendar" onClose={onClose} size="xl">
      <div className="grid grid-cols-5 gap-4 p-1">
        {/* Calendar (60%) */}
        <div className="col-span-3">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {monthNames[currentMonth.month - 1]} {currentMonth.year}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => navigateMonth("prev")}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
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
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const indicators = getDateIndicators(day);
                const isSelected = selectedDate === day;
                const hasAnyTask =
                  indicators.hasDeadline || indicators.hasDraft || indicators.hasOther;

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

                    {/* Compact dot indicators */}
                    {(indicators.hasDeadline || indicators.hasDraft || indicators.hasOther) && (
                      <div className="absolute -top-0.5 -right-0.5 flex gap-0.5">
                        {indicators.hasDeadline && (
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        )}
                        {indicators.hasDraft && (
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        )}
                        {indicators.hasOther && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Legend */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="space-y-2">
              {/* Default Categories */}
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Default Categories</h4>
                <div className="grid grid-cols-2 gap-1">
                  {allCategories
                    .filter((cat) => cat.isDefault)
                    .map((category) => (
                      <div key={category.label} className="flex items-center gap-2 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${category.color.split(" ")[0]}`}
                        ></div>
                        <span className="text-gray-600">{category.label}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Custom Categories */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Custom Categories</h4>
                  {!showAddTag && (
                    <button onClick={toggleAddTag} className="bg-gray-200 p-2 rounded-full">
                      <AddCircle className="text-primary" />
                    </button>
                  )}
                </div>
                {allCategories.filter((cat) => !cat.isDefault).length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {allCategories
                      .filter((cat) => !cat.isDefault)
                      .map((category) => (
                        <div key={category.label} className="flex items-center gap-2 text-xs">
                          <div
                            className={`w-2 h-2 rounded-full ${category.color.split(" ")[0]}`}
                          ></div>
                          <span className="text-gray-600">{category.label}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No custom categories yet</p>
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
                    onChange={handleNewTagNameChange}
                  />
                  <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleNewTagColorChange(color)}
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
                      onClick={cancelAddTag}
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
                {monthNames[currentMonth.month - 1]} {selectedDate}
              </h3>
              <p className="text-xs text-gray-500">
                {(calendarTasks[selectedDate] || []).length} tasks scheduled
              </p>
            </div>

            {/* Tasks */}
            <div className="p-3 h-64 overflow-y-auto space-y-2">
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
                          disabled={task.isAutoGenerated}
                          className={`mt-0.5 ${task.isAutoGenerated ? "cursor-not-allowed" : "hover:scale-110 transition-transform"}`}
                        >
                          {task.completed ? (
                            <CheckSquare className="w-4 h-4 text-green-500" />
                          ) : (
                            <Square
                              className={`w-4 h-4 ${task.isAutoGenerated ? "text-gray-300" : "text-gray-400"}`}
                            />
                          )}
                        </button>

                        <div className="w-full flex justify-between items-center">
                          <p
                            className={`text-xs font-medium leading-relaxed ${
                              task.completed ? "line-through text-gray-500" : "text-gray-700"
                            }`}
                          >
                            {task.text}{" "}
                            {task.isAutoGenerated && (
                              <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                                Auto
                              </span>
                            )}
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

                <CustomButton text="Add Task" onClick={addTask} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;

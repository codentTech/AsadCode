import React, { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TextArea from "@/common/components/text-area/text-area.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";

function Description({ campaignData, handleChange, handleImageUpload, handleStyleGuideUpload }) {
  const [questions, setQuestions] = useState(campaignData.questions || [""]);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
    handleChange({
      target: {
        name: "questions",
        value: updated.filter((q) => q.trim() !== ""),
      },
    });
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updated = questions.filter((_, i) => i !== index);
      setQuestions(updated);
      handleChange({
        target: {
          name: "questions",
          value: updated.filter((q) => q.trim() !== ""),
        },
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextArea
          label="Short Description"
          name="shortDescription"
          value={campaignData.shortDescription}
          onChange={handleChange}
          isRequired={true}
          className="w-full"
          placeholder="Brief overview of your campaign..."
        />

        <TextArea
          label="Long Description"
          name="longDescription"
          value={campaignData.longDescription}
          onChange={handleChange}
          className="w-full"
          placeholder="Detailed campaign information..."
        />
      </div>

      {/* Campaign Image */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Image</label>
          <label className="group relative flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200">
            <div className="text-center">
              <ImageIcon className="h-8 w-8 mx-auto text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <p className="text-sm text-gray-600 mt-2">Upload Image</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {campaignData.campaignImage && (
          <div className="flex-shrink-0 pt-7">
            <img
              src={campaignData.campaignImage}
              alt="Campaign"
              className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Content Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <TextArea
          label="Hashtags & Captions"
          name="hashtags"
          value={campaignData.hashtags}
          onChange={handleChange}
          className="w-full"
          placeholder="#cleanbeauty #sponsored #authentic"
        />

        <TextArea
          label="Do's and Don'ts"
          name="nonNegotiables"
          value={campaignData.nonNegotiables}
          onChange={handleChange}
          className="w-full"
          placeholder="Do: Show real results. Don't: Mention competitors."
        />
      </div>

      {/* Style Guide */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Style Guide</h4>

        <TextArea
          label="Style Guidelines"
          name="styleGuide"
          value={campaignData.styleGuide}
          onChange={handleChange}
          className="w-full"
          placeholder="Natural lighting, authentic feel, minimal editing..."
        />

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Reference File:</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleStyleGuideUpload}
            className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors"
          />
        </div>
      </div>

      {/* Creator Questions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">Creator Questions</h4>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <AddIcon className="h-4 w-4" />
            Add Question
          </button>
        </div>

        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-medium min-w-[20px]">
                {i + 1}
              </span>
              <CustomInput
                type="text"
                name={`question-${i}`}
                value={q}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
                placeholder={`Question ${i + 1}`}
                className="flex-1"
              />
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <DeleteIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Description;

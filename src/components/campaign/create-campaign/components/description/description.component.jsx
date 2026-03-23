"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import {
  MAX_IMAGE_UPLOAD_SIZE,
  MAX_STYLE_GUIDE_UPLOAD_SIZE,
} from "@/common/constants/file.constant";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import useDescription from "./use-description.hook";

function Description({ campaignData, errors = {}, register, setValue }) {
  const {
    questions,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    imagePreview,
    handleImageUpload,
    handleStyleGuideUpload,
    isUploadingImage,
    isUploadingStyleGuide,
    uploadError,
    doGuidelines,
    dontGuidelines,
    handleRemoveDoGuideline,
    handleDoGuidelineChange,
    handleDoGuidelineKeyDown,
    handleDontGuidelineKeyDown,
    handleRemoveDontGuideline,
    handleDontGuidelineChange,
  } = useDescription({ campaignData, setValue });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextArea
          label="Short Description"
          name="short_description"
          isRequired={true}
          className="w-full"
          placeholder="Brief overview of your campaign (max 100 characters)"
          errors={errors}
          register={register}
        />

        <TextArea
          label="Long Description"
          name="long_description"
          className="w-full"
          placeholder="Detailed campaign information (max 1000 characters)"
          errors={errors}
          register={register}
        />
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold not-italic leading-[18px] mb-2">
            Campaign Image <span className="text-red-500">*</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <input
            type="hidden"
            value={campaignData?.campaignImage || ""}
            readOnly
            {...register("campaignImage", {
              required: "Campaign image is required.",
            })}
          />
          <label
            className={`group relative flex items-center justify-center w-full h-32 rounded-xl border-2 border-dashed transition-all duration-200 ${errors?.campaignImage ? "border-red-400 bg-red-50/40" : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"}`}
          >
            <div className="text-center">
              <ImageIcon
                className={`h-8 w-8 mx-auto transition-colors ${errors?.campaignImage ? "text-red-400 group-hover:text-red-500" : "text-gray-400 group-hover:text-indigo-500"}`}
              />
              <p
                className={`text-sm mt-2 ${errors?.campaignImage ? "text-red-500" : "text-gray-600"}`}
              >
                Upload Image
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WEBP up to {(MAX_IMAGE_UPLOAD_SIZE / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          {errors?.campaignImage && (
            <p className="mt-1 text-xs text-red-500">{errors.campaignImage.message}</p>
          )}
          {isUploadingImage && <p className="mt-2 text-xs text-indigo-600">Uploading image...</p>}
        </div>

        {imagePreview && (
          <div className="flex-shrink-0 pt-7">
            <img
              src={imagePreview}
              alt="Campaign"
              className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 pt-1">
        <TextArea
          label="Hashtags & Captions"
          name="hashtags"
          className="w-full"
          placeholder="#cleanbeauty #sponsored #authentic"
          errors={errors}
          register={register}
        />
      </div>

      <div className="space-y-3">
        <TextArea
          label="Style Guidelines"
          name="styleGuide"
          register={register}
          errors={errors}
          className="w-full"
          placeholder="Natural lighting, authentic feel, minimal editing..."
        />

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label className="text-sm text-gray-600">
            Reference File:{" "}
            <span className="text-xs text-gray-400">
              Max size {(MAX_STYLE_GUIDE_UPLOAD_SIZE / (1024 * 1024)).toFixed(0)}MB
            </span>
          </label>
          <input
            type="file"
            accept="image/*,video/*,application/pdf"
            onChange={handleStyleGuideUpload}
            className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors"
          />

          {isUploadingStyleGuide && <span className="text-xs text-indigo-600">Uploading...</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold not-italic leading-[18px]">Do's</h4>
            <p className="text-xs text-gray-500">Add quick bullet guidelines for creators.</p>
          </div>
          <div className="mt-3 space-y-2">
            {doGuidelines.map((guideline, index) => (
              <div key={`do-${index}`} className="flex items-center gap-2">
                <span className="select-none text-gray-500">•</span>
                <CustomInput
                  name={`nonNegotiablesDo-${index}`}
                  value={guideline}
                  onChange={(event) => handleDoGuidelineChange(index, event.target.value)}
                  onKeyDown={(event) => handleDoGuidelineKeyDown(index, event)}
                  placeholder={`Do #${index + 1}`}
                  className="!py-2"
                />
                {doGuidelines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDoGuideline(index)}
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <DeleteIcon className="h-4 w-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold not-italic leading-[18px]">Don'ts</h4>
            <p className="text-xs text-gray-500">Call out pitfalls to avoid during production.</p>
          </div>
          <div className="mt-3 space-y-2">
            {dontGuidelines.map((guideline, index) => (
              <div key={`dont-${index}`} className="flex items-center gap-2">
                <span className="select-none text-gray-500">•</span>
                <CustomInput
                  name={`nonNegotiablesDont-${index}`}
                  value={guideline}
                  onChange={(event) => handleDontGuidelineChange(index, event.target.value)}
                  onKeyDown={(event) => handleDontGuidelineKeyDown(index, event)}
                  placeholder={`Don't #${index + 1}`}
                  className="!py-2"
                />
                {dontGuidelines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDontGuideline(index)}
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <DeleteIcon className="h-4 w-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold not-italic leading-[18px]">Creator Questions</h4>
          <button
            type="button"
            onClick={handleAddQuestion}
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
                  onClick={() => handleRemoveQuestion(i)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <DeleteIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}

export default Description;

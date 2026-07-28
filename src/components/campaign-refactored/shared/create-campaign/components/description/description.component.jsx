"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import FieldError from "@/common/components/field-error/field-error.component";
import FieldLabel from "@/common/components/field-label/field-label.component";
import TextArea from "@/common/components/text-area/text-area.component";
import {
  MAX_IMAGE_UPLOAD_SIZE,
  MAX_STYLE_GUIDE_UPLOAD_SIZE,
} from "@/common/constants/file.constant";
import {
  Check,
  CircleAlert,
  Eye,
  FileUp,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import useDescription from "./use-description.hook";

function UploadSpinner() {
  return (
    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" aria-label="Loading" />
  );
}

function FileActionIcons({ previewUrl, onChange, onDelete, accept, changeLabel, deleteLabel }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded p-1.5 text-gray-600 hover:bg-white hover:text-black"
        aria-label="View"
        title="View"
      >
        <Eye className="h-3.5 w-3.5" />
      </a>
      <label
        className="cursor-pointer rounded p-1.5 text-gray-600 hover:bg-white hover:text-black"
        aria-label={changeLabel}
        title="Change"
      >
        <Upload className="h-3.5 w-3.5" />
        <input type="file" className="hidden" accept={accept} onChange={onChange} />
      </label>
      <button
        type="button"
        onClick={onDelete}
        className="rounded p-1.5 text-red-600 hover:bg-white hover:text-red-700"
        aria-label={deleteLabel}
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function GuidelineList({
  title,
  hint,
  panelClass,
  headerClass,
  icon: Icon,
  items,
  namePrefix,
  placeholderPrefix,
  onChange,
  onKeyDown,
  onRemove,
}) {
  return (
    <div className={`min-w-0 rounded-lg border p-3 ${panelClass}`}>
      <div className={`flex items-start gap-2 rounded-md px-2.5 py-2 ${headerClass}`}>
        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-black">{title}</p>
          <p className="text-[10px] leading-snug text-gray-600">{hint}</p>
        </div>
      </div>
      <div className="mt-2 space-y-1.5">
        {items.map((guideline, index) => (
          <div key={`${namePrefix}-${index}`} className="flex items-center gap-1.5">
            <span className="w-4 shrink-0 text-center text-[10px] font-semibold tabular-nums text-gray-400">
              {index + 1}
            </span>
            <CustomInput
              name={`${namePrefix}-${index}`}
              value={guideline}
              onChange={(event) => onChange(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(index, event)}
              placeholder={`${placeholderPrefix} #${index + 1}`}
            />
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-white hover:text-black"
                aria-label={`Remove ${placeholderPrefix} ${index + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[10px] text-gray-400">Press Enter to add another line.</p>
    </div>
  );
}

function Description({ campaignData, errors = {}, register, setValue }) {
  const {
    questions,
    questionDraft,
    editingQuestionIndex,
    handleQuestionDraftChange,
    handleAddQuestion,
    handleQuestionKeyDown,
    handleEditQuestion,
    handleRemoveQuestion,
    imagePreview,
    styleGuideFileName,
    styleGuidePreview,
    handleImageUpload,
    handleClearImage,
    handleStyleGuideUpload,
    handleClearStyleGuide,
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

  const hasStyleGuide = Boolean(styleGuidePreview || styleGuideFileName);
  const isStyleGuideImage = Boolean(
    styleGuidePreview && /\.(png|jpe?g|webp|gif|bmp|svg)(\?|$)/i.test(styleGuidePreview)
  );

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col gap-3">
          <TextArea
            label="Short Description"
            name="short_description"
            isRequired={true}
            className="w-full !h-auto"
            placeholder="Brief overview of your campaign"
            errors={errors}
            register={register}
          />
          <TextArea
            label="Long Description"
            name="long_description"
            className="w-full !h-auto"
            placeholder="Detailed campaign information"
            errors={errors}
            register={register}
          />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <FieldLabel label="Campaign Image" isRequired />
        <input
          type="hidden"
          value={campaignData?.campaignImage || ""}
          readOnly
          {...register("campaignImage", {
            required: "Campaign image is required.",
          })}
        />

        {isUploadingImage ? (
          <div className="mt-1.5 flex h-9 items-center justify-center rounded-[5px] border border-gray-200 bg-gray-50 sm:h-[40px]">
            <UploadSpinner />
          </div>
        ) : imagePreview ? (
          <div
            className={`pt-1.5 flex h-9 items-center gap-2 rounded-[5px] border border-primary/40 bg-primary/5 px-2 sm:h-[40px] ${
              errors?.campaignImage ? "border-danger" : ""
            }`}
          >
            <img
              src={imagePreview}
              alt="Campaign"
              className="h-7 w-7 shrink-0 rounded object-cover sm:h-8 sm:w-8"
            />
            <span className="min-w-0 flex-1 truncate text-xs text-gray-700">
              Cover image uploaded
            </span>
            <FileActionIcons
              previewUrl={imagePreview}
              onChange={handleImageUpload}
              onDelete={handleClearImage}
              accept="image/*"
              changeLabel="Change image"
              deleteLabel="Delete image"
            />
          </div>
        ) : (
          <label
            className={`mt-1.5 flex h-9 cursor-pointer items-center gap-2.5 rounded-[5px] border border-dashed px-2.5 transition-colors sm:h-[40px] ${
              errors?.campaignImage
                ? "border-danger bg-gray-50"
                : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate text-xs text-gray-700">
              Upload image (max {(MAX_IMAGE_UPLOAD_SIZE / (1024 * 1024)).toFixed(0)}MB)
            </span>
            <span className="shrink-0 text-[10px] font-semibold text-gray-600 sm:text-xs">
              Browse
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        )}

        {errors?.campaignImage?.message ? (
          <FieldError className="pt-2.5" error={errors.campaignImage.message} />
        ) : null}

        <div className="mt-3">
          <TextArea
            label="Hashtags & Captions"
            name="hashtags"
            className="w-full !h-auto"
            placeholder="#cleanbeauty #sponsored #authentic"
            errors={errors}
            register={register}
          />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <TextArea
          label="Style Guidelines"
          name="styleGuide"
          register={register}
          errors={errors}
          className="w-full !h-auto"
          placeholder="Natural lighting, authentic feel, minimal editing..."
        />
        <div className="mt-3">
          <FieldLabel label="Reference File" />
          {isUploadingStyleGuide ? (
            <div className="mt-1.5 flex h-9 items-center justify-center rounded-[5px] border border-gray-200 bg-gray-50 sm:h-[40px]">
              <UploadSpinner />
            </div>
          ) : hasStyleGuide ? (
            <div className="mt-1.5 flex h-9 items-center gap-2 rounded-[5px] border border-primary/40 bg-primary/5 px-2 sm:h-[40px]">
              {isStyleGuideImage ? (
                <img
                  src={styleGuidePreview}
                  alt="Reference"
                  className="h-7 w-7 shrink-0 rounded object-cover sm:h-8 sm:w-8"
                />
              ) : (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white text-primary sm:h-8 sm:w-8">
                  <FileUp className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-xs text-gray-700">
                {styleGuideFileName || "Reference file uploaded"}
              </span>
              <FileActionIcons
                previewUrl={styleGuidePreview}
                onChange={handleStyleGuideUpload}
                onDelete={handleClearStyleGuide}
                accept="image/*,video/*,application/pdf"
                changeLabel="Change reference file"
                deleteLabel="Delete reference file"
              />
            </div>
          ) : (
            <label className="mt-1.5 flex h-9 cursor-pointer items-center gap-2.5 rounded-[5px] border border-dashed border-gray-300 bg-gray-50 px-2.5 transition-colors hover:border-primary hover:bg-primary/5 sm:h-[40px]">
              <FileUp className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 truncate text-xs text-gray-700">
                Upload file (max {(MAX_STYLE_GUIDE_UPLOAD_SIZE / (1024 * 1024)).toFixed(0)}MB)
              </span>
              <span className="shrink-0 text-[10px] font-semibold text-gray-600 sm:text-xs">
                Browse
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,application/pdf"
                onChange={handleStyleGuideUpload}
              />
            </label>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <GuidelineList
            title="Do's"
            hint="What creators should include or follow."
            panelClass="border-emerald-200 bg-emerald-50/40"
            headerClass="bg-emerald-100/80 text-emerald-700"
            icon={Check}
            items={doGuidelines}
            namePrefix="nonNegotiablesDo"
            placeholderPrefix="Do"
            onChange={handleDoGuidelineChange}
            onKeyDown={handleDoGuidelineKeyDown}
            onRemove={handleRemoveDoGuideline}
          />
          <GuidelineList
            title="Don'ts"
            hint="What to avoid in the final content."
            panelClass="border-rose-200 bg-rose-50/40"
            headerClass="bg-rose-100/80 text-rose-700"
            icon={CircleAlert}
            items={dontGuidelines}
            namePrefix="nonNegotiablesDont"
            placeholderPrefix="Don't"
            onChange={handleDontGuidelineChange}
            onKeyDown={handleDontGuidelineKeyDown}
            onRemove={handleRemoveDontGuideline}
          />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <FieldLabel label="Creator Questions" />
        <div className="mt-1.5 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <CustomInput
              type="text"
              name="question_draft"
              value={questionDraft}
              onChange={handleQuestionDraftChange}
              onKeyDown={handleQuestionKeyDown}
              placeholder={
                editingQuestionIndex !== null
                  ? "Edit question and press Enter or Add"
                  : "Type a question for applicants"
              }
            />
          </div>
          <CustomButton
            text={editingQuestionIndex !== null ? "Save" : "Add"}
            startIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={handleAddQuestion}
            className="btn-outline shrink-0"
            disabled={!questionDraft.trim()}
          />
        </div>
        <p className="mt-1.5 text-[10px] leading-snug text-gray-500 sm:text-xs">
          {editingQuestionIndex !== null
            ? "Press Enter or Save to update the question."
            : "Press Enter to add question."}
        </p>

        {questions.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {questions.map((q, i) => (
              <li
                key={`${q}-${i}`}
                className={`flex items-start gap-2 rounded-md bg-gray-200 px-2.5 py-2 ${
                  editingQuestionIndex === i ? "ring-1 ring-primary" : ""
                }`}
              >
                <span className="mt-0.5 select-none text-xs text-gray-600">•</span>
                <span className="min-w-0 flex-1 text-xs leading-snug text-gray-800 sm:text-sm">
                  {q}
                </span>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleEditQuestion(i)}
                    className="rounded p-1 text-gray-600 hover:bg-white hover:text-black"
                    aria-label={`Edit question ${i + 1}`}
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(i)}
                    className="rounded p-1 text-red-600 hover:bg-white hover:text-red-700"
                    aria-label={`Remove question ${i + 1}`}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {uploadError ? <p className="text-xs text-gray-700">{uploadError}</p> : null}
    </div>
  );
}

export default Description;

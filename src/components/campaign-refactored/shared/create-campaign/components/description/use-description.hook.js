import {
  IMAGE_FILE_TYPES,
  MAX_IMAGE_UPLOAD_SIZE,
  MAX_STYLE_GUIDE_UPLOAD_SIZE,
  STYLE_GUIDE_FILE_TYPES,
} from "@/common/constants/file.constant";
import { getUploadedFileUrl, sanitizeGuidelineList } from "@/common/utils/common.utils";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

export default function useDescription({ campaignData, setValue }) {
  const dispatch = useDispatch();

  const [imagePreview, setImagePreview] = useState(campaignData?.campaignImage || "");
  const [styleGuideFileName, setStyleGuideFileName] = useState("");
  const [styleGuidePreview, setStyleGuidePreview] = useState(campaignData?.styleGuideFile || "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingStyleGuide, setIsUploadingStyleGuide] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [questionDraft, setQuestionDraft] = useState("");
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [questions, setQuestions] = useState(() => {
    if (!Array.isArray(campaignData?.questions)) return [];
    return campaignData.questions.filter((question) => String(question || "").trim());
  });

  useEffect(() => {
    const nextImage =
      typeof campaignData?.campaignImage === "string" ? campaignData.campaignImage : "";
    setImagePreview((prev) => (prev === nextImage ? prev : nextImage));
  }, [campaignData?.campaignImage]);

  useEffect(() => {
    const nextStyleGuide =
      typeof campaignData?.styleGuideFile === "string" ? campaignData.styleGuideFile : "";
    setStyleGuidePreview((prev) => (prev === nextStyleGuide ? prev : nextStyleGuide));
  }, [campaignData?.styleGuideFile]);

  useEffect(() => {
    const nextQuestions = Array.isArray(campaignData?.questions)
      ? campaignData.questions.filter((question) => String(question || "").trim())
      : [];
    setQuestions((prev) => {
      if (prev.length === nextQuestions.length && prev.every((q, i) => q === nextQuestions[i])) {
        return prev;
      }
      return nextQuestions;
    });
  }, [campaignData?.questions]);

  const doGuidelines = useMemo(
    () => sanitizeGuidelineList(campaignData?.nonNegotiablesDo),
    [campaignData?.nonNegotiablesDo]
  );

  const dontGuidelines = useMemo(
    () => sanitizeGuidelineList(campaignData?.nonNegotiablesDont),
    [campaignData?.nonNegotiablesDont]
  );

  const handleQuestionDraftChange = useCallback((event) => {
    setQuestionDraft(event?.target?.value ?? "");
  }, []);

  const handleAddQuestion = useCallback(() => {
    const nextQuestion = questionDraft.trim();
    if (!nextQuestion) return;

    let updated;
    if (editingQuestionIndex !== null) {
      updated = questions.map((question, index) =>
        index === editingQuestionIndex ? nextQuestion : question
      );
    } else {
      updated = [...questions, nextQuestion];
    }

    setQuestions(updated);
    setValue("questions", updated, { shouldDirty: true, shouldValidate: false });
    setQuestionDraft("");
    setEditingQuestionIndex(null);
  }, [editingQuestionIndex, questionDraft, questions, setValue]);

  const handleQuestionKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      handleAddQuestion();
    },
    [handleAddQuestion]
  );

  const handleEditQuestion = useCallback(
    (index) => {
      setQuestionDraft(questions[index] || "");
      setEditingQuestionIndex(index);
    },
    [questions]
  );

  const handleRemoveQuestion = useCallback(
    (index) => {
      const updated = questions.filter((_, i) => i !== index);
      setQuestions(updated);
      setValue("questions", updated, { shouldDirty: true, shouldValidate: false });
      if (editingQuestionIndex === index) {
        setQuestionDraft("");
        setEditingQuestionIndex(null);
      } else if (editingQuestionIndex !== null && editingQuestionIndex > index) {
        setEditingQuestionIndex(editingQuestionIndex - 1);
      }
    },
    [editingQuestionIndex, questions, setValue]
  );

  const handleRemoveDoGuideline = useCallback(
    (index) => {
      if (doGuidelines.length <= 1) return;
      const updated = doGuidelines.filter((_, i) => i !== index);
      setValue("nonNegotiablesDo", updated, { shouldDirty: true });
    },
    [doGuidelines, setValue]
  );

  const handleDoGuidelineChange = useCallback(
    (index, value) => {
      const updated = [...doGuidelines];
      updated[index] = value;
      setValue("nonNegotiablesDo", updated, { shouldDirty: true });
    },
    [doGuidelines, setValue]
  );

  const handleDoGuidelineKeyDown = useCallback(
    (index, event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const currentValue = (doGuidelines[index] || "").trim();
      if (!currentValue) return;

      const updated = [...doGuidelines];
      if (index === updated.length - 1 || updated[index + 1]?.trim()) {
        updated.splice(index + 1, 0, "");
        setValue("nonNegotiablesDo", updated, { shouldDirty: true });
      }
    },
    [doGuidelines, setValue]
  );

  const handleRemoveDontGuideline = useCallback(
    (index) => {
      if (dontGuidelines.length <= 1) return;
      const updated = dontGuidelines.filter((_, i) => i !== index);
      setValue("nonNegotiablesDont", updated, { shouldDirty: true });
    },
    [dontGuidelines, setValue]
  );

  const handleDontGuidelineChange = useCallback(
    (index, value) => {
      const updated = [...dontGuidelines];
      updated[index] = value;
      setValue("nonNegotiablesDont", updated, { shouldDirty: true });
    },
    [dontGuidelines, setValue]
  );

  const handleDontGuidelineKeyDown = useCallback(
    (index, event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const currentValue = (dontGuidelines[index] || "").trim();
      if (!currentValue) return;

      const updated = [...dontGuidelines];
      if (index === updated.length - 1 || updated[index + 1]?.trim()) {
        updated.splice(index + 1, 0, "");
        setValue("nonNegotiablesDont", updated, { shouldDirty: true });
      }
    },
    [dontGuidelines, setValue]
  );

  const validateFile = (file, allowedTypes, maxSize) => {
    if (!file) return "No file selected";
    if (!allowedTypes.includes(file.type)) {
      return "Unsupported file type";
    }
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`;
    }
    return "";
  };

  const handleImageUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      const validationMessage = validateFile(file, IMAGE_FILE_TYPES, MAX_IMAGE_UPLOAD_SIZE);
      if (validationMessage) {
        setUploadError(validationMessage);
        setValue("campaignImage", "", { shouldValidate: true, shouldTouch: true });
        return;
      }

      setUploadError("");
      setIsUploadingImage(true);

      const result = await dispatch(
        uploadSingleFile({
          file,
          folder: "campaign",
        })
      );

      if (uploadSingleFile.fulfilled.match(result)) {
        const uploadedUrl = getUploadedFileUrl(result.payload);
        if (uploadedUrl) {
          setImagePreview(uploadedUrl);
          setValue("campaignImage", uploadedUrl, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
          });
          setUploadError("");
        } else {
          setUploadError("Upload succeeded but no URL was returned.");
          setValue("campaignImage", "", { shouldValidate: true, shouldTouch: true });
        }
      } else {
        const message = result.payload?.message || "Failed to upload image.";
        setUploadError(message);
        setValue("campaignImage", "", { shouldValidate: true, shouldTouch: true });
      }

      setIsUploadingImage(false);
      event.target.value = "";
    },
    [dispatch, setValue]
  );

  const handleStyleGuideUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      const validationMessage = validateFile(
        file,
        STYLE_GUIDE_FILE_TYPES,
        MAX_STYLE_GUIDE_UPLOAD_SIZE
      );
      if (validationMessage) {
        setUploadError(validationMessage);
        return;
      }

      setUploadError("");
      setIsUploadingStyleGuide(true);

      const result = await dispatch(
        uploadSingleFile({
          file,
          folder: "campaign",
        })
      );

      if (uploadSingleFile.fulfilled.match(result)) {
        const uploadedUrl = getUploadedFileUrl(result.payload);
        if (uploadedUrl) {
          setStyleGuideFileName(file.name);
          setStyleGuidePreview(uploadedUrl);
          setValue("styleGuideFile", uploadedUrl, { shouldDirty: true });
        } else {
          setUploadError("Upload succeeded but no URL was returned.");
        }
      } else {
        setUploadError(result.payload?.message || "Failed to upload style guide.");
      }
      setIsUploadingStyleGuide(false);
      event.target.value = "";
    },
    [dispatch, setValue]
  );

  const handleClearImage = useCallback(() => {
    setImagePreview("");
    setValue("campaignImage", "", {
      shouldDirty: true,
      shouldValidate: false,
      shouldTouch: false,
    });
  }, [setValue]);

  const handleClearStyleGuide = useCallback(() => {
    setStyleGuideFileName("");
    setStyleGuidePreview("");
    setValue("styleGuideFile", "", { shouldDirty: true });
  }, [setValue]);

  return {
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
  };
}

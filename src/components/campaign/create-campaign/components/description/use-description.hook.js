import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import {
  IMAGE_FILE_TYPES,
  STYLE_GUIDE_FILE_TYPES,
  MAX_IMAGE_UPLOAD_SIZE,
  MAX_STYLE_GUIDE_UPLOAD_SIZE,
} from "@/common/constants/file.constant";

const getUploadedFileUrl = (payload) => {
  if (!payload) return "";
  if (payload.url) return payload.url;
  if (Array.isArray(payload) && payload[0]?.url) return payload[0].url;
  return payload.location || payload.fileUrl || "";
};

const sanitizeGuidelineList = (list) => {
  if (!Array.isArray(list) || list.length === 0) return [""];
  const normalized = list.map((item) => (typeof item === "string" ? item : ""));
  return normalized.length ? normalized : [""];
};

export default function useDescription({ campaignData, setValue }) {
  const dispatch = useDispatch();

  const [imagePreview, setImagePreview] = useState(campaignData?.campaignImage || "");
  const [styleGuideFileName, setStyleGuideFileName] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingStyleGuide, setIsUploadingStyleGuide] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const questions = useMemo(() => {
    const list = campaignData?.questions?.length ? campaignData.questions : [""];
    return [...list];
  }, [campaignData?.questions]);

  const doGuidelines = useMemo(
    () => sanitizeGuidelineList(campaignData?.nonNegotiablesDo),
    [campaignData?.nonNegotiablesDo]
  );

  const dontGuidelines = useMemo(
    () => sanitizeGuidelineList(campaignData?.nonNegotiablesDont),
    [campaignData?.nonNegotiablesDont]
  );

  const handleAddQuestion = useCallback(() => {
    const updated = [...questions, ""];
    setValue("questions", updated, { shouldDirty: true });
  }, [questions, setValue]);

  const handleRemoveQuestion = useCallback(
    (index) => {
      if (questions.length <= 1) return;
      const updated = questions.filter((_, i) => i !== index);
      setValue("questions", updated, { shouldDirty: true });
    },
    [questions, setValue]
  );

  const handleQuestionChange = useCallback(
    (index, value) => {
      const updated = [...questions];
      updated[index] = value;
      setValue("questions", updated, { shouldDirty: true });
    },
    [questions, setValue]
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
          setValue("styleGuideFile", uploadedUrl, { shouldDirty: true });
        } else {
          setUploadError("Upload succeeded but no URL was returned.");
        }
      } else {
        setUploadError(result.payload?.message || "Failed to upload style guide.");
      }
      setIsUploadingStyleGuide(false);
    },
    [dispatch, setValue]
  );

  return {
    questions,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    imagePreview,
    styleGuideFileName,
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
  };
}

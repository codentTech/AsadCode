"use client";

import { useCallback, useEffect, useState } from "react";
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
  if (!Array.isArray(list) || list.length === 0) {
    return [""];
  }
  const normalized = list.map((item) => (typeof item === "string" ? item : ""));
  return normalized.length ? normalized : [""];
};

export default function useDescription({ campaignData, setValue }) {
  const dispatch = useDispatch();

  const [questions, setQuestions] = useState(() => {
    const list = campaignData?.questions?.length ? campaignData.questions : [""];
    return [...list];
  });

  const [imagePreview, setImagePreview] = useState(campaignData?.campaignImage || "");
  const [styleGuideFileName, setStyleGuideFileName] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingStyleGuide, setIsUploadingStyleGuide] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [doGuidelines, setDoGuidelines] = useState(() =>
    sanitizeGuidelineList(campaignData?.nonNegotiablesDo)
  );
  const [dontGuidelines, setDontGuidelines] = useState(() =>
    sanitizeGuidelineList(campaignData?.nonNegotiablesDont)
  );

  useEffect(() => {
    const list = campaignData?.questions?.length ? campaignData.questions : [""];
    setQuestions([...list]);
  }, [campaignData?.questions]);

  useEffect(() => {
    setImagePreview(campaignData?.campaignImage || "");
  }, [campaignData?.campaignImage]);

  useEffect(() => {
    setDoGuidelines(sanitizeGuidelineList(campaignData?.nonNegotiablesDo));
  }, [campaignData?.nonNegotiablesDo]);

  useEffect(() => {
    setDontGuidelines(sanitizeGuidelineList(campaignData?.nonNegotiablesDont));
  }, [campaignData?.nonNegotiablesDont]);

  const updateQuestions = useCallback(
    (updated) => {
      const sanitized = updated.length ? updated : [""];
      setQuestions(sanitized);
      setValue("questions", sanitized);
    },
    [setValue]
  );

  const handleAddQuestion = useCallback(() => {
    updateQuestions([...questions, ""]);
  }, [questions, updateQuestions]);

  const handleRemoveQuestion = useCallback(
    (index) => {
      if (questions.length <= 1) return;
      const updated = questions.filter((_, i) => i !== index);
      updateQuestions(updated);
    },
    [questions, updateQuestions]
  );

  const handleQuestionChange = useCallback(
    (index, value) => {
      const updated = [...questions];
      updated[index] = value;
      updateQuestions(updated);
    },
    [questions, updateQuestions]
  );

  const updateDoGuidelines = useCallback(
    (updated) => {
      const sanitized = sanitizeGuidelineList(updated);
      setDoGuidelines(sanitized);
      setValue("nonNegotiablesDo", sanitized, { shouldDirty: true });
    },
    [setValue]
  );

  const updateDontGuidelines = useCallback(
    (updated) => {
      const sanitized = sanitizeGuidelineList(updated);
      setDontGuidelines(sanitized);
      setValue("nonNegotiablesDont", sanitized, { shouldDirty: true });
    },
    [setValue]
  );

  const handleRemoveDoGuideline = useCallback(
    (index) => {
      if (doGuidelines.length <= 1) return;
      const updated = doGuidelines.filter((_, i) => i !== index);
      updateDoGuidelines(updated);
    },
    [doGuidelines, updateDoGuidelines]
  );

  const handleDoGuidelineChange = useCallback(
    (index, value) => {
      const updated = [...doGuidelines];
      updated[index] = value;
      updateDoGuidelines(updated);
    },
    [doGuidelines, updateDoGuidelines]
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
        updateDoGuidelines(updated);
      }
    },
    [doGuidelines, updateDoGuidelines]
  );

  const handleRemoveDontGuideline = useCallback(
    (index) => {
      if (dontGuidelines.length <= 1) return;
      const updated = dontGuidelines.filter((_, i) => i !== index);
      updateDontGuidelines(updated);
    },
    [dontGuidelines, updateDontGuidelines]
  );

  const handleDontGuidelineChange = useCallback(
    (index, value) => {
      const updated = [...dontGuidelines];
      updated[index] = value;
      updateDontGuidelines(updated);
    },
    [dontGuidelines, updateDontGuidelines]
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
        updateDontGuidelines(updated);
      }
    },
    [dontGuidelines, updateDontGuidelines]
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

      try {
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
      } catch (error) {
        setUploadError(error?.message || "Failed to upload image.");
        setValue("campaignImage", "", { shouldValidate: true, shouldTouch: true });
      } finally {
        setIsUploadingImage(false);
        event.target.value = "";
      }
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

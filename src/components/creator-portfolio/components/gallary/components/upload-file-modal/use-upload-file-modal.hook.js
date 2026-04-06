import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadFileThunk,
  resetUploadFileState,
  selectUploadFile,
} from "@/provider/features/gallery/gallery.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";

const FILE_TYPES = [
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
];

const initialFormData = {
  file_type: "video",
  title: "",
  caption: "",
  tags: "",
  niche_id: "",
  niche_name: "",
  duration: "",
};

export default function useUploadFileModal({ show, onClose, niches = [] }) {
  const dispatch = useDispatch();
  const uploadFileState = useSelector(selectUploadFile);

  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!show) {
      setFormData(initialFormData);
      setSelectedFile(null);
      setFilePreview(null);
      setIsUploading(false);
      dispatch(resetUploadFileState());
    }
  }, [show, dispatch]);

  useEffect(() => {
    if (uploadFileState.isSuccess && show) {
      onClose();
    }
  }, [uploadFileState.isSuccess, show, onClose]);

  const handleChange = useCallback(
    (field, value) => {
      if (field === "niche_id") {
        const selected = niches.find((n) => n.id === value);
        setFormData((prev) => ({
          ...prev,
          niche_id: value,
          niche_name: selected?.name || "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    },
    [niches]
  );

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const isVideo = file.type.startsWith("video/");
    setFormData((prev) => ({
      ...prev,
      file_type: isVideo ? "video" : "image",
    }));

    if (!isVideo) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    e.target.value = "";
  }, []);

  const nicheOptions = useMemo(
    () => niches.map((n) => ({ label: n.name, value: n.id })),
    [niches]
  );

  const requiresNiche = nicheOptions.length > 0;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedFile) return;
      if (requiresNiche && !formData.niche_id) return;

      setIsUploading(true);

      const uploadResult = await dispatch(
        uploadSingleFile({ file: selectedFile, folder: "creator" })
      );

      setIsUploading(false);

      if (uploadResult.meta.requestStatus !== "fulfilled") return;

      const fileUrl = uploadResult.payload?.url;
      if (!fileUrl) return;

      const payload = {
        file_type: formData.file_type,
        file_url: fileUrl,
        thumbnail_url: formData.file_type === "image" ? fileUrl : undefined,
        title: formData.title || undefined,
        caption: formData.caption || undefined,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        niche_id: formData.niche_id || undefined,
        niche_name: formData.niche_name || undefined,
        duration: formData.duration ? parseInt(formData.duration, 10) : undefined,
      };

      dispatch(uploadFileThunk(payload));
    },
    [dispatch, formData, selectedFile, requiresNiche]
  );

  const handleClose = useCallback(() => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setFilePreview(null);
    setIsUploading(false);
    dispatch(resetUploadFileState());
    onClose();
  }, [dispatch, onClose]);

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    formData,
    handleChange,
    handleSubmit,
    handleClose,
    handleFileSelect,
    handleBrowse,
    fileInputRef,
    selectedFile,
    filePreview,
    fileTypes: FILE_TYPES,
    nicheOptions,
    requiresNiche,
    isLoading: isUploading || uploadFileState.isLoading,
  };
}

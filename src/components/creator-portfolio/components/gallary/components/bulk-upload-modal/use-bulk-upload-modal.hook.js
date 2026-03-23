import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadFileThunk,
  resetUploadFileState,
  selectUploadFile,
} from "@/provider/features/gallery/gallery.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";

const initialFormData = {
  file_type: "video",
  niche_id: "",
  niche_name: "",
};

export default function useBulkUploadModal({ show, onClose, niches = [] }) {
  const dispatch = useDispatch();
  const uploadFileState = useSelector(selectUploadFile);

  const [formData, setFormData] = useState(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!show) {
      setFormData(initialFormData);
      setSelectedFiles([]);
      setUploadProgress(0);
      setTotalFiles(0);
      setIsUploading(false);
      setIsDone(false);
      dispatch(resetUploadFileState());
    }
  }, [show, dispatch]);

  useEffect(() => {
    if (isDone && show) {
      onClose();
    }
  }, [isDone, show, onClose]);

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

  const handleFilesSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSelectedFiles(files);
    e.target.value = "";
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedFiles.length) return;

      setIsUploading(true);
      setTotalFiles(selectedFiles.length);
      setUploadProgress(0);

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const isVideo = file.type.startsWith("video/");
        const fileType = isVideo ? "video" : "image";

        const uploadResult = await dispatch(
          uploadSingleFile({ file, folder: "creator" })
        );

        if (uploadResult.meta.requestStatus !== "fulfilled") {
          setUploadProgress(i + 1);
          continue;
        }

        const fileUrl = uploadResult.payload?.url;
        if (!fileUrl) {
          setUploadProgress(i + 1);
          continue;
        }

        await dispatch(
          uploadFileThunk({
            file_type: fileType,
            file_url: fileUrl,
            thumbnail_url: fileType === "image" ? fileUrl : undefined,
            niche_id: formData.niche_id || undefined,
            niche_name: formData.niche_name || undefined,
          })
        );

        setUploadProgress(i + 1);
      }

      setIsUploading(false);
      setIsDone(true);
    },
    [dispatch, formData, selectedFiles]
  );

  const handleClose = useCallback(() => {
    if (isUploading) return;
    setFormData(initialFormData);
    setSelectedFiles([]);
    setUploadProgress(0);
    setTotalFiles(0);
    setIsUploading(false);
    setIsDone(false);
    dispatch(resetUploadFileState());
    onClose();
  }, [dispatch, isUploading, onClose]);

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const nicheOptions = useMemo(
    () => niches.map((n) => ({ label: n.name, value: n.id })),
    [niches]
  );

  return {
    formData,
    handleChange,
    handleSubmit,
    handleClose,
    handleFilesSelect,
    handleRemoveFile,
    handleBrowse,
    fileInputRef,
    selectedFiles,
    uploadProgress,
    totalFiles,
    isUploading,
    nicheOptions,
  };
}

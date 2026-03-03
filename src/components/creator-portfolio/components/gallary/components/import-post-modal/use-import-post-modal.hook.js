import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  importPostThunk,
  resetImportPostState,
  selectImportPost,
} from "@/provider/features/gallery/gallery.slice";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
];

const initialFormData = {
  platform: "instagram",
  post_url: "",
  niche_id: "",
  niche_name: "",
};

export default function useImportPostModal({ show, onClose, niches = [] }) {
  const dispatch = useDispatch();
  const importPostState = useSelector(selectImportPost);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!show) {
      setFormData(initialFormData);
      dispatch(resetImportPostState());
    }
  }, [show, dispatch]);

  useEffect(() => {
    if (importPostState.isSuccess && show) {
      onClose();
    }
  }, [importPostState.isSuccess, show, onClose]);

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

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(importPostThunk(formData));
    },
    [dispatch, formData]
  );

  const handleClose = useCallback(() => {
    setFormData(initialFormData);
    dispatch(resetImportPostState());
    onClose();
  }, [dispatch, onClose]);

  const nicheOptions = useMemo(
    () => niches.map((n) => ({ label: n.name, value: n.id })),
    [niches]
  );

  return {
    formData,
    handleChange,
    handleSubmit,
    handleClose,
    platformOptions: PLATFORMS,
    nicheOptions,
    isLoading: importPostState.isLoading,
  };
}

import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";

const useProfileTab = ({ setProfileData }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleProfileFieldChange = useCallback(
    (field, value) => {
      setProfileData((prev) => ({ ...prev, [field]: value }));
    },
    [setProfileData]
  );

  const handleProfilePicChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setProfileData((prev) => ({ ...prev, profilePicLoading: true }));

      const result = await dispatch(uploadSingleFile({ file, folder: "creator" }));

      setProfileData((prev) => ({
        ...prev,
        profilePic: result?.payload?.url || prev.profilePic,
        profilePicLoading: false,
      }));
    },
    [dispatch, setProfileData]
  );

  const handleMiniCardRemove = useCallback(
    (index) => {
      setProfileData((prev) => {
        const newMiniCards = [...prev.miniCards];
        newMiniCards[index] = null;
        return { ...prev, miniCards: newMiniCards };
      });
    },
    [setProfileData]
  );

  const handleMiniCardUpload = useCallback(
    async (index) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = false;

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileData((prev) => {
          const newLoading = [...prev.miniCardsLoading];
          newLoading[index] = true;
          return { ...prev, miniCardsLoading: newLoading };
        });

        const result = await dispatch(uploadSingleFile({ file, folder: "creator" }));

        setProfileData((prev) => {
          const newMiniCards = [...prev.miniCards];
          const newLoading = [...prev.miniCardsLoading];
          if (result?.payload?.url) newMiniCards[index] = result.payload.url;
          newLoading[index] = false;
          return { ...prev, miniCards: newMiniCards, miniCardsLoading: newLoading };
        });
      };

      input.click();
    },
    [dispatch, setProfileData]
  );

  return {
    fileInputRef,
    handleProfileFieldChange,
    handleProfilePicChange,
    handleMiniCardUpload,
    handleMiniCardRemove,
  };
};

export default useProfileTab;

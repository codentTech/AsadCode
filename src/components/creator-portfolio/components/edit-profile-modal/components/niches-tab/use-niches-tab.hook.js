import { useCallback, useState } from "react";

const useNichesTab = ({ profileData, setProfileData }) => {
  const [showNicheInput, setShowNicheInput] = useState(false);
  const [newNiche, setNewNiche] = useState("");

  const addNiche = useCallback(() => {
    const trimmed = newNiche.trim();
    if (trimmed && !profileData.niches.includes(trimmed)) {
      setProfileData((prev) => ({ ...prev, niches: [...prev.niches, trimmed] }));
      setNewNiche("");
      setShowNicheInput(false);
    }
  }, [newNiche, profileData.niches, setProfileData]);

  const removeNiche = useCallback(
    (niche) => {
      setProfileData((prev) => ({
        ...prev,
        niches: prev.niches.filter((n) => n !== niche),
      }));
    },
    [setProfileData]
  );

  return {
    showNicheInput,
    setShowNicheInput,
    newNiche,
    setNewNiche,
    addNiche,
    removeNiche,
  };
};

export default useNichesTab;

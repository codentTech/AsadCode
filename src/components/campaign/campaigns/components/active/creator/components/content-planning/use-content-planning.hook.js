import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createContentPlanner,
  getAllContentPlanners,
  updateContentPlanner,
  deleteContentPlanner,
  createContentPlannerSection,
  updateContentPlannerSection,
  deleteContentPlannerSection,
} from "@/provider/features/content-planner/content-planner.slice";

const DEFAULT_SECTION_NAMES = ["Hook Ideas", "Script", "Shot Ideas", "General Notes"];

export default function useContentPlanning(selectedCampaign) {
  const dispatch = useDispatch();

  const {
    contentPlanners: storedPlanners,
    getAllContentPlanners: getAllContentPlannersState,
    createContentPlanner: createContentPlannerState,
    updateContentPlanner: updateContentPlannerState,
    deleteContentPlanner: deleteContentPlannerState,
    createContentPlannerSection: createContentPlannerSectionState,
    updateContentPlannerSection: updateContentPlannerSectionState,
    deleteContentPlannerSection: deleteContentPlannerSectionState,
  } = useSelector((state) => state.contentPlanner);

  const [showContentPlanner, setShowContentPlanner] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showAddTitle, setShowAddTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedPlannerId, setSelectedPlannerId] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);

  const [sectionContent, setSectionContent] = useState({});
  const sectionContentRef = useRef({});

  useEffect(() => {
    dispatch(getAllContentPlanners());
  }, [dispatch, selectedCampaign?.id]);

  const campaignPlanners = useMemo(
    () => (storedPlanners || []).filter((planner) => planner.campaign?.id === selectedCampaign?.id),
    [storedPlanners, selectedCampaign?.id]
  );

  useEffect(() => {
    if (!selectedPlannerId && campaignPlanners.length > 0) {
      setSelectedPlannerId(campaignPlanners[0].id);
    } else if (
      selectedPlannerId &&
      !campaignPlanners.some((planner) => planner.id === selectedPlannerId)
    ) {
      setSelectedPlannerId(campaignPlanners[0]?.id ?? null);
    }
  }, [campaignPlanners, selectedPlannerId]);

  const selectedPlanner = useMemo(() => {
    if (!selectedPlannerId) return null;
    return campaignPlanners.find((planner) => planner.id === selectedPlannerId) || null;
  }, [campaignPlanners, selectedPlannerId]);

  useEffect(() => {
    if (!selectedPlanner) {
      setSectionContent({});
      sectionContentRef.current = {};
      setActiveSectionId(null);
      return;
    }

    const contentMap = {};
    (selectedPlanner.sections || []).forEach((section) => {
      contentMap[section.id] = section.content || "";
    });

    setSectionContent(contentMap);
    sectionContentRef.current = contentMap;

    if (selectedPlanner.sections?.length) {
      const hasCurrentActive = selectedPlanner.sections.some(
        (section) => section.id === activeSectionId
      );
      setActiveSectionId(hasCurrentActive ? activeSectionId : selectedPlanner.sections[0].id);
    } else {
      setActiveSectionId(null);
    }
  }, [selectedPlanner, activeSectionId]);

  const handleSectionContentChange = useCallback((sectionId, content) => {
    setSectionContent((prev) => {
      const next = { ...prev, [sectionId]: content };
      sectionContentRef.current = next;
      return next;
    });
  }, []);

  const handleSectionContentSave = useCallback(
    async (sectionId, content) => {
      if (!sectionId) return;
      await dispatch(
        updateContentPlannerSection({
          sectionId,
          payload: { content },
        })
      );
    },
    [dispatch]
  );

  const handleCreateContentPlanner = useCallback(
    async (title) => {
      if (!selectedCampaign?.id || !title.trim()) return null;
      const response = await dispatch(
        createContentPlanner({
          campaignId: selectedCampaign.id,
          contentPlannerData: {
            title: title.trim(),
          },
        })
      ).unwrap();
      return response?.data ?? null;
    },
    [dispatch, selectedCampaign]
  );

  const handleUpdatePlannerTitle = useCallback(
    async (plannerId, title) => {
      if (!plannerId || !title.trim()) return;
      await dispatch(
        updateContentPlanner({
          id: plannerId,
          updateData: { title: title.trim() },
        })
      );
    },
    [dispatch]
  );

  const handleAddSection = useCallback(async () => {
    if (!selectedPlanner?.id) return null;

    const existingTitles = new Set(
      (selectedPlanner.sections || []).map((section) => section.title.toLowerCase())
    );

    const fallbackTitle = `New Section ${(selectedPlanner.sections?.length || 0) + 1}`;

    const defaultTitle =
      DEFAULT_SECTION_NAMES.find((name) => !existingTitles.has(name.toLowerCase())) ||
      fallbackTitle;

    const result = await dispatch(
      createContentPlannerSection({
        plannerId: selectedPlanner.id,
        payload: {
          title: defaultTitle,
          content: "",
          position: selectedPlanner.sections?.length || 0,
        },
      })
    ).unwrap();

    const newSection = result?.data;
    if (newSection?.id) {
      setActiveSectionId(newSection.id);
    }
    return newSection;
  }, [dispatch, selectedPlanner]);

  const handleDeleteSection = useCallback(
    async (sectionId) => {
      if (!sectionId) return;
      await dispatch(deleteContentPlannerSection(sectionId)).unwrap();
      if (sectionId === activeSectionId) {
        setActiveSectionId(null);
      }
    },
    [dispatch, activeSectionId]
  );

  const handleRenameSection = useCallback(
    async (sectionId, title) => {
      if (!sectionId || !title.trim()) return;
      await dispatch(
        updateContentPlannerSection({
          sectionId,
          payload: { title: title.trim() },
        })
      ).unwrap();
    },
    [dispatch]
  );

  const openContentPlanner = useCallback(() => setShowContentPlanner(true), []);
  const closeContentPlanner = useCallback(() => setShowContentPlanner(false), []);
  const openCalendar = useCallback(() => setShowCalendar(true), []);
  const closeCalendar = useCallback(() => setShowCalendar(false), []);
  const openGoals = useCallback(() => setShowGoals(true), []);
  const closeGoals = useCallback(() => setShowGoals(false), []);

  const handleAddTitle = useCallback(() => {
    setShowAddTitle(true);
    setIsEditingTitle(false);
    setNewTitle("");
  }, []);

  const handleSaveTitle = useCallback(async () => {
    if (!newTitle.trim()) return;
    const newPlanner = await handleCreateContentPlanner(newTitle.trim());
    setNewTitle("");
    setShowAddTitle(false);
    setIsEditingTitle(false);
    if (newPlanner?.id) {
      setSelectedPlannerId(newPlanner.id);
      setShowContentPlanner(true);
    }
  }, [handleCreateContentPlanner, newTitle]);

  const handleCancelAddTitle = useCallback(() => {
    setNewTitle("");
    setShowAddTitle(false);
    setIsEditingTitle(false);
  }, []);

  const handleSelectPlanner = useCallback((planner) => {
    if (!planner?.id) return;
    setSelectedPlannerId(planner.id);
    setShowContentPlanner(true);
    setShowAddTitle(false);
    setIsEditingTitle(false);
  }, []);

  const handleNewTitleChange = useCallback((event) => {
    setNewTitle(event.target.value);
  }, []);

  const handleDeletePlanner = useCallback(
    async (plannerId) => {
      if (!plannerId) return;
      await dispatch(deleteContentPlanner(plannerId)).unwrap();
      if (plannerId === selectedPlannerId) {
        setSelectedPlannerId(null);
        setActiveSectionId(null);
      }
    },
    [dispatch, selectedPlannerId]
  );

  const handleEditTitle = useCallback((planner) => {
    if (!planner) return;
    setSelectedPlannerId(planner.id);
    setNewTitle(planner.title);
    setShowAddTitle(true);
    setIsEditingTitle(true);
  }, []);

  const handleUpdateTitle = useCallback(async () => {
    if (!isEditingTitle || !newTitle.trim() || !selectedPlannerId) return;
    await handleUpdatePlannerTitle(selectedPlannerId, newTitle.trim());
    setNewTitle("");
    setShowAddTitle(false);
    setIsEditingTitle(false);
  }, [handleUpdatePlannerTitle, isEditingTitle, newTitle, selectedPlannerId]);

  const plannerSections = selectedPlanner?.sections || [];

  return {
    showContentPlanner,
    showCalendar,
    showGoals,
    contentPlanners: campaignPlanners,
    selectedPlanner,
    plannerSections,
    activeSectionId,
    sectionContent,
    showAddTitle,
    newTitle,
    isEditingTitle,
    getAllContentPlannersState,
    createContentPlannerState,
    updateContentPlannerState,
    deleteContentPlannerState,
    createContentPlannerSectionState,
    updateContentPlannerSectionState,
    deleteContentPlannerSectionState,
    setActiveSectionId,
    handleSectionContentChange,
    handleSectionContentSave,
    handleAddSection,
    handleDeleteSection,
    handleRenameSection,
    openContentPlanner,
    closeContentPlanner,
    openCalendar,
    closeCalendar,
    openGoals,
    closeGoals,
    handleAddTitle,
    handleSaveTitle,
    handleCancelAddTitle,
    handleSelectPlanner,
    handleNewTitleChange,
    handleDeletePlanner,
    handleEditTitle,
    handleUpdateTitle,
  };
}

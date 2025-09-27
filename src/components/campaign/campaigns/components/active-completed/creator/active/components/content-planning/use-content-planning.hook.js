import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createContentPlanner,
  getAllContentPlanners,
  updateContentPlanner,
  deleteContentPlanner,
} from "@/provider/features/content-planner/content-planner.slice";

export default function useContentPlanning(selectedCampaign) {
  const dispatch = useDispatch();

  // Redux state
  const {
    getAllContentPlanners: getAllContentPlannersState,
    createContentPlanner: createContentPlannerState,
    updateContentPlanner: updateContentPlannerState,
    deleteContentPlanner: deleteContentPlannerState,
  } = useSelector((state) => state.contentPlanner);

  // Local state
  const [showContentPlanner, setShowContentPlanner] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [activePlannerTab, setActivePlannerTab] = useState("Hook Ideas");
  const [showAddTitle, setShowAddTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedPlanner, setSelectedPlanner] = useState(null);

  // Ref to track current content for auto-save
  const plannerContentRef = useRef({
    "Hook Ideas": "",
    Script: "",
    "Shot Ideas": "",
    "General Notes": "",
  });

  // Ref to store timeout ID for cleanup
  const saveTimeoutRef = useRef(null);

  // Content planners data
  const contentPlanners = getAllContentPlannersState.data || [];

  // Load content planners when campaign is selected
  useEffect(() => {
    dispatch(getAllContentPlanners());
  }, [dispatch, selectedCampaign?.id]);

  // Filter planners for the selected campaign
  const campaignPlanners = (contentPlanners || []).filter(
    (planner) => planner.campaign?.id === selectedCampaign?.id
  );

  // Initialize planner content from API data or defaults
  const getPlannerContent = useCallback(() => {
    if (selectedPlanner) {
      return {
        "Hook Ideas": selectedPlanner.hook_ideas || "",
        Script: selectedPlanner.script || "",
        "Shot Ideas": selectedPlanner.shot_ideas || "",
        "General Notes": selectedPlanner.general_notes || "",
      };
    }
    return {
      "Hook Ideas": "",
      Script: "",
      "Shot Ideas": "",
      "General Notes": "",
    };
  }, [selectedPlanner]);

  const [plannerContent, setPlannerContent] = useState(getPlannerContent());

  // Update planner content when API data changes
  useEffect(() => {
    setPlannerContent(getPlannerContent());
  }, [getPlannerContent]);

  // Sync ref with planner content state
  useEffect(() => {
    plannerContentRef.current = plannerContent;
  }, [plannerContent]);

  // Update ref whenever planner content changes
  const updateRef = useCallback((newContent) => {
    plannerContentRef.current = newContent;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Create content planner
  const handleCreateContentPlanner = useCallback(
    async (contentData) => {
      if (!selectedCampaign?.id) return;

      const contentPlannerData = {
        title: contentData.title,
        hook_ideas: contentData.hook_ideas || "",
        script: contentData.script || "",
        shot_ideas: contentData.shot_ideas || "",
        general_notes: contentData.general_notes || "",
      };

      await dispatch(
        createContentPlanner({
          campaignId: selectedCampaign.id,
          contentPlannerData,
        })
      );
    },
    [dispatch, selectedCampaign]
  );

  // Update content planner
  const handleUpdateContentPlanner = useCallback(
    async (contentData) => {
      if (!selectedPlanner?.id) {
        // Create new content planner if it doesn't exist
        await handleCreateContentPlanner(contentData);
        return;
      }

      const updateData = {
        title: contentData.title || selectedPlanner.title,
        hook_ideas: contentData.hook_ideas || selectedPlanner.hook_ideas || "",
        script: contentData.script || selectedPlanner.script || "",
        shot_ideas: contentData.shot_ideas || selectedPlanner.shot_ideas || "",
        general_notes: contentData.general_notes || selectedPlanner.general_notes || "",
      };

      await dispatch(
        updateContentPlanner({
          id: selectedPlanner.id,
          updateData,
        })
      );
    },
    [dispatch, selectedPlanner, handleCreateContentPlanner]
  );

  // Handle content change and auto-save
  const handleContentChangeAndSave = useCallback(
    async (tab, content) => {
      // Update local state
      setPlannerContent((prev) => ({
        ...prev,
        [tab]: content,
      }));

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Auto-save to backend after a small delay to ensure state is updated
      if (selectedCampaign?.id && selectedPlanner?.id) {
        saveTimeoutRef.current = setTimeout(async () => {
          // Get the current state from the ref (which should be updated by now)
          const currentContent = plannerContentRef.current;

          const contentData = {
            title: selectedPlanner.title,
            hook_ideas: currentContent["Hook Ideas"] || "",
            script: currentContent["Script"] || "",
            shot_ideas: currentContent["Shot Ideas"] || "",
            general_notes: currentContent["General Notes"] || "",
          };

          console.log("Saving content data:", contentData); // Debug log

          try {
            await handleUpdateContentPlanner(contentData);
          } catch (error) {
            console.error("Error saving content:", error);
          }
        }, 100); // Small delay to ensure state is updated
      }
    },
    [selectedCampaign, selectedPlanner, handleUpdateContentPlanner]
  );

  // Handle content change
  const handleContentChange = useCallback((tab, content) => {
    setPlannerContent((prev) => {
      const updatedContent = {
        ...prev,
        [tab]: content,
      };
      plannerContentRef.current = updatedContent;
      return updatedContent;
    });
  }, []);

  // Auto-save content
  const handleAutoSave = useCallback(
    async (tab, content) => {
      if (!selectedCampaign?.id || !selectedPlanner?.id) return;

      const contentData = {
        title: selectedPlanner.title, // Use the existing planner's title
        hook_ideas: tab === "Hook Ideas" ? content : plannerContent["Hook Ideas"] || "",
        script: tab === "Script" ? content : plannerContent["Script"] || "",
        shot_ideas: tab === "Shot Ideas" ? content : plannerContent["Shot Ideas"] || "",
        general_notes: tab === "General Notes" ? content : plannerContent["General Notes"] || "",
      };

      await handleUpdateContentPlanner(contentData);
    },
    [selectedCampaign, selectedPlanner, plannerContent, handleUpdateContentPlanner]
  );

  // Modal handlers
  const openContentPlanner = useCallback(() => {
    setShowContentPlanner(true);
  }, []);

  const closeContentPlanner = useCallback(() => {
    setShowContentPlanner(false);
  }, []);

  const openCalendar = useCallback(() => {
    setShowCalendar(true);
  }, []);

  const closeCalendar = useCallback(() => {
    setShowCalendar(false);
  }, []);

  const openGoals = useCallback(() => {
    setShowGoals(true);
  }, []);

  const closeGoals = useCallback(() => {
    setShowGoals(false);
  }, []);

  // Add title functionality
  const handleAddTitle = useCallback(() => {
    setShowAddTitle(true);
  }, []);

  const handleSaveTitle = useCallback(async () => {
    if (newTitle.trim()) {
      const contentData = {
        title: newTitle.trim(),
        hook_ideas: "",
        script: "",
        shot_ideas: "",
        general_notes: "",
      };
      await handleCreateContentPlanner(contentData);
      setNewTitle("");
      setShowAddTitle(false);
      // Refresh the planners list
      dispatch(getAllContentPlanners());
    }
  }, [newTitle, handleCreateContentPlanner, dispatch]);

  const handleCancelAddTitle = useCallback(() => {
    setNewTitle("");
    setShowAddTitle(false);
  }, []);

  const handleSelectPlanner = useCallback((planner) => {
    setSelectedPlanner(planner);
    setActivePlannerTab("Hook Ideas");
    setShowContentPlanner(true);
  }, []);

  const handleNewTitleChange = useCallback((e) => {
    setNewTitle(e.target.value);
  }, []);

  // Delete content planner
  const handleDeletePlanner = useCallback(
    async (plannerId) => {
      await dispatch(deleteContentPlanner(plannerId));
      // Refresh the planners list
      dispatch(getAllContentPlanners());
    },
    [dispatch]
  );

  // Edit title functionality
  const handleEditTitle = useCallback((planner) => {
    setSelectedPlanner(planner);
    setNewTitle(planner.title);
    setShowAddTitle(true);
  }, []);

  // Update title
  const handleUpdateTitle = useCallback(async () => {
    if (newTitle.trim() && selectedPlanner) {
      const updateData = {
        title: newTitle.trim(),
        hook_ideas: selectedPlanner.hook_ideas || "",
        script: selectedPlanner.script || "",
        shot_ideas: selectedPlanner.shot_ideas || "",
        general_notes: selectedPlanner.general_notes || "",
      };

      await dispatch(
        updateContentPlanner({
          id: selectedPlanner.id,
          updateData,
        })
      );

      setNewTitle("");
      setShowAddTitle(false);
      setSelectedPlanner(null);
      // Refresh the planners list
      dispatch(getAllContentPlanners());
    }
  }, [newTitle, selectedPlanner, dispatch]);

  return {
    // State
    showContentPlanner,
    showCalendar,
    showGoals,
    activePlannerTab,
    plannerContent,
    contentPlanners: campaignPlanners,
    showAddTitle,
    newTitle,
    selectedPlanner,

    // Redux states
    getAllContentPlannersState,
    createContentPlannerState,
    updateContentPlannerState,
    deleteContentPlannerState,

    // Actions
    setActivePlannerTab,
    handleContentChange,
    handleContentChangeAndSave,
    handleAutoSave,
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

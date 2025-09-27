import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMonthlyGoal,
  getAllMonthlyGoals,
  getMonthlyGoalsByCampaign,
  updateMonthlyGoal,
  deleteMonthlyGoal,
} from "@/provider/features/monthly-goals/monthly-goal.slice";

export default function useMonthlyGoals(selectedCampaign) {
  const dispatch = useDispatch();

  // Redux state
  const {
    monthlyGoals: monthlyGoalsState,
    createMonthlyGoal: createMonthlyGoalState,
    updateMonthlyGoal: updateMonthlyGoalState,
    deleteMonthlyGoal: deleteMonthlyGoalState,
    getMonthlyGoalsByCampaign: getMonthlyGoalsByCampaignState,
    getAllMonthlyGoals: getAllMonthlyGoalsState,
  } = useSelector((state) => state.monthlyGoals);

  // Local state
  const [goalMonth, setGoalMonth] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Monthly goals data
  const monthlyGoals = getAllMonthlyGoalsState.data || [];

  // Load monthly goals when campaign or month/year changes
  useEffect(() => {
    if (selectedCampaign?.id) {
      dispatch(
        getMonthlyGoalsByCampaign({
          campaignId: selectedCampaign.id,
          month: goalMonth.month,
          year: goalMonth.year,
        })
      );
    }
  }, [dispatch, selectedCampaign?.id, goalMonth.month, goalMonth.year]);

  // Get goals for current campaign and month/year
  const campaignGoals = getMonthlyGoalsByCampaignState.data || [];

  // Organize goals by week
  const goalsByWeek = {
    week1: campaignGoals.filter((goal) => goal.week_number === 1),
    week2: campaignGoals.filter((goal) => goal.week_number === 2),
    week3: campaignGoals.filter((goal) => goal.week_number === 3),
    week4: campaignGoals.filter((goal) => goal.week_number === 4),
  };

  // Navigate goal month
  const navigateGoalMonth = useCallback((direction) => {
    setGoalMonth((prev) => {
      const newMonth = direction === "next" ? prev.month + 1 : prev.month - 1;
      if (newMonth > 12) return { month: 1, year: prev.year + 1 };
      if (newMonth < 1) return { month: 12, year: prev.year - 1 };
      return { ...prev, month: newMonth };
    });
  }, []);

  // Add goal
  const addGoal = useCallback(
    async (weekNumber, goalData = null) => {
      if (!selectedCampaign?.id) return;

      const defaultGoalData = {
        title: "",
        completed: false,
        week_number: weekNumber,
        month: goalMonth.month,
        year: goalMonth.year,
      };

      const finalGoalData = goalData || defaultGoalData;

      await dispatch(
        createMonthlyGoal({
          campaignId: selectedCampaign.id,
          monthlyGoalData: finalGoalData,
        })
      );
    },
    [dispatch, selectedCampaign?.id, goalMonth.month, goalMonth.year]
  );

  // Update goal
  const updateGoal = useCallback(
    async (goalId, updateData) => {
      await dispatch(
        updateMonthlyGoal({
          id: goalId,
          updateData,
        })
      );
    },
    [dispatch]
  );

  // Toggle goal completion
  const toggleGoalCompletion = useCallback(
    async (goal) => {
      await updateGoal(goal.id, {
        ...goal,
        completed: !goal.completed,
      });
    },
    [updateGoal]
  );

  // Update goal title
  const updateGoalTitle = useCallback(
    async (goal, newTitle) => {
      await updateGoal(goal.id, {
        ...goal,
        title: newTitle,
      });
    },
    [updateGoal]
  );

  // Delete goal
  const deleteGoal = useCallback(
    async (goalId) => {
      await dispatch(deleteMonthlyGoal(goalId));
    },
    [dispatch]
  );

  return {
    // State
    goalMonth,
    goalsByWeek,
    campaignGoals,

    // Redux states
    createMonthlyGoalState,
    updateMonthlyGoalState,
    deleteMonthlyGoalState,
    getMonthlyGoalsByCampaignState,
    getAllMonthlyGoalsState,

    // Actions
    navigateGoalMonth,
    addGoal,
    updateGoal,
    toggleGoalCompletion,
    updateGoalTitle,
    deleteGoal,
  };
}

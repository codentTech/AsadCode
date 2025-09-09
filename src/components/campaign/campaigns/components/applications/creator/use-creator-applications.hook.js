import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCreatorApplications,
  withdrawApplication,
} from "@/provider/features/campaigns/campaigns.slice";

function useCreatorApplications() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("pending");

  // Get creator applications state from Redux
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isSuccess: applicationsSuccess,
    isError: applicationsError,
  } = useSelector((state) => state.campaigns.getCreatorApplications || {});

  // Get withdraw application state from Redux
  const {
    isLoading: withdrawLoading,
    isSuccess: withdrawSuccess,
    isError: withdrawError,
  } = useSelector((state) => state.campaigns.withdrawApplication || {});

  // Function to fetch creator applications
  const fetchCreatorApplications = useCallback(
    (status) => {
      dispatch(getCreatorApplications(status));
    },
    [dispatch]
  );

  // Function to withdraw application
  const handleWithdrawApplication = useCallback(
    async (campaignId) => {
      try {
        await dispatch(withdrawApplication(campaignId)).unwrap();
        // Refresh the applications list after successful withdrawal
        fetchCreatorApplications(activeTab === "pending" ? "PENDING" : "REJECTED");
      } catch (error) {
        // Error handling is done globally in api.js
        console.error("Withdrawal failed:", error);
      }
    },
    [dispatch, fetchCreatorApplications, activeTab]
  );

  // Fetch applications when tab changes
  useEffect(() => {
    fetchCreatorApplications(activeTab === "pending" ? "PENDING" : "REJECTED");
  }, [activeTab, fetchCreatorApplications]);

  // Filter data based on active tab
  const filteredData =
    applicationsData?.data?.filter((app) =>
      activeTab === "pending" ? app.status === "PENDING" : app.status === "REJECTED"
    ) || [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    handleTabChange,
    applicationsData,
    applicationsLoading,
    applicationsSuccess,
    applicationsError,
    fetchCreatorApplications,
    filteredData,
    handleWithdrawApplication,
    withdrawLoading,
    withdrawSuccess,
    withdrawError,
  };
}

export default useCreatorApplications;

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCreatorApplications,
  withdrawApplication,
} from "@/provider/features/campaigns/campaigns.slice";

function useCreatorApplications() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("pending");
  const [allApplications, setAllApplications] = useState({ pending: [], rejected: [] });

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

  // Function to fetch all applications (both pending and rejected)
  const fetchAllApplications = useCallback(async () => {
    try {
      // Fetch pending applications
      const pendingResponse = await dispatch(getCreatorApplications("PENDING")).unwrap();
      setAllApplications((prev) => ({ ...prev, pending: pendingResponse?.data || [] }));

      // Fetch rejected applications
      const rejectedResponse = await dispatch(getCreatorApplications("REJECTED")).unwrap();
      setAllApplications((prev) => ({ ...prev, rejected: rejectedResponse?.data || [] }));
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  }, [dispatch]);

  // Function to fetch applications for a specific status (for tab switching)
  const fetchApplicationsForStatus = useCallback(
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
        // Refresh all applications after successful withdrawal
        await fetchAllApplications();
      } catch (error) {
        // Error handling is done globally in api.js
        console.error("Withdrawal failed:", error);
      }
    },
    [dispatch, fetchAllApplications]
  );

  // Fetch applications when tab changes
  useEffect(() => {
    fetchApplicationsForStatus(activeTab === "pending" ? "PENDING" : "REJECTED");
  }, [activeTab, fetchApplicationsForStatus]);

  // Fetch all applications on component mount
  useEffect(() => {
    fetchAllApplications();
  }, [fetchAllApplications]);

  // Filter data based on active tab - use local state for display
  const filteredData = activeTab === "pending" ? allApplications.pending : allApplications.rejected;

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
    fetchApplicationsForStatus,
    filteredData,
    handleWithdrawApplication,
    withdrawLoading,
    withdrawSuccess,
    withdrawError,
    allApplications,
  };
}

export default useCreatorApplications;

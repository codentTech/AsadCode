import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingContractsForCreator,
  signContract,
  declineContract,
  getContractById,
} from "@/provider/features/contracts/contracts.slice";
import { getUser } from "@/common/utils/users.util";

const useOffersModal = ({ show, onClose, onContractAction }) => {
  const dispatch = useDispatch();
  const user = getUser();

  const [selectedContract, setSelectedContract] = useState(null);
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [contractPreviewData, setContractPreviewData] = useState(null);

  const { data: pendingContractsData, isLoading: pendingContractsLoading } = useSelector(
    (state) => state.contracts.getPendingContractsForCreator || {}
  );

  const { isLoading: signLoading } = useSelector((state) => state.contracts.signContract || {});

  const { isLoading: declineLoading } = useSelector(
    (state) => state.contracts.declineContract || {}
  );

  // Handle both array and nested data structure
  const pendingContracts = (() => {
    if (Array.isArray(pendingContractsData)) {
      return pendingContractsData;
    }
    if (pendingContractsData?.data && Array.isArray(pendingContractsData.data)) {
      return pendingContractsData.data;
    }
    return [];
  })();

  useEffect(() => {
    if (show) {
      dispatch(getPendingContractsForCreator());
    }
  }, [dispatch, show]);

  const formatTimeAgo = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }, []);

  const handleReviewContract = useCallback(
    async (contract) => {
      setSelectedContract(contract);
      const result = await dispatch(getContractById(contract.id)).unwrap();
      if (result.success) {
        setContractPreviewData(result.data);
        setShowContractPreview(true);
      }
    },
    [dispatch]
  );

  const handleAccept = useCallback(async () => {
    if (!selectedContract || !user?.id) return;

    const now = new Date().toISOString();
    const signatureData = {
      signerId: user.id,
      signatureType: "creator",
      signedAt: now,
      signatureTimestamp: now,
      ipAddress: "",
      userAgent: navigator.userAgent,
      signatureData: {
        method: "e-signature",
        consent: true,
        userAgent: navigator.userAgent,
        timestamp: now,
      },
    };

    await dispatch(signContract({ contractId: selectedContract.id, signatureData })).unwrap();

    setShowContractPreview(false);
    setSelectedContract(null);
    setContractPreviewData(null);
    dispatch(getPendingContractsForCreator());

    if (onContractAction) {
      onContractAction();
    }
    onClose();
  }, [selectedContract, user, dispatch, onContractAction, onClose]);

  const handleDecline = useCallback(async () => {
    if (!selectedContract) return;

    await dispatch(declineContract(selectedContract.id)).unwrap();

    setShowContractPreview(false);
    setSelectedContract(null);
    setContractPreviewData(null);
    dispatch(getPendingContractsForCreator());

    if (onContractAction) {
      onContractAction();
    }
  }, [selectedContract, dispatch, onContractAction]);

  const handleBackToList = useCallback(() => {
    setShowContractPreview(false);
    setSelectedContract(null);
    setContractPreviewData(null);
  }, []);

  return {
    user,
    pendingContracts,
    pendingContractsLoading,
    selectedContract,
    showContractPreview,
    contractPreviewData,
    signLoading,
    declineLoading,
    formatTimeAgo,
    handleReviewContract,
    handleAccept,
    handleDecline,
    handleBackToList,
  };
};

export default useOffersModal;


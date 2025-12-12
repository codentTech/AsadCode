import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";
import { avatar } from "@/common/constants/auth.constant";
import { getAge } from "@/common/utils/date.utils";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

const useDeliverablesProgress = (selectedCreator, isIndividualCreator) => {
  const dispatch = useDispatch();

  const contractsState = useSelector(
    (state) => state.contracts?.getIndividualCollaborationContracts || {}
  );

  const contractsData = contractsState.data || [];
  const isContractsLoading = contractsState.isLoading || false;

  useEffect(() => {
    if (isIndividualCreator && selectedCreator) {
      dispatch(getIndividualCollaborationContracts(false));
    }
  }, [dispatch, isIndividualCreator, selectedCreator?.id]);

  const selectedContract = useMemo(() => {
    if (!selectedCreator || !contractsData.length) return null;

    const creatorId = selectedCreator?.creator?.id;

    if (!creatorId) return null;

    return contractsData.find((contract) => {
      const contractCreatorId = contract.creatorId || contract.creator?.id || contract.creator_id;
      return contractCreatorId === creatorId;
    });
  }, [selectedCreator, contractsData]);

  const getCreatorData = () => {
    if (!selectedCreator) return null;

    if (selectedCreator.creator) {
      const creator = selectedCreator?.creator;
      const profile = creator?.creator_profile;
      const appliedDate = selectedCreator.applied_at || selectedCreator.created_at;

      return {
        id: selectedCreator.id || creator.id,
        name: `${creator.first_name || ""} ${creator.last_name || ""}`.trim(),
        image: profile?.profile_photo_url || avatar,
        location:
          `${creator.city || ""} ${creator.country || ""}`.trim() || "Location not specified",
        rating: parseFloat(profile?.rating) || 0,
        appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
        pitch: selectedCreator.custom_message || selectedCreator.pitch || "",
        status: selectedCreator.status || "PENDING",
        profile: profile,
        bio: profile?.bio || "",
        age: getAge(creator.date_of_birth),
        reviewCount: profile?.review_count || 0,
      };
    }

    return selectedCreator;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCompensation = (contract) => {
    if (contract.compensationType === COMPENSATION_TYPE.PAID) {
      return `$${contract.totalCompensation || 0}`;
    } else if (contract.compensationType === COMPENSATION_TYPE.GIFTED_PRODUCT) {
      return `Product ($${contract.productPrice || 0})`;
    } else if (contract.compensationType === COMPENSATION_TYPE.COMMISSION) {
      return "Commission based";
    }
    return "Not specified";
  };

  const getDeliverables = (contract) => {
    if (contract.contentFormat) {
      const deliverables = contract.contentFormat.split(",").map((item) => {
        const trimmed = item.trim();
        const match = trimmed.match(/Quantity \((\d+)\) Deliverable '([^']+)'/);
        if (match) {
          const quantity = match[1];
          const deliverable = match[2];
          return `${quantity} ${deliverable}`;
        }
        return trimmed;
      });
      return deliverables;
    }
    return ["Content deliverables"];
  };

  const creatorData = useMemo(() => getCreatorData(), [selectedCreator]);

  return {
    selectedContract,
    isContractsLoading,
    creatorData,
    formatDate,
    formatCompensation,
    getDeliverables,
  };
};

export default useDeliverablesProgress;

import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getPipelineBoard, getHiredCreators, getAppliedCreators } from "@/provider/features/campaigns/campaigns.slice";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";
import { getBrandIndividualCollaborations } from "@/provider/features/invitation/invitation.slice";

export function refreshBrandPipelineData(dispatch, options = {}) {
  const {
    campaignId,
    collaborationType,
    isMultiCreator = true,
    activeFilters = { status: "HIRED", sort: "urgency" },
    applicationsFilters = { sort: "urgency" },
    completedFilters = { status: "COMPLETED", sort: "urgency" },
    includeBoard = true,
    includeApplications = false,
    includeActive = true,
    includeCompleted = false,
    treatContractsAsCompleted = false,
    silent = false,
  } = options;

  const isIndividual =
    collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR || !isMultiCreator;

  if (includeActive) {
    if (isIndividual) {
      dispatch(
        getIndividualCollaborationContracts({
          isCompleted: treatContractsAsCompleted,
          silent,
        }),
      );
    } else if (campaignId) {
      dispatch(
        getHiredCreators({
          campaignId,
          filters: activeFilters,
          silent,
        }),
      );
    }
  }

  if (includeApplications) {
    if (isIndividual) {
      dispatch(getBrandIndividualCollaborations({ silent }));
    } else if (campaignId) {
      dispatch(
        getAppliedCreators({
          campaignId,
          filters: applicationsFilters,
          silent,
        }),
      );
    }
  }

  if (includeCompleted) {
    if (isIndividual) {
      dispatch(getIndividualCollaborationContracts({ isCompleted: true, silent }));
    } else if (campaignId) {
      dispatch(
        getAppliedCreators({
          campaignId,
          filters: completedFilters,
          silent,
        }),
      );
    }
  }

  if (includeBoard && campaignId) {
    dispatch(getPipelineBoard({ campaignId, silent }));
  }
}

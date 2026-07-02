import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorCollaborationHistory } from "@/provider/features/campaigns/campaigns.slice";

export default function useCreatorCollaborationHistory(creatorProfileId) {
  const dispatch = useDispatch();

  const {
    data: historyData,
    isLoading,
    isError,
    isSuccess,
  } = useSelector((state) => state.campaigns.getCreatorCollaborationHistory || {});

  useEffect(() => {
    if (creatorProfileId) {
      dispatch(getCreatorCollaborationHistory(creatorProfileId));
    }
  }, [dispatch, creatorProfileId]);

  const history = historyData?.data || [];

  return {
    history,
    isLoading,
    isError,
    isSuccess,
  };
}

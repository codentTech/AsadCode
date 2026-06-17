import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPipelineBoard } from "@/provider/features/campaigns/campaigns.slice";
import { bucketCreatorsByBoardColumn, applyLivePipelineUrgency } from "@/common/utils/creator-urgency.util";
import useUrgencyTick from "@/common/hooks/use-urgency-tick.hook";
import useCreatorPhylloFollowers from "@/common/hooks/use-creator-phyllo-followers.hook";

const BOARD_COLUMN_ORDER = [
  "applications",
  "negotiations",
  "content_in_progress",
  "awaiting_post",
  "completed",
];

function useCampaignBoard({ selectedCampaign, onCreatorSelect, pipelineRefreshToken = 0 }) {
  const dispatch = useDispatch();
  const campaignId = selectedCampaign?.id;
  const urgencyTick = useUrgencyTick();
  const loadedBoardCampaignRef = useRef(null);

  const {
    data: boardData,
    isLoading,
    isSuccess,
    isError,
    campaignId: boardCampaignId,
  } = useSelector((state) => state.campaigns.getPipelineBoard || {});

  useEffect(() => {
    if (!campaignId) return;

    const silent = loadedBoardCampaignRef.current === campaignId;
    dispatch(
      getPipelineBoard({
        campaignId,
        silent,
      }),
    );
  }, [campaignId, dispatch, pipelineRefreshToken]);

  useEffect(() => {
    if (
      isSuccess &&
      boardData?.data &&
      String(boardCampaignId) === String(campaignId)
    ) {
      loadedBoardCampaignRef.current = campaignId;
    }
  }, [isSuccess, boardData?.data, boardCampaignId, campaignId]);

  useEffect(() => {
    if (campaignId !== loadedBoardCampaignRef.current) {
      loadedBoardCampaignRef.current = null;
    }
  }, [campaignId]);

  const columns = useMemo(() => {
    const creators = Array.isArray(boardData?.data) ? boardData.data : [];
    urgencyTick;
    const withLiveUrgency = creators.map(applyLivePipelineUrgency);
    return bucketCreatorsByBoardColumn(withLiveUrgency);
  }, [boardData?.data, urgencyTick]);

  const boardCreatorIds = useMemo(() => {
    const creators = Array.isArray(boardData?.data) ? boardData.data : [];
    return creators.map((row) => row?.creator?.id).filter(Boolean);
  }, [boardData?.data]);

  const phylloAccountsByCreatorId = useCreatorPhylloFollowers(boardCreatorIds);

  const handleCreatorSelect = useCallback(
    (creator) => {
      if (onCreatorSelect) {
        onCreatorSelect(creator);
      }
    },
    [onCreatorSelect],
  );

  return {
    columnOrder: BOARD_COLUMN_ORDER,
    columns,
    isLoading,
    isSuccess,
    isError,
    handleCreatorSelect,
    phylloAccountsByCreatorId,
  };
}

export default useCampaignBoard;

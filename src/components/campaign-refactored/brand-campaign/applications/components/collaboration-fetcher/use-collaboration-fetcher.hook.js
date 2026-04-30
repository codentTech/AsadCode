import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBrandIndividualCollaborations } from "@/provider/features/invitation/invitation.slice";

export default function useCollaborationFetcher({ selectedCampaign }) {
  const dispatch = useDispatch();

  const { data: individualCollaborationsData, isLoading: individualCollaborationsLoading } =
    useSelector((state) => state.invitation.getBrandIndividualCollaborations || {});

  const individualCollaborations = (individualCollaborationsData?.data || []).filter(
    (invitation) => invitation.status === "PENDING"
  );

  const fetchIndividualCollaborations = useCallback(async () => {
    await dispatch(getBrandIndividualCollaborations());
  }, [dispatch]);

  useEffect(() => {
    fetchIndividualCollaborations();
  }, [fetchIndividualCollaborations]);

  return {
    individualCollaborations,
    isLoading: individualCollaborationsLoading,
    refetch: fetchIndividualCollaborations,
  };
}

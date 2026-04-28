import { useEffect } from "react";
import useCollaborationFetcher from "./use-collaboration-fetcher.hook";

export default function CollaborationFetcher({ selectedCampaign, onDataChange }) {
  const { individualCollaborations, isLoading, refetch } = useCollaborationFetcher({
    selectedCampaign,
  });

  useEffect(() => {
    if (onDataChange) {
      onDataChange({ individualCollaborations, isLoading });
    }
  }, [individualCollaborations, isLoading, onDataChange]);

  return null;
}

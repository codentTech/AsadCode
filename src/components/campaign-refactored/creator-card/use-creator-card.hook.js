import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { getPlatformProfileUrl } from "@/common/utils/platform.utils";

export const useCreatorCard = ({
  creator,
  isShortlist,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  onReinstateClick,
  onViewNotesClick,
}) => {
  const { getPlatformIcon } = useGetplatform();

  const handleCardClick = () => {
    onCreatorPreview(creator);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (isShortlist) {
      onRemoveFromShortlist?.(creator.id);
    } else {
      onSaveToShortlist?.(creator);
    }
  };

  const handleInviteClickInternal = (e) => {
    e.stopPropagation();
    onInviteClick?.(creator, e);
  };

  const handleReinstateClickInternal = (e) => {
    e.stopPropagation();
    onReinstateClick?.(creator, e);
  };

  const handleViewNotesClickInternal = (e) => {
    e.stopPropagation();
    onViewNotesClick?.(creator, e);
  };

  const handleViewProfileClick = (e) => {
    e.stopPropagation();
    window.open(`/creator-profile/${creator.id}`, "_blank", "noopener,noreferrer");
  };

  const getPlatformProfileUrlFor = (platform) => {
    const stat = creator.platformStats?.[platform];
    const username = stat?.username ?? stat?.handle ?? creator.social_links?.[platform];
    const profileUrl = stat?.profile_url ?? stat?.profileUrl;
    return getPlatformProfileUrl(platform, username, profileUrl);
  };

  const formatFollowers = (followers) => {
    if (!followers) return "0";

    const truncate = (num, decimals = 1) => {
      const factor = Math.pow(10, decimals);
      return Math.floor(num * factor) / factor;
    };

    if (followers >= 1_000_000) {
      const val = truncate(followers / 1_000_000, 1);
      return `${val}M`;
    }

    if (followers >= 1_000) {
      const val = truncate(followers / 1_000, 1);
      return `${val}K`;
    }

    return followers.toString();
  };

  /** Combined followers from all connected accounts (platformStats), fallback to creator.followers */
  const getStatFollowers = (stat) => {
    if (!stat || typeof stat !== "object") return 0;
    return (
      Number(stat.followers) ||
      Number(stat.follower_count) ||
      Number(stat.subscriber_count) ||
      Number(stat.followers_count) ||
      0
    );
  };
  const totalFollowers =
    creator.platformStats && typeof creator.platformStats === "object"
      ? Object.values(creator.platformStats).reduce((sum, stat) => sum + getStatFollowers(stat), 0)
      : 0;
  const combinedFollowers = totalFollowers > 0 ? totalFollowers : (creator.followers ?? 0);

  const getPlatformFollowers = (platform) => getStatFollowers(creator.platformStats?.[platform]);

  return {
    getPlatformIcon,
    getPlatformProfileUrlFor,
    handleCardClick,
    handleSaveClick,
    handleInviteClickInternal,
    handleReinstateClickInternal,
    handleViewNotesClickInternal,
    handleViewProfileClick,
    formatFollowers,
    combinedFollowers,
    getPlatformFollowers,
  };
};

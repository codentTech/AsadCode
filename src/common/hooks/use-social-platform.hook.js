import { Users } from "lucide-react";
import InstagramIcon from "../icons/instagram";
import TikTokIcon from "../icons/tiktok";
import TwitterIcon from "../icons/twitter";
import YoutubeIcon from "../icons/youtube";
import FacebookIcon from "../icons/facebook";

function useGetplatform() {
  const getPlatformIcon = (platform) => {
    const value = platform?.toLowerCase();
    switch (value) {
      case "facebook":
        return <FacebookIcon className="w-4 h-4" />;
      case "instagram":
        return <InstagramIcon className="w-4 h-4" />;
      case "youtube":
        return <YoutubeIcon className="w-4 h-4" />;
      case "twitter":
        return <TwitterIcon className="w-4 h-4" />;
      case "tiktok":
        return <TikTokIcon className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform) => {
    const value = platform?.toLowerCase();
    switch (value) {
      case "facebook":
        return "bg-blue-50 text-blue-700";
      case "instagram":
        return "bg-pink-50 text-pink-700";
      case "youtube":
        return "bg-red-50 text-red-700";
      case "twitter":
        return "bg-sky-50 text-sky-700";
      case "tiktok":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatFollowers = (count) => {
    if (typeof count !== "number" || Number.isNaN(count)) {
      return count ? count.toString() : "—";
    }

    if (count >= 1_000_000) {
      const whole = Math.floor(count / 1_000_000);
      const frac = Math.floor((count % 1_000_000) / 100_000);
      return frac === 0 ? `${whole}M` : `${whole}.${frac}M`;
    }
    if (count >= 1_000) {
      const whole = Math.floor(count / 1_000);
      const frac = Math.floor((count % 1_000) / 100);
      return frac === 0 ? `${whole}K` : `${whole}.${frac}K`;
    }
    return count.toString();
  };

  const getVisiblePlatformEntries = (platforms) => {
    if (!platforms || typeof platforms !== "object") return [];
    return Object.entries(platforms).filter(
      ([, data]) => data && (data.followers > 0 || data.verified)
    );
  };

  return { getPlatformIcon, getPlatformColor, formatFollowers, getVisiblePlatformEntries };
}

export default useGetplatform;

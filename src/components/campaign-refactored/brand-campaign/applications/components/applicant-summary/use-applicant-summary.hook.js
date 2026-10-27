import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { getApplicantSummary } from "@/provider/features/campaigns/campaigns.slice";
import { avatar } from "@/common/constants/auth.constant";
import { buildCampaignReturnPath } from "@/common/utils/campaign.utils";

const SORT_KEYS = {
  platform: "platform",
  followers: "followers",
  typicalViews: "typicalViews",
  engagementRate: "engagementRate",
  reachViewEfficiency: "reachViewEfficiency",
  performanceConsistency: "performanceConsistency",
};

function formatCompact(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(Math.round(num));
}

function formatPercent(n, digits = 1) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `${Number(n).toFixed(digits)}%`;
}

function formatPlatform(platform) {
  if (!platform) return "—";
  const p = String(platform).toLowerCase();
  if (p === "instagram") return "Instagram";
  if (p === "tiktok") return "TikTok";
  if (p === "youtube") return "YouTube";
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

function useApplicantSummary() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId");

  const { data, isLoading, isError, message } = useSelector(
    (state) => state.campaigns.getApplicantSummary || {},
  );

  const [search, setSearch] = useState("");
  const [recommendedActive, setRecommendedActive] = useState(true);
  const [sortKey, setSortKey] = useState(SORT_KEYS.reachViewEfficiency);
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    if (!campaignId) return;
    dispatch(getApplicantSummary(campaignId));
  }, [campaignId, dispatch]);

  const rows = useMemo(() => {
    const list = Array.isArray(data?.rows) ? data.rows : [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? list.filter((row) => String(row.name || "").toLowerCase().includes(q))
      : list;

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (sortKey === SORT_KEYS.platform) {
        const cmp = String(aVal || "").localeCompare(String(bVal || ""));
        return sortDir === "asc" ? cmp : -cmp;
      }
      const aNum = aVal == null ? -Infinity : Number(aVal);
      const bNum = bVal == null ? -Infinity : Number(bVal);
      return sortDir === "asc" ? aNum - bNum : bNum - aNum;
    });

    return sorted;
  }, [data?.rows, search, sortKey, sortDir]);

  const handleColumnSort = useCallback(
    (key) => {
      setRecommendedActive(false);
      if (sortKey === key) {
        setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
        return;
      }
      setSortKey(key);
      setSortDir("desc");
    },
    [sortKey],
  );

  const handleRecommendedClick = useCallback(() => {
    setRecommendedActive(true);
    setSortKey(SORT_KEYS.reachViewEfficiency);
    setSortDir("desc");
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearch(event?.target?.value ?? "");
  }, []);

  const handleBack = useCallback(() => {
    router.push(buildCampaignReturnPath({ returnTab: 2 }));
  }, [router]);

  return {
    campaignId,
    campaignName: data?.campaignName || "",
    rows,
    isLoading,
    isError,
    message,
    search,
    handleSearchChange,
    recommendedActive,
    handleRecommendedClick,
    sortKey,
    sortDir,
    handleColumnSort,
    formatCompact,
    formatPercent,
    formatPlatform,
    avatarFallback: avatar,
    SORT_KEYS,
    handleBack,
  };
}

export default useApplicantSummary;

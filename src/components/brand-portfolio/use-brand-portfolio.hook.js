import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { isCreatorMode, getUser } from "@/common/utils/users.util";
import { avatar } from "@/common/constants/auth.constant";
import usersService from "@/provider/features/users/users.service";

const normalizePlatformConnection = (connection) => {
  if (!connection) return null;

  if (typeof connection === "string") {
    return {
      id: connection,
      name: connection.replace(/_/g, " "),
      followers: null,
      verified: false,
      platform: connection,
      engagementRate: null,
    };
  }

  if (typeof connection === "object") {
    const platform =
      connection.platform || connection.name || connection.type || connection.provider;
    if (!platform) return null;

    const rawFollowers =
      connection.followers ?? connection.followerCount ?? connection.audienceSize ?? null;
    const rawEngagement =
      connection.engagementRate ??
      connection.engagement_rate ??
      connection.metrics?.engagementRate ??
      connection.analytics?.engagementRate ??
      null;

    const followersNumber = Number(rawFollowers);
    const engagementNumber = Number(rawEngagement);

    return {
      id: connection.id || platform,
      name: connection.displayName || connection.name || platform.replace(/_/g, " "),
      followers: Number.isFinite(followersNumber) ? followersNumber : rawFollowers || 0,
      verified:
        connection.verified === true ||
        connection.isVerified === true ||
        connection.status === "verified",
      platform,
      lastSynced: connection.lastSynced || connection.syncedAt || null,
      engagementRate: Number.isFinite(engagementNumber)
        ? Number(engagementNumber)
        : (rawEngagement ?? null),
    };
  }

  return null;
};

export default function useBrandPortfolio(brandId = null) {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [brandUser, setBrandUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!brandId && isCreatorMode()) {
      router.replace("/creator-portfolio");
    }
  }, [router, brandId]);

  useEffect(() => {
    const loadBrandData = async () => {
      setIsLoading(true);
      try {
        if (brandId) {
          // Fetch brand by ID
          const result = await usersService.getUserById(brandId);
          if (result.success && result.data) {
            setBrandUser(result.data);
          }
        } else {
          // Use current user
          const user = getUser();
          if (user?.brand_profile) {
            setBrandUser(user);
          }
        }
      } catch (error) {
        console.error("Failed to load brand data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrandData();
  }, [brandId, refreshKey]);

  const brandProfile = useMemo(() => brandUser?.brand_profile || null, [brandUser]);

  const verifiedConnections = useMemo(() => {
    if (!brandProfile) return [];

    const rawConnections =
      brandProfile.connected_platforms || brandProfile.connections || brandProfile.platforms || [];

    if (!Array.isArray(rawConnections)) return [];

    return rawConnections
      .map(normalizePlatformConnection)
      .filter((connection) => connection && connection.name)
      .sort((a, b) => {
        const aFollowers = typeof a.followers === "number" ? a.followers : 0;
        const bFollowers = typeof b.followers === "number" ? b.followers : 0;
        return bFollowers - aFollowers;
      });
  }, [brandProfile]);

  const brandBasics = useMemo(() => {
    if (!brandProfile || !brandUser) {
      return {
        name: "Brand",
        logo: avatar,
        website: "",
        location: "",
        email: brandUser?.email || "",
      };
    }

    const locationParts = [brandProfile.city, brandProfile.country].filter(Boolean);

    return {
      name: brandProfile.brand_name || brandUser.company_name || "Brand",
      logo: brandProfile.brand_logo_url || avatar,
      website: brandProfile.website_url || "",
      location: locationParts.join(", "),
      email: brandUser.email || "",
      isVerified: Boolean(brandProfile.is_verified),
    };
  }, [brandProfile, brandUser]);

  const brandPreferences = useMemo(() => {
    if (!brandProfile) return null;

    return {
      campaignTypes:
        brandProfile.campaign_types || brandProfile.campaign_preferences?.campaign_types || [],
      targetNiches:
        brandProfile.target_niches || brandProfile.campaign_preferences?.target_audience || [],
      creatorSizes: brandProfile.creator_sizes || [],
      filmingPreference: brandProfile.filming_preference || "",
      minFollowers: brandProfile.min_followers || "",
      languages: brandProfile.ideal_creator?.languages || [],
      locations: brandProfile.ideal_creator?.locations || brandProfile.geographic_focus || [],
    };
  }, [brandProfile]);

  const brandOverview = useMemo(() => {
    if (!brandProfile) {
      return {
        description: "",
        campaignPreferences: null,
        idealCreator: null,
      };
    }

    return {
      description: brandProfile.company_description || "",
      campaignPreferences: brandProfile.campaign_preferences || null,
      idealCreator: brandProfile.ideal_creator || null,
    };
  }, [brandProfile]);

  const audienceSummary = useMemo(() => {
    if (!verifiedConnections.length) {
      return {
        totalFollowers: 0,
        averageEngagementRate: null,
      };
    }

    const totalFollowers = verifiedConnections.reduce((sum, connection) => {
      const value = Number(connection.followers);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    const engagementRates = verifiedConnections
      .map((connection) => Number(connection.engagementRate))
      .filter((value) => Number.isFinite(value));

    const averageEngagementRate = engagementRates.length
      ? Number(
          (engagementRates.reduce((sum, value) => sum + value, 0) / engagementRates.length).toFixed(
            2
          )
        )
      : null;

    return {
      totalFollowers,
      averageEngagementRate,
    };
  }, [verifiedConnections]);

  const refreshBrandData = useCallback(() => {
    const user = getUser();
    if (user?.brand_profile) {
      setBrandUser(user);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshBrandData();
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 300);
  }, [refreshBrandData]);

  const handleEditProfile = useCallback(() => {
    router.push("/settings/brand-profile/profile-information");
  }, [router]);

  const canEdit = !brandId; // Only allow editing if viewing own profile

  return {
    brandBasics,
    brandOverview,
    brandPreferences,
    verifiedConnections,
    audienceSummary,
    refreshKey,
    isRefreshing,
    handleRefresh,
    handleEditProfile,
    canEdit,
    isLoading,
  };
}

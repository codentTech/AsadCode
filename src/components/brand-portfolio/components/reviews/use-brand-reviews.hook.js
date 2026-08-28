import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCampaignReviews } from "@/provider/features/campaign-reviews/campaign-reviews.slice";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import { avatar } from "@/common/constants/auth.constant";
import { format } from "date-fns";
import ROLES from "@/common/constants/role.constant";

function useBrandReviews() {
  const dispatch = useDispatch();
  const [reviewSort, setReviewSort] = useState("newest");
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

  const campaigns = useMemo(() => {
    if (!campaignsData?.data) return [];
    return Array.isArray(campaignsData.data) ? campaignsData.data : [];
  }, [campaignsData]);

  useEffect(() => {
    if (campaignsLoading || campaignsSuccess || campaignsError) return;
    dispatch(getAllBrandCampaigns());
  }, [dispatch, campaignsLoading, campaignsSuccess, campaignsError]);

  useEffect(() => {
    // Once campaigns are loaded, fetch reviews for each campaign
    if (campaignsSuccess && campaigns.length > 0) {
      fetchAllReviews();
    } else if (campaignsSuccess && campaigns.length === 0) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignsSuccess, campaigns.length, reviewSort]);

  const fetchAllReviews = async () => {
    setIsLoading(true);
    try {
      // Map frontend sort to backend sort parameters
      const getSortParams = () => {
        switch (reviewSort) {
          case "newest":
            return { sortBy: "created_at", sortOrder: "DESC" };
          case "highest":
            return { sortBy: "rating", sortOrder: "DESC" };
          case "lowest":
            return { sortBy: "rating", sortOrder: "ASC" };
          default:
            return { sortBy: "created_at", sortOrder: "DESC" };
        }
      };

      const sortParams = getSortParams();
      const params = {
        ...sortParams,
        reviewerRole: ROLES.CREATOR,
      };

      const reviewPromises = campaigns.map((campaign) =>
        dispatch(getCampaignReviews({ campaignId: campaign.id, params }))
          .unwrap()
          .catch(() => [])
      );

      const results = await Promise.allSettled(reviewPromises);

      const reviews = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const campaignReviews = result.value || [];
          // Filter only unlocked reviews (backend already filters by reviewerRole)
          const unlockedReviews = campaignReviews.filter((review) => review.is_unlocked);

          // Map reviews with creator profile info
          unlockedReviews.forEach((review) => {
            const creatorProfile = review.creator_profile;
            reviews.push({
              id: review.id,
              creator: creatorProfile?.user?.first_name
                ? `${creatorProfile.user.first_name} ${creatorProfile.user.last_name || ""}`.trim()
                : creatorProfile?.user?.email || "Creator",
              logo: creatorProfile?.profile_photo_url || creatorProfile?.user?.avatar || avatar,
              rating: review.rating || 5,
              text: review.review || "",
              date: review.created_at ? format(new Date(review.created_at), "MMM dd, yyyy") : "",
              campaignTitle: campaigns[index]?.campaign_title || "Campaign",
              createdAt: review.created_at,
            });
          });
        }
      });

      setAllReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const options = [
    { label: "Newest First", value: "newest" },
    { label: "Highest Rating", value: "highest" },
    { label: "Lowest Rating", value: "lowest" },
  ];

  return {
    setReviewSort,
    options,
    sortedReviews: allReviews, // Reviews are already sorted by backend
    isLoading: isLoading || campaignsLoading,
  };
}

export default useBrandReviews;

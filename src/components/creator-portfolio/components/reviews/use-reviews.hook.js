import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCampaignReviewsByCreator } from "@/provider/features/campaign-reviews/campaign-reviews.slice";
import { avatar } from "@/common/constants/auth.constant";
import { getUser } from "@/common/utils/users.util";

function useReviews(creatorId) {
  const dispatch = useDispatch();
  const [reviewSort, setReviewSort] = useState("newest");
  const effectiveCreatorId = creatorId || getUser()?.id;

  const {
    data: reviewsList = [],
    isLoading,
    isError,
  } = useSelector((state) => state.campaignReviews?.getCampaignReviewsByCreator ?? {});

  useEffect(() => {
    if (effectiveCreatorId) {
      dispatch(getCampaignReviewsByCreator(effectiveCreatorId));
    }
  }, [effectiveCreatorId, dispatch]);

  const options = [
    { label: "Newest First", value: "newest" },
    { label: "Highest Rating", value: "highest" },
    { label: "Lowest Rating", value: "lowest" },
  ];

  const mapReview = (r) => {
    const brandProfile = r.created_by?.brand_profile;
    const brandName = brandProfile?.brand_name || r.created_by?.name || "Brand";
    const logo = brandProfile?.brand_logo_url || avatar;
    const dateStr = r.created_at
      ? new Date(r.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
    return {
      id: r.id,
      brand: brandName,
      logo,
      rating: Number(r.rating) || 0,
      text: r.review || "",
      date: dateStr,
      createdAt: r.created_at ? new Date(r.created_at).getTime() : 0,
    };
  };

  const mappedReviews = useMemo(
    () => (Array.isArray(reviewsList) ? reviewsList.map(mapReview) : []),
    [reviewsList]
  );

  const sortedReviews = useMemo(() => {
    const list = [...mappedReviews];
    if (reviewSort === "newest") {
      return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    if (reviewSort === "highest") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list.sort((a, b) => a.rating - b.rating);
  }, [mappedReviews, reviewSort]);

  return {
    setReviewSort,
    options,
    sortedReviews,
    isLoading,
    isError,
  };
}

export default useReviews;

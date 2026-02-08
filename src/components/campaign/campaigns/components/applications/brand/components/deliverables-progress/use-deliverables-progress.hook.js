import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { avatar } from "@/common/constants/auth.constant";
import { getAge } from "@/common/utils/date.utils";

const useDeliverablesProgress = (selectedCreator, isIndividualCreator) => {
  const router = useRouter();
  const getCreatorData = () => {
    if (!selectedCreator) return null;

    if (selectedCreator.creator) {
      const creator = selectedCreator?.creator;
      const profile = creator?.creator_profile;
      const appliedDate = selectedCreator.applied_at || selectedCreator.created_at;

      return {
        id: selectedCreator.id || creator.id,
        name: `${creator.first_name || ""} ${creator.last_name || ""}`.trim(),
        image: profile?.profile_photo_url || avatar,
        location:
          `${creator.city || ""} ${creator.country || ""}`.trim() || "Location not specified",
        rating: parseFloat(profile?.rating) || 0,
        appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
        pitch: selectedCreator.custom_message || selectedCreator.pitch || "",
        status: selectedCreator.status || "PENDING",
        profile: profile,
        bio: profile?.bio || "",
        age: getAge(creator.date_of_birth),
        reviewCount: profile?.review_count || 0,
      };
    }

    return selectedCreator;
  };

  const creatorData = useMemo(() => getCreatorData(), [selectedCreator]);

  const creatorProfileId = useMemo(() => {
    if (!selectedCreator) return null;
    return (
      selectedCreator?.creator?.creator_profile?.id || selectedCreator?.creator_profile?.id || null
    );
  }, [selectedCreator]);

  const creatorUserId = useMemo(() => {
    if (!selectedCreator) return null;
    return selectedCreator?.creator?.id || selectedCreator?.id || null;
  }, [selectedCreator]);

  const handleViewCreatorPortfolio = useCallback(() => {
    if (creatorUserId) {
      router.push(`/creator-profile/${creatorUserId}`);
    }
  }, [creatorUserId, router]);

  return {
    creatorData,
    creatorProfileId,
    creatorUserId,
    handleViewCreatorPortfolio,
  };
};

export default useDeliverablesProgress;

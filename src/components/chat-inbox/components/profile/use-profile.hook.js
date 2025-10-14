import { useSelector } from "react-redux";
import { getUser } from "@/common/utils/users.util";
import { avatar as defaultAvatar } from "@/common/constants/auth.constant";

function useProfile(selectedChatId) {
  const user = getUser();

  // Get data from Redux
  const { conversations, onlineUsers } = useSelector((state) => state.chat);

  // Get current conversation
  const currentConversation = conversations.find((c) => c.id === selectedChatId);

  // Get other user info
  const otherUser = currentConversation
    ? currentConversation.brand.id === user?.id
      ? currentConversation.creator
      : currentConversation.brand
    : null;

  // Check if other user is online
  const isOtherUserOnline = otherUser ? onlineUsers.includes(otherUser.id) : false;

  // Get user profile data
  const userProfile = otherUser
    ? {
        id: otherUser.id,
        name: `${otherUser.first_name || ""} ${otherUser.last_name || ""}`.trim() || "User",
        avatar:
          otherUser.creator_profile?.profile_photo_url ||
          otherUser.brand_profile?.logo_url ||
          defaultAvatar,
        bio:
          otherUser.creator_profile?.bio ||
          otherUser.brand_profile?.description ||
          "No bio available",
        rating: otherUser.creator_profile?.rating || 0,
        location: otherUser.creator_profile?.location || otherUser.brand_profile?.location || "N/A",
        isOnline: isOtherUserOnline,
        // Social stats for creators
        posts: otherUser.creator_profile?.total_posts || 0,
        followers: otherUser.creator_profile?.total_followers || 0,
        following: otherUser.creator_profile?.total_following || 0,
        // Additional data
        creatorProfile: otherUser.creator_profile,
        brandProfile: otherUser.brand_profile,
      }
    : null;

  return {
    userProfile,
    currentConversation,
    otherUser,
  };
}

export default useProfile;

import CustomButton from "@/common/components/custom-button/custom-button.component";
import MediaKitIcon from "@/common/components/media-kit-icon/media-kit-icon.component";
import Modal from "@/common/components/modal/modal.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { getPlatformProfileUrl } from "@/common/utils/platform.utils";
import { isCreatorMode } from "@/common/utils/users.util";
import Niche from "@/components/niche/niche";
import { BookmarkPlus, Edit, MapPin, Share2, Star, StarHalf } from "lucide-react";
import ProfileEditModal from "../edit-profile-modal/edit-profile-modal.component";
import useProfileOverview from "./use-profile-overview.hook";

export default function ProfileOverview({ creatorId, refreshKey = 0 }) {
  const {
    creator,
    isLoading,
    isEditModalOpen,
    setIsEditModalOpen,
    focusShowcaseSection,
    setFocusShowcaseSection,
    handleEditModalClose,
    saveToShortlistDialogOpen,
    setSaveToShortlistDialogOpen,
    handleShare,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    renderRatingStars,
    shortlists,
    connectedAccounts,
  } = useProfileOverview(creatorId, refreshKey);

  const { getPlatformColor, getPlatformIcon, formatFollowers } = useGetplatform();

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto"></div>
      </section>
    );
  }

  if (!creator) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Creator profile not found
      </section>
    );
  }

  const ratingStars = renderRatingStars();

  return (
    <>
      <section className="rounded-lg bg-white p-3 shadow-md sm:p-6">
        <div className="flex flex-col justify-between md:flex-row">
          {/* Left Side */}
          <div className="flex flex-col items-center gap-3 sm:gap-6 lg:flex-row md:items-start">
            <div className="relative flex flex-col items-center md:items-start">
              <img
                src={creator.profilePic}
                alt={creator.name}
                className="h-24 w-36 rounded-lg border border-gray-200 object-cover shadow-sm sm:h-28 sm:w-40 md:h-32 md:w-32 md:rounded-full md:border-4 md:border-white md:ring-2 md:ring-primary"
              />
              {creator.miniProfilePictures?.length > 0 && (
                <div className="mt-3 flex justify-center gap-2 md:justify-start">
                  {creator.miniProfilePictures.map((pic, idx) => (
                    <img
                      key={idx}
                      src={pic}
                      alt={`Showcase ${idx + 1}`}
                      className="h-10 w-10 rounded-lg border-2 border-white object-cover shadow-sm sm:h-12 sm:w-12"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
                {creator.name}
              </h2>
              <p className="text-[10px] text-gray-500 sm:text-xs md:text-sm">{creator.handle}</p>

              {/* Rating */}
              <div className="mb-1 flex items-center justify-center gap-1 md:justify-start">
                {ratingStars.map((type, i) =>
                  type === "full" ? (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ) : type === "half" ? (
                    <StarHalf key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ) : (
                    <Star key={i} className="w-4 h-4 text-gray-300" />
                  )
                )}
                <span className="m-1 text-[10px] text-gray-700 sm:text-sm">
                  {creator.rating} ({creator.reviewCount})
                </span>
              </div>

              {/* Connected Social Media */}
              {connectedAccounts?.data?.length === 0 ? (
                <div className="mb-3 flex justify-center space-x-3 md:justify-start">
                  <span className="text-gray-500">No connected social media accounts</span>
                </div>
              ) : connectedAccounts?.data?.length > 0 ? (
                <div className="mb-3 flex justify-center space-x-3 md:justify-start">
                  {connectedAccounts?.data?.map((account, idx) => {
                    const platform = account.platform ?? account.platform_name;
                    const profileUrl =
                      account.profile_url || getPlatformProfileUrl(platform, account.username);
                    const icon = (
                      <div
                        key={idx}
                        className={`${getPlatformColor(platform)} p-1 rounded-md ${profileUrl ? "cursor-pointer hover:opacity-80" : ""}`}
                      >
                        {getPlatformIcon(platform)}
                      </div>
                    );
                    return profileUrl ? (
                      <a key={idx} href={profileUrl} target="_blank" rel="noopener noreferrer">
                        {icon}
                      </a>
                    ) : (
                      icon
                    );
                  })}
                </div>
              ) : null}

              {/* Location */}
              <div className="mb-3 flex items-center justify-center text-[10px] text-gray-600 sm:text-xs md:justify-start">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{creator.location}</span>
              </div>

              {/* Niche */}
              <Niche categories={creator.categories} />
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="mt-4 flex flex-col items-start md:mt-0 md:items-end">
            <div className="w-full flex justify-between items-center gap-2">
              {isCreatorMode() && (
                <CustomButton
                  text="Shortlist"
                  className="btn-primary w-full"
                  startIcon={<BookmarkPlus className="w-4 h-4" />}
                  onClick={handleSaveToShortlist}
                />
              )}
              <CustomButton
                text={isCreatorMode() ? "Share" : "Share Your Profile"}
                className="btn-outline w-full"
                startIcon={<Share2 className="w-4 h-4" />}
                onClick={handleShare}
              />
              {isCreatorMode() && (
                <CustomButton
                  text="Edit"
                  className="btn-primary w-full"
                  startIcon={<Edit className="w-4 h-4" />}
                  onClick={() => setIsEditModalOpen(true)}
                />
              )}
            </div>
            {creator.mediaKitUrl ? (
              <a
                href={creator.mediaKitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
              >
                <MediaKitIcon size="profile" />
                <span>Media Kit</span>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* Shortlist Modal */}
      {isCreatorMode() && (
        <Modal
          title="Save to Shortlist"
          show={saveToShortlistDialogOpen}
          onClose={() => setSaveToShortlistDialogOpen(false)}
        >
          <div>
            {shortlists.length === 0 ? (
              <p className="text-gray-500 text-sm mt-4">
                No shortlists available. Create one first.
              </p>
            ) : (
              <ul className="space-y-2 mt-4">
                {shortlists.map((s) => (
                  <li key={s.id}>
                    <div
                      className="w-full text-sm p-2 border border-gray-200 hover:border-primary hover:bg-indigo-50 rounded-lg cursor-pointer transition flex items-center"
                      onClick={() => confirmSaveToShortlist(s.id)}
                    >
                      {s.name}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Modal>
      )}

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        creator={creator}
        focusShowcaseSection={focusShowcaseSection}
      />
    </>
  );
}

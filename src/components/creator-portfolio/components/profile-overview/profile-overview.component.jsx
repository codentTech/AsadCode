import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import Niche from "@/components/niche/niche";
import { BookmarkPlus, Edit, MapPin, Share2, Star, StarHalf } from "lucide-react";
import ProfileEditModal from "../edit-profile-modal/edit-profile-modal.component";
import useProfileOverview from "./use-profile-overview.hook";
import Loading from "@/common/components/loadar/loading.component";

export default function ProfileOverview({ creatorId, refreshKey = 0 }) {
  const {
    creator,
    isLoading,
    isEditModalOpen,
    setIsEditModalOpen,
    saveToShortlistDialogOpen,
    setSaveToShortlistDialogOpen,
    handleShare,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    renderRatingStars,
    shortlists,
    isCreatorMode,
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
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Left Side */}
          <div className="flex flex-col lg:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={creator.profilePic || avatar}
                alt={creator.name}
                className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-md ring-2 ring-primary"
              />
              {creator.miniProfilePictures?.length > 0 && (
                <div className="mt-3 flex gap-2 justify-center">
                  {creator.miniProfilePictures.map((pic, idx) => (
                    <img
                      key={idx}
                      src={pic}
                      alt={`Showcase ${idx + 1}`}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-900">{creator.name}</h2>
              <p className="text-gray-500">{creator.handle}</p>

              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                {ratingStars.map((type, i) =>
                  type === "full" ? (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ) : type === "half" ? (
                    <StarHalf key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ) : (
                    <Star key={i} className="w-4 h-4 text-gray-300" />
                  )
                )}
                <span className="text-sm m-1 text-gray-700">
                  {creator.rating} ({creator.reviewCount})
                </span>
              </div>

              {/* Connected Social Media */}
              {connectedAccounts?.data?.length === 0 ? (
                <div className="flex space-x-3 justify-center md:justify-start mb-3">
                  <span className="text-gray-500">No connected social media accounts</span>
                </div>
              ) : connectedAccounts?.data?.length > 0 ? (
                <div className="flex space-x-3 justify-center md:justify-start mb-3">
                  {connectedAccounts?.data?.map(({ platform }, idx) => (
                    <div key={idx} className={`${getPlatformColor(platform)} p-1 rounded-md`}>
                      {getPlatformIcon(platform)}
                    </div>
                  ))}
                </div>
              ) : (
                <Loading height={4} width={4} />
              )}

              {/* Location */}
              <div className="flex text-xs items-center justify-center md:justify-start text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{creator.location}</span>
              </div>

              {/* Niche */}
              <Niche categories={creator.categories} />
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
            {isCreatorMode && !creatorId && (
              <div
                className="self-end p-2 text-white bg-primary rounded-lg cursor-pointer hover:bg-indigo-700 mb-4 transition duration-200"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="w-5 h-5" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {creatorId && (
                <CustomButton
                  text="Shortlist"
                  startIcon={<BookmarkPlus className="w-4 h-4" />}
                  onClick={handleSaveToShortlist}
                />
              )}
              <CustomButton
                text={creatorId ? "Share" : "Share Your Profile"}
                className="btn-outline"
                startIcon={<Share2 className="w-4 h-4" />}
                onClick={handleShare}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shortlist Modal */}
      {creatorId && (
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
        onClose={() => setIsEditModalOpen(false)}
        creator={creator}
      />
    </>
  );
}

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { avatar, cover } from "@/common/constants/auth.constant";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { reviews } from "@/components/creator-portfolio/components/reviews/use-reviews";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

function CreatorPreview({ previewCreator, setIsPreviewOpen }) {
  const router = useRouter();
  if (!previewCreator) return null;

  return (
    <div className=" flex flex-col">
      <div className="bg-gray-200 w-full mb-4 rounded-lg relative">
        <img src={cover} alt="cover" className="w-full rounded-lg h-32" />
        {/* Cover photo placeholder */}
        <img
          src={previewCreator.profileImage}
          alt={previewCreator.name}
          className="absolute -bottom-6 left-4 w-20 h-20 rounded-full border-4 border-white object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{previewCreator.name}</h2>
            <p className="text-sm text-gray-600">{previewCreator.location}</p>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm m-1 text-gray-700">
                {previewCreator.rating} ({previewCreator.reviewCount})
              </span>
            </div>

            <p className="text-sm">{previewCreator.followers.toLocaleString()} followers</p>
          </div>
        </div>

        <p className="mt-4 text-base text-gray-800">{previewCreator.bio}</p>

        <h3 className="text-sm mt-6 mb-3">Portfolio Highlights</h3>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <img
              key={item}
              src={avatar}
              alt="video"
              className="w-full rounded-lg h-48 object-cover"
            />
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Demographics</h3>
          <AudienceDemographics className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2" />
        </div>
        <h3 className="text-lg font-bold mt-6 mb-3">Recent Reviews</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition duration-200"
            >
              {/* Brand Header */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={review.logo}
                  alt={review.brand}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <p className="font-semibold text-gray-800">{review.brand}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-gray-700 mb-2">{review.text}</p>

              {/* Rating */}
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg sticky w-full bottom-0 p-4 border-t flex justify-between">
        <CustomButton text="Close" className="btn-cancel" onClick={() => setIsPreviewOpen(false)} />

        <CustomButton
          text="View Full Profile"
          className="btn-primary"
          onClick={() => router.push("creator-portfolio")}
        />
      </div>
    </div>
  );
}

export default CreatorPreview;

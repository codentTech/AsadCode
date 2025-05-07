import CustomButton from "@/common/components/custom-button/custom-button.component";
import { avatar } from "@/common/constants/auth.constant";
import TiktokIcon from "@/common/icons/tiktok";
import Niche from "@/components/niche/niche";
import {
  BookmarkPlus,
  Edit2,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Share2,
  Star,
  Youtube,
} from "lucide-react";

function ProfileOverview() {
  const creator = {
    name: "Sophia Chen",
    handle: "@sophia.creates",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 42,
    followers: 85400,
    following: 523,
    socialMedia: ["instagram", "youtube", "tiktok"],
    profilePic: "/api/placeholder/150/150",
  };
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between">
        {/* Left Side - Profile Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={avatar}
              alt={creator.name}
              className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-md ring-2 ring-primary"
            />
          </div>

          {/* Profile Details */}
          <div className="text-center md:text-left">
            <h2>{creator.name}</h2>
            <p className="text-gray-500">{creator.handle}</p>

            {/* Rating */}
            <div className="flex items-center justify-center md:justify-start text-yellow-500 mb-1">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <span className="text-sm m-1 text-gray-700">
                {creator.rating} ({creator.reviewCount})
              </span>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3 justify-center md:justify-start mb-3">
              <div className="p-2 bg-pink-100 rounded-full">
                <Instagram className="w-5 h-5 text-pink-600" />
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <Youtube className="w-5 h-5 text-red-600" />
              </div>
              <div className="p-2 bg-black rounded-full">
                <TiktokIcon />
              </div>
            </div>

            {/* Location */}
            <div className="flex text-xs items-center justify-center md:justify-start text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{creator.location}</span>
            </div>

            {/* Niche Tags */}

            <Niche />
          </div>
        </div>

        {/* Right Side - Stats & Actions */}
        <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
          {/* Edit Icon (visible to profile owner) */}
          <div className="self-end p-2 text-white bg-primary rounded-lg cursor-pointer hover:bg-indigo-700 mb-4">
            <Edit2 className="w-5 h-5" />
          </div>

          {/* Followers/Following */}
          <div className="flex gap-6 mb-4 text-center">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {creator.followers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {creator.following.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <CustomButton
              text="Follow"
              startIcon={<Heart className="w-4 h-4" />}
            />

            <div className="flex gap-2 w-full">
              <CustomButton
                text="Message"
                className="btn-outline"
                startIcon={<MessageCircle className="w-4 h-4" />}
              />
              <CustomButton
                text="Shortlist"
                startIcon={<BookmarkPlus className="w-4 h-4" />}
              />

              <CustomButton
                text="share"
                className="btn-outline"
                startIcon={<Share2 className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileOverview;

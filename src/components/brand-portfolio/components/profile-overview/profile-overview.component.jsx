"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Building2, Edit, ExternalLink, Globe, MapPin } from "lucide-react";
import PropTypes from "prop-types";

function ProfileOverview({ basics, preferences, onEditProfile, onFollowBrand, canEdit }) {
  return (
    <section className="rounded-lg bg-white px-3 pb-3 pt-0 shadow-md sm:p-6">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:justify-between">
        <div className="flex w-full min-w-0 flex-row items-start justify-between gap-3 sm:gap-6">
          <div className="relative flex-shrink-0">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm sm:h-24 sm:w-32 md:h-32 md:w-32 md:rounded-lg md:border-4 md:border-white md:ring-2 md:ring-primary">
              {basics.logo ? (
                <img src={basics.logo} alt={basics.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10 md:h-12 md:w-12" />
              )}
            </div>
          </div>

          <div className="ml-auto min-w-0">
            {!canEdit && onFollowBrand ? (
              <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <CustomButton text="Follow Brand" className="btn-outline" onClick={onFollowBrand} />
              </div>
            ) : null}

            <div className="mb-2 flex flex-wrap items-center justify-start gap-2 self-start sm:gap-3">
              <h2 className="min-w-0 text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
                {basics.name}
              </h2>
              {canEdit && (
                <div className="justify-start self-start">
                  <div
                    className="rounded-md bg-primary p-1 text-white sm:p-2"
                    onClick={onEditProfile}
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-col gap-1.5 text-[10px] text-gray-600 sm:flex-row sm:flex-wrap sm:gap-2 sm:text-xs md:text-sm">
              {basics.website && (
                <a
                  href={
                    basics.website.startsWith("http") ? basics.website : `https://${basics.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-500 transition"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {basics.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {basics.location}
                </span>
              )}
            </div>

            {preferences?.targetNiches?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                {preferences.targetNiches.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 sm:px-3 sm:py-1 sm:text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

ProfileOverview.propTypes = {
  basics: PropTypes.shape({
    name: PropTypes.string,
    logo: PropTypes.string,
    website: PropTypes.string,
    location: PropTypes.string,
    email: PropTypes.string,
    isVerified: PropTypes.bool,
  }).isRequired,
  overview: PropTypes.shape({
    description: PropTypes.string,
  }),
  connections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      followers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      verified: PropTypes.bool,
      platform: PropTypes.string,
      engagementRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ),
  preferences: PropTypes.shape({
    targetNiches: PropTypes.arrayOf(PropTypes.string),
  }),
  audienceSummary: PropTypes.shape({
    totalFollowers: PropTypes.number,
    averageEngagementRate: PropTypes.number,
  }),
  onEditProfile: PropTypes.func,
  onFollowBrand: PropTypes.func,
  canEdit: PropTypes.bool,
};

ProfileOverview.defaultProps = {
  overview: null,
  connections: [],
  preferences: null,
  audienceSummary: null,
  onEditProfile: undefined,
  onFollowBrand: undefined,
  canEdit: false,
};

export default ProfileOverview;

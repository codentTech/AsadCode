"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import {
  Building2,
  CheckCircle,
  Edit,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import PropTypes from "prop-types";

function ProfileOverview({
  basics,
  overview,
  connections,
  preferences,
  audienceSummary,
  onEditProfile,
  onFollowBrand,
  canEdit,
}) {
  const { getPlatformIcon, getPlatformColor, formatFollowers } = useGetplatform();
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {/* Brand summary */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md ring-2 ring-primary overflow-hidden flex items-center justify-center bg-gray-50">
              {basics.logo ? (
                <img src={basics.logo} alt={basics.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {!canEdit && onFollowBrand && (
                <CustomButton
                  text="Follow Brand"
                  className="btn-outline !px-3 !py-1.5 text-xs"
                  onClick={onFollowBrand}
                />
              )}
            </div>

            <h2 className="text-xl font-medium text-gray-900">{basics.name}</h2>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-sm text-gray-600 mt-2">
              {basics.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {basics.location}
                </span>
              )}
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
              {basics.email && (
                <a
                  href={`mailto:${basics.email}`}
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-500 transition"
                >
                  <Mail className="w-4 h-4" />
                  {basics.email}
                </a>
              )}
            </div>

            {preferences?.targetNiches?.length ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {preferences.targetNiches.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {overview?.description && (
              <p className="mt-4 text-sm text-gray-600 leading-6 max-w-2xl">
                {overview.description}
              </p>
            )}

            {canEdit && (
              <div className="mt-6">
                <CustomButton
                  text="Edit Brand Profile"
                  className="btn-primary"
                  onClick={onEditProfile}
                  startIcon={<Edit className="w-4 h-4" />}
                />
              </div>
            )}
          </div>
        </div>

        {/* Connections */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 w-full lg:w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-indigo-900">Verified Connections</h3>
            <span className="text-xs text-indigo-600">
              {connections.length ? `${connections.length} linked` : "No connections"}
            </span>
          </div>

          {connections.length ? (
            <ul className="space-y-3">
              {connections.map((connection) => {
                const followersValue = Number(connection.followers);
                const followerDisplay = Number.isFinite(followersValue)
                  ? formatFollowers(followersValue)
                  : connection.followers || "—";
                const engagementValue = Number(connection.engagementRate);
                const hasEngagement = Number.isFinite(engagementValue);

                return (
                  <li
                    key={connection.id}
                    className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 border border-indigo-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${getPlatformColor(
                          connection.platform
                        )}`}
                      >
                        {getPlatformIcon(connection.platform)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {connection.name}
                        </p>
                        <p className="text-xs text-gray-500">Followers: {followerDisplay}</p>
                        {hasEngagement && (
                          <p className="text-xs text-gray-400">
                            Engagement: {engagementValue.toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>
                    {connection.verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-sm text-indigo-700 bg-indigo-100 rounded-lg p-3">
              Connect your brand's social accounts to unlock audience analytics and build trust with
              creators.
            </div>
          )}
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

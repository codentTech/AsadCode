import React from "react";
import Modal from "@/common/components/modal/modal.component";
import { FileText, Layers3, Target } from "lucide-react";
import useCampaignBriefModal from "./use-campaign-brief-modal.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

const CampaignBriefModal = ({ show, onClose, campaign }) => {
  if (!campaign) return null;

  const isIndividualCreator =
    campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
    campaign.campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
    campaign.isIndividualCollaboration;

  const contract = campaign.contract || campaign.campaign?.contract;
  const dataToUse = isIndividualCreator && contract ? contract : campaign.campaign || campaign;

  const {
    title,
    imageSrc,
    heroStats,
    nicheTags,
    deliverableTags,
    requiredPlatforms,
    platformMinimums,
    contentSections,
    styleGuideFileUrl,
    styleGuideFileName,
    guidelineGroups,
    quickFields,
    isIndividualCreator: isIndividual,
  } = useCampaignBriefModal(dataToUse, isIndividualCreator);

  return (
    <Modal show={show} title="Campaign Brief" onClose={onClose} size="lg">
      <div className="mx-auto max-w-5xl space-y-3 text-gray-900 sm:space-y-4">
        <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-3">
              <h1 className="truncate text-sm font-bold uppercase leading-snug text-indigo-900 sm:text-xl">
                {title}
              </h1>

              {quickFields.length > 0 && (
                <dl className="grid gap-2 text-[10px] sm:grid-cols-2 sm:gap-3 sm:text-sm lg:grid-cols-3">
                  {quickFields.map((field) => (
                    <div key={field.label} className="space-y-1">
                      <dt className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-xs">
                        {field.label}
                      </dt>
                      <dd className="font-medium text-gray-900">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {heroStats.length > 0 && (
                <div className="grid grid-cols-2 gap-2 text-[10px] sm:grid-cols-4 sm:text-xs">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2"
                    >
                      <div className="text-indigo-500">{stat.label}</div>
                      <div className="text-xs font-semibold text-indigo-700 sm:text-sm">{stat.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {imageSrc && (
              <div className="flex justify-end sm:pl-6">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow">
                  <img
                    src={imageSrc.startsWith("http") ? imageSrc : imageSrc || ""}
                    alt="Campaign visual"
                    className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {(nicheTags.length > 0 || deliverableTags.length > 0) && (
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
                <header className="flex items-center gap-2">
                  <Layers3 className="h-4 w-4 text-indigo-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                    Campaign Niches & Deliverables
                  </h2>
                </header>
                <div className="mt-3 grid gap-3 md:grid-cols-2 md:gap-4">
                  {nicheTags.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Niches
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {nicheTags.map((item) => (
                          <span
                            key={item.id}
                            className="rounded-lg bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 sm:px-2.5 sm:text-xs"
                          >
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {deliverableTags.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Deliverables
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {deliverableTags.map((item) => (
                          <span
                            key={item.id}
                            className="rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 sm:px-2.5 sm:text-xs"
                          >
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(contentSections.length > 0 || guidelineGroups.length > 0) && (
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
                <header className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                    Description
                  </h2>
                </header>

                <div className="mt-3 space-y-4">
                  {contentSections.map((section) => {
                    const baseClasses = "rounded-lg border px-3 py-2 text-xs sm:text-sm";
                    const toneClasses = {
                      muted: "border-gray-200 bg-gray-50",
                      rich: "border-gray-200 bg-white",
                      accent: "border-indigo-100 bg-indigo-50 text-indigo-700",
                      warning: "border-amber-200 bg-amber-50 text-amber-800",
                    };
                    return (
                      <div key={section.title}>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          {section.title}
                        </p>
                        <p
                          className={`${baseClasses} ${toneClasses[section.tone] || toneClasses.muted} mt-2 leading-relaxed whitespace-pre-line`}
                        >
                          {section.body}
                        </p>
                      </div>
                    );
                  })}

                  {styleGuideFileUrl && (
                    <>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Style Guide File
                      </p>
                      <a
                        href={styleGuideFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full flex items-center justify-between gap-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-100"
                      >
                        <span className="truncate">{styleGuideFileName || "View style guide"}</span>
                      </a>
                    </>
                  )}

                  {guidelineGroups.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Content Guidelines
                      </p>
                      <div className="mt-2 grid gap-3">
                        {guidelineGroups.map((group) => (
                          <div
                            key={group.title}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                          >
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                              {group.title}
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-800 sm:text-sm">
                              {group.items.map((item, index) => (
                                <li key={`${group.title}-${index}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {!isIndividual &&
              (campaign.min_combined_followers ||
                requiredPlatforms.length > 0 ||
                platformMinimums.length > 0) && (
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
                  <header className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-600" />
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                      Audience Requirements
                    </h2>
                  </header>
                  <div className="mt-3 space-y-3 text-xs text-gray-700 sm:text-sm">
                    {campaign.min_combined_followers && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Min Followers</span>
                        <span className="font-medium text-gray-900">
                          {parseInt(campaign.min_combined_followers, 10).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {requiredPlatforms.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Required Platforms
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {requiredPlatforms.map((platform) => (
                            <span
                              key={platform.id}
                              className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                            >
                              {platform.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {platformMinimums.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Platform Minimums
                        </p>
                        <div className="mt-2 space-y-2">
                          {platformMinimums.map((minimum) => (
                            <div
                              key={minimum.id}
                              className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                            >
                              <span className="text-xs uppercase text-gray-500">
                                {minimum.platform}
                              </span>
                              <span className="text-xs font-medium text-gray-900 sm:text-sm">
                                {minimum.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default CampaignBriefModal;

import FieldLabel from "@/common/components/field-label/field-label.component";
import { Check, CircleAlert, Eye, FileText } from "lucide-react";
import Link from "next/link";
import usePreview from "./use-preview.hook";

function PreviewSection({ children }) {
  return <section className="rounded-lg border border-gray-200 p-3">{children}</section>;
}

function SectionLabel({ label }) {
  return <p className="mb-2 text-xs font-semibold text-black sm:text-sm">{label}</p>;
}

function MetaCard({ label, value, icon = null, colorClasses = "" }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-gray-100 px-2.5 py-2">
      <span className="flex min-w-0 items-center gap-1.5">
        {icon ? (
          <span className={`rounded-md p-1 ${colorClasses || "bg-white text-gray-700"}`}>
            {icon}
          </span>
        ) : null}
        <span className="shrink-0 text-[10px] font-medium text-gray-800 sm:text-xs">{label}</span>
      </span>
      <span className="min-w-0 truncate text-right text-[10px] font-medium text-gray-800 sm:text-xs">
        {value}
      </span>
    </div>
  );
}

function Preview({ campaignData, handleChange }) {
  const {
    title,
    imageSrc,
    heroStats,
    nicheTags,
    deliverableTags,
    requiredPlatforms,
    platformMinimums,
    contentSections,
    trimmedQuestions,
    styleGuideFileUrl,
    styleGuideFileName,
    termsAgreed,
    termsHref,
    privacyHref,
    quickFields,
    guidelineGroups,
  } = usePreview(campaignData);

  const hasAudience =
    campaignData.min_combined_followers ||
    requiredPlatforms.length > 0 ||
    platformMinimums.length > 0;

  const hasNichesOrDeliverables = nicheTags.length > 0 || deliverableTags.length > 0;
  const hasBrief =
    contentSections.length > 0 ||
    guidelineGroups.length > 0 ||
    trimmedQuestions.length > 0 ||
    styleGuideFileUrl;

  return (
    <div className="flex w-full flex-col gap-3 text-left">
      <PreviewSection>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Campaign visual"
              className="h-36 w-28 shrink-0 rounded-lg border border-gray-200 object-cover sm:h-44 sm:w-36 md:h-52 md:w-40"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold text-black sm:text-lg md:text-xl">{title}</h1>
            {quickFields.length > 0 ? (
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {quickFields.map((field) => (
                  <MetaCard key={field.id} label={field.label} value={field.value} />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {heroStats.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between gap-2 rounded-md bg-gray-100 px-2.5 py-2"
              >
                <span className="shrink-0 text-[10px] font-medium text-gray-800 sm:text-xs">
                  {stat.label}
                </span>
                <span className="min-w-0 truncate text-right text-[10px] font-medium tabular-nums text-gray-800 sm:text-xs">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </PreviewSection>

      {hasNichesOrDeliverables ? (
        <PreviewSection>
          <SectionLabel label="Niches & Deliverables" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {nicheTags.length > 0 ? (
              <div className="min-w-0 rounded-md bg-gray-100 p-2.5">
                <p className="text-[10px] font-medium text-gray-800 sm:text-xs">Niches</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {nicheTags.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary sm:text-xs"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {deliverableTags.length > 0 ? (
              <div className="min-w-0 rounded-md bg-gray-100 p-2.5">
                <p className="text-[10px] font-medium text-gray-800 sm:text-xs">Deliverables</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {deliverableTags.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-800 sm:text-xs"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </PreviewSection>
      ) : null}

      {hasAudience ? (
        <PreviewSection>
          <SectionLabel label="Audience Requirements" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {campaignData.min_combined_followers ? (
              <MetaCard
                label="Min. Combined Followers"
                value={parseInt(campaignData.min_combined_followers, 10).toLocaleString()}
              />
            ) : null}
            {requiredPlatforms.length > 0 ? (
              <div className="sm:col-span-2">
                <p className="text-[10px] font-medium text-gray-800 sm:text-xs">
                  Required Platforms
                </p>
                <div className="mt-2 flex justify-between rounded-md bg-gray-100 p-2.5  gap-1.5">
                  {requiredPlatforms.map((platform) => (
                    <span
                      key={platform.id}
                      className={`flex justify-between items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium sm:text-xs ${
                        platform.colorClasses || "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {platform.icon}
                      {platform.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {platformMinimums.length > 0
              ? platformMinimums.map((minimum) => (
                  <MetaCard
                    key={minimum.id}
                    label={`${minimum.label} Minimum`}
                    value={minimum.value}
                    icon={minimum.icon}
                    colorClasses={minimum.colorClasses}
                  />
                ))
              : null}
          </div>
        </PreviewSection>
      ) : null}

      {hasBrief ? (
        <PreviewSection>
          <div className="flex flex-col gap-3">
            {contentSections.map((section) => (
              <div key={section.title} className="min-w-0 rounded-md bg-gray-100 p-2.5">
                <p className="text-[10px] font-medium text-gray-800 sm:text-xs">{section.title}</p>
                <p className="mt-1 whitespace-pre-line text-[10px] font-medium leading-snug text-gray-800 sm:text-xs">
                  {section.body}
                </p>
              </div>
            ))}

            {styleGuideFileUrl ? (
              <div className="min-w-0">
                <FieldLabel label="Reference File" />
                <a
                  href={styleGuideFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 flex h-9 items-center gap-2 rounded-[5px] bg-gray-100 px-2.5 text-[10px] font-medium text-gray-800 hover:bg-gray-200 sm:h-[40px] sm:text-xs"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">
                    {styleGuideFileName || "View reference file"}
                  </span>
                  <Eye className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            ) : null}

            {guidelineGroups.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {guidelineGroups.map((group) => {
                  const isDo = /do/i.test(group.title) && !/don.?t/i.test(group.title);
                  return (
                    <div
                      key={group.title}
                      className={`rounded-lg border p-3 ${
                        isDo
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-rose-200 bg-rose-50/40"
                      }`}
                    >
                      <div
                        className={`mb-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 ${
                          isDo
                            ? "bg-emerald-100/80 text-emerald-700"
                            : "bg-rose-100/80 text-rose-700"
                        }`}
                      >
                        {isDo ? (
                          <Check className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <CircleAlert className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-black">{group.title}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {group.items.map((item, index) => (
                          <li
                            key={`${group.title}-${index}`}
                            className="flex items-start gap-2 rounded-md bg-gray-200 px-2.5 py-2 text-xs text-gray-800"
                          >
                            <span className="mt-0.5 select-none text-gray-600">•</span>
                            <span className="min-w-0 flex-1 leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {trimmedQuestions.length > 0 ? (
              <div className="min-w-0">
                <FieldLabel label="Creator Questions" />
                <ul className="mt-1.5 space-y-1.5">
                  {trimmedQuestions.map((question, index) => (
                    <li
                      key={`${question}-${index}`}
                      className="flex items-start gap-2 rounded-md bg-gray-200 px-2.5 py-2"
                    >
                      <span className="mt-0.5 select-none text-xs text-gray-600">•</span>
                      <span className="min-w-0 flex-1 text-xs leading-snug text-gray-800 sm:text-sm">
                        {question}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </PreviewSection>
      ) : null}

      <PreviewSection>
        <SectionLabel label="Publish" />
        <label htmlFor="terms" className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            id="terms"
            name="termsAgreed"
            checked={termsAgreed}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-[10px] leading-snug text-gray-700 sm:text-xs">
            I confirm that the information above is accurate and I agree to the{" "}
            <Link href={termsHref} className="font-semibold text-primary underline">
              Terms of Service
            </Link>{" "}
            &{" "}
            <Link href={privacyHref} className="font-semibold text-primary underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {!termsAgreed ? (
          <p className="mt-2 rounded-md bg-gray-100 px-2.5 py-2 text-[10px] font-medium text-gray-800 sm:text-xs">
            Accept the terms to publish your campaign.
          </p>
        ) : null}
      </PreviewSection>
    </div>
  );
}

export default Preview;

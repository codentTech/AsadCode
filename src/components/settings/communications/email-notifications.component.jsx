import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { CircularProgress } from "@mui/material";
import { Lock } from "lucide-react";
import useEmailNotifications from "./use-email-notifications.hook";

const EmailNotificationToggleRow = ({ field, checked, savingKey, onToggle }) => {
  const isRowSaving = savingKey === field.key;

  return (
    <li className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0">
      <span className="min-w-0 flex-1 text-xs text-gray-800 sm:text-sm">{field.label}</span>
      <div className="flex shrink-0 items-center gap-2">
        {isRowSaving ? (
          <CircularProgress className="shrink-0 text-primary" size={16} />
        ) : null}
        <CustomSwitch
          checked={checked}
          onChange={(e) => onToggle(field.key, e.target.checked)}
          disabled={isRowSaving}
        />
      </div>
    </li>
  );
};

const ToggleRowSkeleton = () => (
  <li className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0">
    <Skeleton className="h-3 min-w-0 flex-1 sm:h-4" />
    <Skeleton className="h-5 w-9 shrink-0 rounded-full" />
  </li>
);

const AlwaysOnRowSkeleton = () => (
  <li className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
    <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-3 w-full sm:h-4" />
      <Skeleton className="h-2 w-4/5 sm:h-3" />
    </div>
  </li>
);

const EmailNotificationsSkeleton = ({ alwaysOnCount, highlyRecommendedCount, recommendedCount }) => (
  <div className="space-y-6" aria-busy="true" aria-label="Loading email preferences">
    <section>
      <Skeleton className="mb-3 h-3 w-20 sm:h-4 sm:w-24" />
      <ul className="space-y-3">
        {Array.from({ length: alwaysOnCount }).map((_, i) => (
          <AlwaysOnRowSkeleton key={`always-on-${i}`} />
        ))}
      </ul>
    </section>
    <section>
      <Skeleton className="mb-3 h-3 w-32 sm:h-4 sm:w-40" />
      <ul className="space-y-3">
        {Array.from({ length: highlyRecommendedCount }).map((_, i) => (
          <ToggleRowSkeleton key={`highly-${i}`} />
        ))}
      </ul>
    </section>
    <section>
      <Skeleton className="mb-3 h-3 w-24 sm:h-4 sm:w-28" />
      <ul className="space-y-3">
        {Array.from({ length: recommendedCount }).map((_, i) => (
          <ToggleRowSkeleton key={`recommended-${i}`} />
        ))}
      </ul>
    </section>
  </div>
);

const EmailNotifications = () => {
  const {
    isLoading,
    savingKey,
    preferences,
    alwaysOnItems,
    toggleFields,
    handleToggle,
  } = useEmailNotifications();

  const highlyRecommended = toggleFields.filter((f) => f.tier === "highly_recommended");
  const recommended = toggleFields.filter((f) => f.tier === "recommended");

  return (
    <>
      <div className="rounded-lg bg-primary p-3 text-center sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
          Email Notifications
        </h1>
        <p className="text-[10px] text-white sm:text-xs md:text-sm">
          Choose which emails you want to receive from CleerCut
        </p>
      </div>

      <div className="mt-4 rounded-lg bg-white p-3 shadow sm:p-6">
        {isLoading ? (
          <EmailNotificationsSkeleton
            alwaysOnCount={alwaysOnItems.length}
            highlyRecommendedCount={highlyRecommended.length}
            recommendedCount={recommended.length}
          />
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">
                Always on
              </h2>
              <ul className="space-y-3">
                {alwaysOnItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
                  >
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-800 sm:text-sm">{item.label}</p>
                      <p className="text-[10px] text-gray-500 sm:text-xs">
                        These transactional emails cannot be turned off
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">
                Highly recommended
              </h2>
              <ul className="space-y-3">
                {highlyRecommended.map((field) => (
                  <EmailNotificationToggleRow
                    key={field.key}
                    field={field}
                    checked={Boolean(preferences[field.key])}
                    savingKey={savingKey}
                    onToggle={handleToggle}
                  />
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">
                Recommended
              </h2>
              <ul className="space-y-3">
                {recommended.map((field) => (
                  <EmailNotificationToggleRow
                    key={field.key}
                    field={field}
                    checked={Boolean(preferences[field.key])}
                    savingKey={savingKey}
                    onToggle={handleToggle}
                  />
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default EmailNotifications;

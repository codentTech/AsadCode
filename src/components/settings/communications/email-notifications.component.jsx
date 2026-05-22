import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import { Lock } from "lucide-react";
import useEmailNotifications from "./use-email-notifications.hook";

const EmailNotifications = () => {
  const {
    isLoading,
    isSaving,
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
          <p className="text-xs text-gray-500 sm:text-sm">Loading preferences...</p>
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
                  <li
                    key={field.key}
                    className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0"
                  >
                    <span className="text-xs text-gray-800 sm:text-sm">{field.label}</span>
                    <CustomSwitch
                      checked={Boolean(preferences[field.key])}
                      onChange={(e) => handleToggle(field.key, e.target.checked)}
                      disabled={isSaving}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">
                Recommended
              </h2>
              <ul className="space-y-3">
                {recommended.map((field) => (
                  <li
                    key={field.key}
                    className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0"
                  >
                    <span className="text-xs text-gray-800 sm:text-sm">{field.label}</span>
                    <CustomSwitch
                      checked={Boolean(preferences[field.key])}
                      onChange={(e) => handleToggle(field.key, e.target.checked)}
                      disabled={isSaving}
                    />
                  </li>
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

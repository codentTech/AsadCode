import DashboardLayout from "@/common/layouts/dashboard-layout";
import { Bell, Sparkles, RefreshCw, AlertCircle, CheckCircle2, Users, Info } from "lucide-react";
import useNotificationsBrand from "./use-notifications-brand.hook";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { NOTIFICATION_SECTION } from "@/common/utils/notification-categorizer.util";
import NotificationSection from "./components/notification-section.component";

function NotificationsBrand() {
  const {
    campaignOptions,
    selectedCampaignId,
    handleCampaignChange,
    campaignsLoading,
    actionRequiredNotifications,
    categorizedNotifications,
    isLoading,
    isRefreshing,
    refreshNotifications,
    markAsRead,
    dismissNotification,
    markAllAsRead,
    handleNotificationClick,
  } = useNotificationsBrand();

  const totalEventNotifications = Object.values(categorizedNotifications).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const totalNotifications = actionRequiredNotifications.length + totalEventNotifications;

  const unreadEventCount = Object.values(categorizedNotifications).reduce(
    (sum, arr) => sum + arr.filter((n) => !n.is_read).length,
    0
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
        {/* Header */}
        <div className="mb-4 sticky top-0 bg-primary z-10 shadow-sm rounded-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Title and stats */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Bell className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  {(actionRequiredNotifications.length > 0 || unreadEventCount > 0) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-white">
                        {actionRequiredNotifications.length + unreadEventCount}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-white">Notifications</h1>
                  <div className="flex items-center gap-2">
                    {actionRequiredNotifications.length > 0 || unreadEventCount > 0 ? (
                      <>
                        <span className="text-xs font-medium text-white/90">
                          {actionRequiredNotifications.length + unreadEventCount} require attention
                        </span>
                        <span className="w-1 h-1 bg-white/50 rounded-full" />
                        <span className="text-xs text-white/70">{totalNotifications} total</span>
                      </>
                    ) : (
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-white/90" />
                        All caught up
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Center - Campaign Selector */}
              {!campaignsLoading && campaignOptions.length > 0 && (
                <div className="w-full max-w-[300px]">
                  <SimpleSelect
                    options={campaignOptions}
                    value={
                      selectedCampaignId
                        ? campaignOptions.find((opt) => opt.value === selectedCampaignId)
                        : null
                    }
                    onChange={(option) => handleCampaignChange(option)}
                    placeHolder="Select a campaign"
                    className="w-64"
                  />
                </div>
              )}

              {/* Right side - Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={refreshNotifications}
                  disabled={isRefreshing || isLoading}
                  className="text-white bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh notifications"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                    strokeWidth={2.5}
                  />
                </button>
                {unreadEventCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 pb-6">
          {isLoading && totalNotifications === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-pulse">
                <Bell className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Loading notifications...
              </h3>
            </div>
          ) : totalNotifications === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">No notifications yet</h3>
              <p className="text-xs text-gray-600">
                {selectedCampaignId && selectedCampaignId !== "all"
                  ? "No notifications for this campaign"
                  : "When you receive invitations or updates, they'll appear here"}
              </p>
            </div>
          ) : (
            <div>
              {/* Action Required Section */}
              {actionRequiredNotifications.length > 0 && (
                <NotificationSection
                  title="Action Required"
                  icon={AlertCircle}
                  notifications={actionRequiredNotifications}
                  isActionRequired={true}
                  onClick={handleNotificationClick}
                  emptyMessage="No action needed. You're all caught up."
                />
              )}

              {/* Execution Updates Section */}
              <NotificationSection
                title="Execution Updates"
                icon={CheckCircle2}
                notifications={categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES]}
                isActionRequired={false}
                onMarkAsRead={markAsRead}
                onDismiss={dismissNotification}
                onClick={handleNotificationClick}
                emptyMessage="No execution updates"
              />

              {/* Applications Section */}
              <NotificationSection
                title="Applications"
                icon={Users}
                notifications={categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS]}
                isActionRequired={false}
                onMarkAsRead={markAsRead}
                onDismiss={dismissNotification}
                onClick={handleNotificationClick}
                emptyMessage="No application updates"
              />

              {/* Other Updates Section */}
              <NotificationSection
                title="Other Updates"
                icon={Info}
                notifications={categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES]}
                isActionRequired={false}
                onMarkAsRead={markAsRead}
                onDismiss={dismissNotification}
                onClick={handleNotificationClick}
                emptyMessage="No other updates"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NotificationsBrand;

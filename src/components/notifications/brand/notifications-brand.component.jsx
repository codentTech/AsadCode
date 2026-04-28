import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import HeaderLayout from "@/common/layouts/header.layout";
import { NOTIFICATION_SECTION } from "@/common/utils/notification-categorizer.util";
import { AlertCircle, Bell, CheckCircle2, Info, RefreshCw, Sparkles, Users } from "lucide-react";
import NotificationCard from "./components/notification-card.component";
import useNotificationsBrand from "./use-notifications-brand.hook";

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
    totalEventNotifications,
    totalNotifications,
    unreadEventCount,
    activeTab,
    setActiveTab,
  } = useNotificationsBrand();

  return (
    <HeaderLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
        {/* Header */}
        <div className="sticky top-0 z-10 mx-3 mb-3 max-w-7xl rounded-lg bg-primary shadow-sm mt-4 sm:mb-4">
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
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
                  <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
                    Notifications
                  </h1>
                  <div className="flex items-center gap-2">
                    {actionRequiredNotifications.length > 0 || unreadEventCount > 0 ? (
                      <>
                        <span className="text-[10px] font-medium text-white/90 sm:text-xs">
                          {actionRequiredNotifications.length + unreadEventCount} require attention
                        </span>
                        <span className="w-1 h-1 bg-white/50 rounded-full" />
                        <span className="text-[10px] text-white/70 sm:text-xs">
                          {totalNotifications} total
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-white/70 sm:text-xs">
                        <Sparkles className="w-3 h-3 text-white/90" />
                        All caught up
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Center - Campaign Selector */}
              {!campaignsLoading && campaignOptions.length > 0 && (
                <div className="order-3 w-full sm:order-none sm:max-w-[300px]">
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
              <div className="flex flex-shrink-0 items-center gap-2">
                <button
                  onClick={refreshNotifications}
                  disabled={isRefreshing || isLoading}
                  className="rounded-lg bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="rounded-lg bg-white/20 px-2.5 py-1.5 text-[10px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:px-3 sm:text-xs"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-2.5 pb-6 sm:px-4">
          {isLoading && totalNotifications === 0 ? (
            <div className="bg-white rounded-md p-8 text-center shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Bell className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Loading notifications...</h3>
              <p className="text-xs text-gray-500">Please wait while we fetch your updates</p>
            </div>
          ) : totalNotifications === 0 ? (
            <div className="bg-white rounded-md p-8 text-center shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-xs text-gray-500">
                {selectedCampaignId && selectedCampaignId !== "all"
                  ? "No notifications for this campaign"
                  : "When you receive invitations or updates, they'll appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {/* Stats Dashboard */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-4">
                {/* Action Required Stat */}
                <div
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-100 p-2.5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-3"
                  onClick={() => setActiveTab("action")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-600" strokeWidth={2} />
                      </div>
                      <p className="text-xs font-bold text-gray-900 sm:text-sm">Action Required</p>
                    </div>
                    <span className="text-base font-bold text-gray-900 sm:text-xl">
                      {actionRequiredNotifications.length}
                    </span>
                  </div>
                </div>

                {/* Execution Updates Stat */}
                <div
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-100 p-2.5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-3"
                  onClick={() => setActiveTab("execution")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" strokeWidth={2} />
                      </div>
                      <p className="text-xs font-bold text-gray-900 sm:text-sm">
                        Execution Updates
                      </p>
                    </div>
                    <span className="text-base font-bold text-gray-900 sm:text-xl">
                      {categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES].length}
                    </span>
                  </div>
                </div>

                {/* Applications Stat */}
                <div
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-100 p-2.5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-3"
                  onClick={() => setActiveTab("applications")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" strokeWidth={2} />
                      </div>
                      <p className="text-xs font-bold text-gray-900 sm:text-sm">Applications</p>
                    </div>
                    <span className="text-base font-bold text-gray-900 sm:text-xl">
                      {categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].length}
                    </span>
                  </div>
                </div>

                {/* Other Updates Stat */}
                <div
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-100 p-2.5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-3"
                  onClick={() => setActiveTab("other")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                        <Info className="w-4 h-4 text-primary" strokeWidth={2} />
                      </div>
                      <p className="text-xs font-bold text-gray-900 sm:text-sm">Other Updates</p>
                    </div>
                    <span className="text-base font-bold text-gray-900 sm:text-xl">
                      {categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES].length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1.5 overflow-x-auto rounded-md border border-gray-200 bg-gray-100 p-1.5 shadow-sm">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-all duration-200 ${
                    activeTab === "all"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All ({totalNotifications})
                </button>
                {actionRequiredNotifications.length > 0 && (
                  <button
                    onClick={() => setActiveTab("action")}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-all duration-200 relative ${
                      activeTab === "action"
                        ? "bg-red-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Action Required
                    {actionRequiredNotifications.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                        {actionRequiredNotifications.length}
                      </span>
                    )}
                  </button>
                )}
                {categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES].length > 0 && (
                  <button
                    onClick={() => setActiveTab("execution")}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-all duration-200 ${
                      activeTab === "execution"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Execution (
                    {categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES].length})
                  </button>
                )}
                {categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].length > 0 && (
                  <button
                    onClick={() => setActiveTab("applications")}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-all duration-200 ${
                      activeTab === "applications"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Applications (
                    {categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].length})
                  </button>
                )}
                {categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES].length > 0 && (
                  <button
                    onClick={() => setActiveTab("other")}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-all duration-200 ${
                      activeTab === "other"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Other ({categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES].length})
                  </button>
                )}
              </div>

              {/* Content Area */}
              <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                <div className="p-2.5 sm:p-4">
                  {/* Action Required Tab */}
                  {activeTab === "action" && actionRequiredNotifications.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-red-600" strokeWidth={2} />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-gray-900">Action Required</h2>
                          <p className="text-xs text-gray-500">
                            These items need your immediate attention
                          </p>
                        </div>
                      </div>
                      {actionRequiredNotifications.map((notification) => (
                        <NotificationCard
                          key={
                            notification.id ||
                            `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
                          }
                          notification={notification}
                          isActionRequired={true}
                          onClick={() => handleNotificationClick(notification)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Execution Updates Tab */}
                  {activeTab === "execution" &&
                    categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES].length > 0 && (
                      <div className="space-y-3">
                        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold text-gray-900 sm:text-lg">
                              Execution Updates
                            </h2>
                            <p className="text-xs text-gray-500">
                              Campaign progress and milestones
                            </p>
                          </div>
                        </div>
                        {categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES].map(
                          (notification) => (
                            <NotificationCard
                              key={
                                notification.id ||
                                `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
                              }
                              notification={notification}
                              isActionRequired={false}
                              onMarkAsRead={markAsRead}
                              onDismiss={dismissNotification}
                              onClick={() => handleNotificationClick(notification)}
                            />
                          )
                        )}
                      </div>
                    )}

                  {/* Applications Tab */}
                  {activeTab === "applications" &&
                    categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" strokeWidth={2} />
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold text-gray-900">Applications</h2>
                            <p className="text-xs text-gray-500">New candidates and responses</p>
                          </div>
                        </div>
                        {categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].map(
                          (notification) => (
                            <NotificationCard
                              key={
                                notification.id ||
                                `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
                              }
                              notification={notification}
                              isActionRequired={false}
                              onMarkAsRead={markAsRead}
                              onDismiss={dismissNotification}
                              onClick={() => handleNotificationClick(notification)}
                            />
                          )
                        )}
                      </div>
                    )}

                  {/* Other Updates Tab */}
                  {activeTab === "other" &&
                    categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES].length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                            <Info className="w-4 h-4 text-primary" strokeWidth={2} />
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold text-gray-900">Other Updates</h2>
                            <p className="text-xs text-gray-500">General information and updates</p>
                          </div>
                        </div>
                        {categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES].map(
                          (notification) => (
                            <NotificationCard
                              key={
                                notification.id ||
                                `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
                              }
                              notification={notification}
                              isActionRequired={false}
                              onMarkAsRead={markAsRead}
                              onDismiss={dismissNotification}
                              onClick={() => handleNotificationClick(notification)}
                            />
                          )
                        )}
                      </div>
                    )}

                  {/* All Tab */}
                  {activeTab === "all" && (
                    <div className="space-y-4">
                      {actionRequiredNotifications.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 text-red-600" strokeWidth={2} />
                            </div>
                            <div>
                              <h2 className="text-sm font-semibold text-gray-900">
                                Action Required
                              </h2>
                              <p className="text-xs text-gray-500">
                                {actionRequiredNotifications.length}{" "}
                                {actionRequiredNotifications.length === 1 ? "item" : "items"} need
                                attention
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {actionRequiredNotifications.map((notification) => (
                              <NotificationCard
                                key={
                                  notification.id ||
                                  `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
                                }
                                notification={notification}
                                isActionRequired={true}
                                onClick={() => handleNotificationClick(notification)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES].length >
                        0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-primary" strokeWidth={2} />
                            </div>
                            <div>
                              <h2 className="text-sm font-semibold text-gray-900">
                                Execution Updates
                              </h2>
                              <p className="text-xs text-gray-500">
                                {
                                  categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES]
                                    .length
                                }{" "}
                                update
                                {categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES]
                                  .length !== 1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES].map(
                              (notification) => (
                                <NotificationCard
                                  key={
                                    notification.id ||
                                    `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
                                  }
                                  notification={notification}
                                  isActionRequired={false}
                                  onMarkAsRead={markAsRead}
                                  onDismiss={dismissNotification}
                                  onClick={() => handleNotificationClick(notification)}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                              <Users className="w-4 h-4 text-primary" strokeWidth={2} />
                            </div>
                            <div>
                              <h2 className="text-sm font-semibold text-gray-900">Applications</h2>
                              <p className="text-xs text-gray-500">
                                {categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].length}{" "}
                                application
                                {categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS]
                                  .length !== 1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].map(
                              (notification) => (
                                <NotificationCard
                                  key={
                                    notification.id ||
                                    `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
                                  }
                                  notification={notification}
                                  isActionRequired={false}
                                  onMarkAsRead={markAsRead}
                                  onDismiss={dismissNotification}
                                  onClick={() => handleNotificationClick(notification)}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES].length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                              <Info className="w-4 h-4 text-primary" strokeWidth={2} />
                            </div>
                            <div>
                              <h2 className="text-sm font-semibold text-gray-900">Other Updates</h2>
                              <p className="text-xs text-gray-500">
                                {
                                  categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES]
                                    .length
                                }{" "}
                                update
                                {categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES]
                                  .length !== 1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES].map(
                              (notification) => (
                                <NotificationCard
                                  key={
                                    notification.id ||
                                    `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
                                  }
                                  notification={notification}
                                  isActionRequired={false}
                                  onMarkAsRead={markAsRead}
                                  onDismiss={dismissNotification}
                                  onClick={() => handleNotificationClick(notification)}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empty State for Active Tab */}
                  {((activeTab === "action" && actionRequiredNotifications.length === 0) ||
                    (activeTab === "execution" &&
                      categorizedNotifications[NOTIFICATION_SECTION.EXECUTION_UPDATES].length ===
                        0) ||
                    (activeTab === "applications" &&
                      categorizedNotifications[NOTIFICATION_SECTION.APPLICATIONS].length === 0) ||
                    (activeTab === "other" &&
                      categorizedNotifications[NOTIFICATION_SECTION.OTHER_UPDATES].length ===
                        0)) && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-gray-400" strokeWidth={2} />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        No notifications in this category
                      </h3>
                      <p className="text-xs text-gray-500">Try selecting a different category</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}

export default NotificationsBrand;

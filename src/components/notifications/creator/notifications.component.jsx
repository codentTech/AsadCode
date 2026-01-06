import DashboardLayout from "@/common/layouts/dashboard-layout";
import { Bell, X, Sparkles, RefreshCw } from "lucide-react";
import useNotifications from "./use-notifications.hook";

function Notifications() {
  const {
    notifications,
    isLoading,
    isRefreshing,
    refreshNotifications,
    markAsRead,
    removeNotification,
    markAllAsRead,
    handleNotificationClick,
  } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
        {/* Header */}
        <div className="mb-4 sticky top-0 bg-primary z-10 shadow-sm rounded-xl">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Bell className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-white">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Notifications</h1>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 ? (
                      <>
                        <span className="text-xs font-medium text-white/90">{unreadCount} new</span>
                        <span className="w-1 h-1 bg-white/50 rounded-full" />
                        <span className="text-xs text-white/70">{notifications.length} total</span>
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

              {/* Right side - Actions */}
              <div className="flex items-center gap-2">
                {/* Refresh button */}
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
                {/* Mark all read */}
                {unreadCount > 0 && (
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
        <div className="max-w-3xl mx-auto px-4 pb-6">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">No notifications yet</h3>
              <p className="text-xs text-gray-600">
                When you receive invitations or updates, they'll appear here
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    !notification.is_read ? "border-indigo-200 shadow-sm" : "border-gray-200"
                  }`}
                >
                  {/* Unread indicator bar */}
                  {!notification.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-l-xl" />
                  )}

                  <div className="p-3 pl-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2.5">
                          {/* Icon */}
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              !notification.is_read ? "bg-indigo-100" : "bg-gray-100"
                            }`}
                          >
                            <Bell
                              className={`w-3.5 h-3.5 ${
                                !notification.is_read ? "text-indigo-600" : "text-gray-600"
                              }`}
                              strokeWidth={2}
                            />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3
                                className={`text-sm font-semibold ${
                                  !notification.is_read ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.is_read && (
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.created_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;


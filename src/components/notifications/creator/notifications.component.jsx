import HeaderLayout from "@/common/layouts/header.layout";
import { Bell, RefreshCw, Sparkles, X } from "lucide-react";
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
    <HeaderLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="sticky top-0 z-10 mx-3 mb-3 max-w-7xl rounded-lg bg-primary shadow-sm mt-4 sm:mb-4">
          <div className="mx-auto max-w-4xl px-3 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              {/* Left side */}
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Bell className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-white">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
                    Notifications
                  </h1>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 ? (
                      <>
                        <span className="text-[10px] font-medium text-white/90 sm:text-xs">
                          {unreadCount} new
                        </span>
                        <span className="w-1 h-1 bg-white/50 rounded-full" />
                        <span className="text-[10px] text-white/70 sm:text-xs">
                          {notifications.length} total
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
                {unreadCount > 0 && (
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

        <div className="mx-auto max-w-3xl px-2.5 pb-6 sm:px-4">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900 sm:text-base">
                No notifications yet
              </h3>
              <p className="text-[10px] text-gray-600 sm:text-xs">
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

                  <div className="p-2.5 pl-3 sm:p-3 sm:pl-4">
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
                                className={`text-xs font-semibold sm:text-sm ${
                                  !notification.is_read ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.is_read && (
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="mb-1 text-[10px] leading-relaxed text-gray-600 sm:text-xs">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-gray-500 sm:text-xs">
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
                            className="rounded-lg px-2 py-1 text-[10px] font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 sm:text-xs"
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
    </HeaderLayout>
  );
}

export default Notifications;

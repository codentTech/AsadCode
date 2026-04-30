import { Bell, X, AlertCircle } from "lucide-react";

function NotificationCard({ notification, isActionRequired, onMarkAsRead, onDismiss, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
        !notification.is_read && !isActionRequired
          ? "border-indigo-200 shadow-sm"
          : "border-gray-200"
      }`}
    >
      {!notification.is_read && !isActionRequired && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-l-xl" />
      )}

      <div className="p-2.5 pl-3 sm:p-3 sm:pl-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActionRequired
                    ? "bg-red-100"
                    : !notification.is_read
                      ? "bg-indigo-100"
                      : "bg-gray-100"
                }`}
              >
                {isActionRequired ? (
                  <AlertCircle className={`w-3.5 h-3.5 text-red-600`} strokeWidth={2} />
                ) : (
                  <Bell
                    className={`w-3.5 h-3.5 ${
                      !notification.is_read ? "text-indigo-600" : "text-gray-600"
                    }`}
                    strokeWidth={2}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3
                    className={`text-xs font-semibold sm:text-sm ${
                      isActionRequired
                        ? "text-red-900"
                        : !notification.is_read
                          ? "text-gray-900"
                          : "text-gray-700"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  {!notification.is_read && !isActionRequired && (
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="mb-1 text-[10px] leading-relaxed text-gray-600 sm:text-xs">
                  {notification.message}
                </p>
                <p className="text-[10px] text-gray-500 sm:text-xs">
                  {new Date(notification.created_at || Date.now()).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {!isActionRequired && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!notification.is_read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="rounded-lg px-2 py-1 text-[10px] font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 sm:text-xs"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(notification.id);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;


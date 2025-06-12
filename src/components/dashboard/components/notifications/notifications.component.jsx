import { Bell, X } from "lucide-react";
import React from "react";
import useNotifications from "./use-notifications.hook";
import CustomButton from "@/common/components/custom-button/custom-button.component";

function Notifications({ notifications, setNotifications }) {
  const { markAsRead, removeNotification } = useNotifications({ setNotifications });
  return (
    <div className="flex gap-60">
      <div className="w-[50%] space-y-4">
        {notifications["brand"].length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-2 text-xs text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          notifications["brand"].map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                notification.unread ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{notification.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                      {notification.unread && (
                        <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-600 mt-2">{notification.time}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {notification.unread && (
                    <CustomButton
                      text="Mark as read"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-100 transition-colors hover:bg-transparent"
                    />
                  )}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center items-center">
        <Bell size={420} className="text-orange-500 rotate-45" />
      </div>
    </div>
  );
}

export default Notifications;

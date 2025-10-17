"use client";

import ROLES from "@/common/constants/role.constant";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { Bell, Menu } from "lucide-react";
import useHeader from "./use-header.hook";

const DashboardHeader = ({ onMenuClick }) => {
  const {
    router,
    currentUser,
    showNotificationDropdown,
    setShowNotificationDropdown,
    showProfileDropdown,
    setShowProfileDropdown,
    getUserInitials,
    profileMenuItems,
    notifications,
    unreadCount,
    handleNotificationClick,
  } = useHeader();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between mr-6 ml-1 py-[10px]">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentUser?.role === ROLES.ADMIN
              ? "Admin Dashboard"
              : currentUser?.role === ROLES.CREATOR
                ? "Creator Dashboard"
                : "Brand Dashboard"}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications Bell */}
          <button
            onClick={() => {
              setShowNotificationDropdown(!showNotificationDropdown);
              setShowProfileDropdown(false);
            }}
            className="bg-gray-200 p-2 rounded-full cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount !== 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotificationDropdown(false);
              }}
              className="flex items-center space-x-2 p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="relative">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.first_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getUserInitials(currentUser?.first_name)}
                  </div>
                )}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{currentUser?.first_name}</p>
                <p className="text-xs text-gray-500">{capitalizeFirstLetter(currentUser?.role)}</p>
              </div>
            </button>

            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />

                <div className="absolute top-12 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {currentUser?.avatar ? (
                        <img
                          src={currentUser?.avatar}
                          alt={currentUser?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials(currentUser?.first_name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {currentUser?.first_name} {currentUser?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    {profileMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${
                          item.className || "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotificationDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowNotificationDropdown(false)} />
          <div className="absolute top-16 right-24 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-2 px-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                      notification.is_read
                        ? "bg-white hover:bg-gray-50"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default DashboardHeader;

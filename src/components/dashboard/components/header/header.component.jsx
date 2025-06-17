"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Bell, Menu } from "lucide-react";
import useHeader from "./use-header.hook";

const DashboardHeader = ({ onMenuClick, unreadCount = 0, notifications }) => {
  const {
    router,
    currentUser,
    showNotificationDropdown,
    setShowNotificationDropdown,
    showProfileDropdown,
    setShowProfileDropdown,
    getUserInitials,
    profileMenuItems,
  } = useHeader();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between mr-6 ml-1 py-[10px]">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
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
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getUserInitials(currentUser.name)}
                  </div>
                )}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
            </button>

            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />

                <div className="absolute top-12 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials(currentUser.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
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
        <div className="absolute top-16 right-24 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-2 px-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">Recent Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications["brand"].slice(0, 3).map((notification) => (
              <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{notification.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{notification.title}</p>
                    <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-200">
            <CustomButton
              text="View All Notifications"
              className="w-full btn-secondary"
              onClick={() => {
                router.push("notifications");
                setShowNotificationDropdown(false);
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;

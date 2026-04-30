"use client";

import ROLES from "@/common/constants/role.constant";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { Menu } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="shrink-0 text-gray-600 hover:text-gray-900 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <h2 className="truncate text-base font-bold text-gray-900 sm:text-xl md:text-2xl">
            {currentUser?.role === ROLES.ADMIN
              ? "Admin Dashboard"
              : currentUser?.role === ROLES.CREATOR
                ? "Creator Dashboard"
                : "Brand Dashboard"}
          </h2>
        </div>

        <div className="flex shrink-0 items-center space-x-2 sm:space-x-3">
          {/* Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
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
    </header>
  );
};

export default DashboardHeader;

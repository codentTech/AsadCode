"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";

const Header = ({ onMenuClick, unreadCount = 0, notifications, setCurrentBar }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount !== 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Dropdown Preview */}
      {showDropdown && (
        <div className="absolute top-12 right-10 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
                setCurrentBar("Notifications");
                setShowDropdown(false);
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

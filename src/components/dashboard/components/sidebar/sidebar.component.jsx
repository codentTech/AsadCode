"use client";

import { Bell, Settings, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between py-[14px] shadow-sm border-b border-gray-200 px-6">
          <Link href="/" className="flex items-center cursor-pointer">
            <Image src="/assets/images/horizontal-logo.png" alt="logo" width={120} height={120} />
          </Link>
          <button onClick={onClose} className="lg:hidden text-white hover:text-indigo-200">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-4">
          <div className="px-6 mb-3">
            <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
              <Users className="text-indigo-600" size={20} />
              <span className="font-medium text-indigo-900">User Waitlist</span>
            </div>
          </div>

          <div className="px-6 mb-3">
            <a
              href="#"
              className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Bell size={20} />
              <span>Notifications</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

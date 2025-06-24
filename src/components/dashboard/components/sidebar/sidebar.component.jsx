"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSidebar from "../../../../common/components/dashboard/sidebar/use-sidebar";

function Sidebar({ menuItems, isOpen, onClose, setCurrentBar, currentBar }) {
  const { expandedSections, activeItem, navItems, handleItemClick } = useSidebar();

  const renderNavItem = (item, depth = 0, parentPath = "") => {
    const { label, icon: Icon, children, href } = item;
    const currentPath = parentPath ? `${parentPath}.${label}` : label;

    // Add null safety check for expandedSections
    const isExpanded = expandedSections?.[currentPath] || false;
    const hasChildren = children && children.length > 0;

    // For leaf items (final level with href)
    if (href) {
      return (
        <button
          key={href}
          onClick={() => handleItemClick({ href, label, currentPath, hasChildren: false })}
          className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
            activeItem === label
              ? "bg-indigo-50 text-primary font-medium border-l-2 border-primary"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
          style={{ marginLeft: `${depth * 12}px` }}
        >
          {label}
        </button>
      );
    }

    return (
      <div key={currentPath} className="space-y-2">
        {/* Section header */}
        <button
          onClick={() => {
            if (hasChildren) {
              handleItemClick({ hasChildren: true, currentPath, label });
            } else {
              setCurrentBar?.(label);
            }
          }}
          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors group ${
            depth === 0 && currentBar === item?.label
              ? "bg-indigo-50 text-primary font-medium border-l-2 border-primary"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            {Icon && (
              <Icon
                size={20}
                className="text-gray-500 group-hover:text-indigo-600 transition-colors"
              />
            )}
            <span className="font-medium text-sm">{label}</span>
          </div>
          {hasChildren && (
            <div
              className={`transform transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 12l4-4-4-4v8z" />
              </svg>
            </div>
          )}
        </button>

        {/* Render children */}
        {isExpanded && hasChildren && (
          <div className={`${depth > 0 ? "ml-2" : ""} pl-2 border-l-2 border-gray-200 space-y-1`}>
            {children.map((child) => renderNavItem(child, depth + 1, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-[14px] shadow-sm border-b border-gray-200 px-6">
          <Link href="/" className="flex items-center cursor-pointer">
            <Image src="/assets/images/horizontal-logo.png" alt="logo" width={120} height={120} />
          </Link>
          <button onClick={onClose} className="lg:hidden text-white hover:text-indigo-200">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">{navItems?.map((item) => renderNavItem(item))}</div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

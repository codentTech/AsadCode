"use client";

import ROLES from "@/common/constants/role.constant";
import { getUser } from "@/common/utils/users.util";
import useSidebar from "./use-sidebar.hook";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  isDesktop = false,
  onToggleCollapse,
  setCurrentBar,
  currentBar,
}) {
  const currentUser = getUser();
  const { expandedSections, activeItem, navItems, handleItemClick } = useSidebar();

  const renderNavItem = (item, depth = 0, parentPath = "") => {
    const { label, icon: Icon, children, href } = item;
    const currentPath = parentPath ? `${parentPath}.${label}` : label;

    const isExpanded = expandedSections?.[currentPath] || false;
    const hasChildren = children && children.length > 0;

    if (href) {
      return (
        <button
          key={href}
          onClick={() => handleItemClick({ href, label, currentPath, hasChildren: false })}
          className={`w-full rounded-md p-2 text-left text-xs transition-colors sm:text-sm ${
            activeItem === label
              ? "border-l-2 border-primary bg-indigo-50 font-medium text-primary"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
          style={{ marginLeft: `${depth * 1}px` }}
        >
          <div className={`flex items-center ${isDesktop && isCollapsed ? "justify-center" : "space-x-3"}`}>
            {Icon && (
              <Icon
                size={15}
                className={`${
                  activeItem === label
                    ? "text-primary"
                    : "text-gray-500 group-hover:text-indigo-600"
                } transition-colors`}
              />
            )}
            {!(isDesktop && isCollapsed) ? <span>{label}</span> : null}
          </div>
        </button>
      );
    }

    return (
      <div key={currentPath} className="space-y-2">
        <button
          onClick={() => {
            if (hasChildren) {
              handleItemClick({ hasChildren: true, currentPath, label });
            } else {
              setCurrentBar?.(label);
            }
          }}
          className={`group flex w-full items-center justify-between rounded-lg p-2 transition-colors ${
            depth === 0 && currentBar === item?.label
              ? "border-l-2 border-primary bg-indigo-50 font-medium text-primary"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div
            className={`flex items-center ${
              isDesktop && isCollapsed ? "w-full justify-center" : "space-x-3"
            }`}
          >
            {Icon && (
              <Icon
                size={15}
                className="text-gray-500 transition-colors group-hover:text-indigo-600"
              />
            )}
            {!(isDesktop && isCollapsed) ? (
              <span className="text-xs font-medium sm:text-sm">{label}</span>
            ) : null}
          </div>
          {hasChildren && !(isDesktop && isCollapsed) && (
            <div
              className={`transform transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 12l4-4-4-4v8z" />
              </svg>
            </div>
          )}
        </button>

        {isExpanded && hasChildren && !(isDesktop && isCollapsed) && (
          <div className={`${depth > 0 ? "ml-2" : ""} space-y-1 border-l-2 border-gray-200 pl-2`}>
            {children.map((child) => renderNavItem(child, depth + 1, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />
      )}

      <div
        className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r bg-white transition-transform duration-300 ease-in-out will-change-transform ${
          isDesktop
            ? `${isCollapsed ? "w-20 translate-x-0" : "w-72 translate-x-0"}`
            : `${isOpen ? "w-[88vw] max-w-72 translate-x-0" : "w-[88vw] max-w-72 -translate-x-full"}`
        }`}
      >
        <div className={`border-b border-gray-200 ${isDesktop && isCollapsed ? "px-2 py-3" : "px-4 py-3"}`}>
          <div
            className={`flex items-center ${
              isDesktop && isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {isDesktop && isCollapsed ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700"
                aria-label="Expand admin sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            ) : (
              <img
                src="/assets/images/horizontal-logo.png"
                alt="Cleercut Logo"
                className="h-8 w-auto max-w-[min(100%,11rem)] object-contain"
              />
            )}
            {!isDesktop ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700"
                aria-label="Close admin menu"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              !isCollapsed && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700"
                  aria-label="Collapse admin sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              )
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className={`${isDesktop && isCollapsed ? "px-2" : "px-4"} space-y-2 ${currentUser?.role === ROLES.ADMIN ? "pt-2" : "pt-2"}`}>
            {navItems?.map((item) => renderNavItem(item))}
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

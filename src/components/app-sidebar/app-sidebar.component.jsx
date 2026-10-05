"use client";

import Link from "next/link";

import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import useAppSidebar from "./use-app-sidebar.hook";

function NavItem({ href, label, icon: Icon, isActive, isExpanded }) {
  return (
    <Link
      href={href}
      prefetch={true}
      title={label}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors ${
        isActive ? "bg-white/[0.17]" : "hover:bg-white/10"
      } ${isExpanded ? "justify-start" : "justify-center px-0"}`}
    >
      <Icon className="h-5 w-5 shrink-0 opacity-95" strokeWidth={1.5} aria-hidden />
      {isExpanded ? <span className="truncate whitespace-nowrap">{label}</span> : null}
    </Link>
  );
}

export default function AppSidebar() {
  const {
    railBg,
    isExpanded,
    topLinks,
    bottomLinks,
    portfolioLabel,
    isNavLinkActive,
    currentUser,
    avatarUrl,
    profileMenuItems,
    showProfileDropdown,
    toggleProfileDropdown,
    closeProfileDropdown,
    getUserInitials,
    handleMouseEnter,
    handleMouseLeave,
  } = useAppSidebar();

  const initials = getUserInitials(
    `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim() ||
      currentUser?.first_name ||
      ""
  );

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-0 left-0 top-0 z-[60] flex flex-col text-white shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-[width] duration-75 ease-out ${
        isExpanded ? "w-[190px]" : "w-16"
      }`}
      style={{ backgroundColor: railBg }}
      aria-label="Main navigation"
    >
      <div className={`flex h-14 shrink-0 items-center ${isExpanded ? "px-3" : "justify-center px-2"}`}>
        <Link
          href="/campaign"
          prefetch={true}
          className={`flex min-w-0 items-center ${isExpanded ? "gap-2" : "justify-center"}`}
          title="CleerCut"
        >
          {isExpanded ? (
            <img
              src="/assets/images/horizontal-logo-white.png"
              alt="CleerCut"
              className="h-8 w-auto max-w-full object-contain"
            />
          ) : (
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
              <img
                src="/assets/images/logo.png"
                alt="CleerCut"
                className="h-full w-full object-contain"
              />
            </span>
          )}
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-x-hidden px-2 pb-3 pt-1">
        <div className="flex flex-col gap-0.5">
          {topLinks.map((item) => (
            <NavItem
              key={item.id}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isNavLinkActive(item.id)}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-0.5">
          <div className="mx-2 mb-2 border-t border-white/25" />
          {bottomLinks.map((item) => (
            <NavItem
              key={item.id}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isNavLinkActive(item.id)}
              isExpanded={isExpanded}
            />
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleProfileDropdown();
              }}
              title={portfolioLabel}
              aria-haspopup="true"
              aria-expanded={showProfileDropdown}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors ${
                isNavLinkActive("profile") ? "bg-white/[0.17]" : "hover:bg-white/10"
              } ${isExpanded ? "justify-start" : "justify-center px-0"}`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-7 w-7 shrink-0 rounded-full object-cover border border-white/40"
                />
              ) : (
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#4552DF]">
                  {initials || "U"}
                </span>
              )}
              {isExpanded ? (
                <span className="truncate whitespace-nowrap">{portfolioLabel}</span>
              ) : null}
            </button>

            {showProfileDropdown ? (
              <>
                <div
                  className="fixed inset-0 z-[70]"
                  onClick={closeProfileDropdown}
                  aria-hidden="true"
                />
                <div
                  className={`fixed bottom-3 z-[71] w-56 rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg ${
                    isExpanded ? "left-[198px]" : "left-20"
                  }`}
                  role="menu"
                >
                  <div className="border-b border-gray-100 p-2.5 sm:p-3">
                    <div className="flex items-center space-x-3">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4552DF] text-sm font-semibold text-white">
                          {initials || "U"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                          {capitalizeFirstLetter(currentUser?.first_name)}{" "}
                          {capitalizeFirstLetter(currentUser?.last_name)}
                        </p>
                        <p className="truncate text-[10px] text-gray-500 sm:text-xs">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    {profileMenuItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          item.action();
                          closeProfileDropdown();
                        }}
                        className={`flex w-full items-center space-x-2 px-3 py-2 text-xs transition-colors sm:text-sm ${
                          item.className || "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </aside>
  );
}

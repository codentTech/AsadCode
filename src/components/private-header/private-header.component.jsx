"use client";

import Link from "next/link";

import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import usePrivateHeader from "./use-private-header.hook";

function Header({ mobileRightSlot = null }) {
  const {
    currentUser,
    showProfileDropdown,
    setShowProfileDropdown,
    profileMenuItems,
    navLinks,
    isNavLinkActive,
    getUserInitials,
  } = usePrivateHeader();

  const profileButton = (compact) => (
    <button
      type="button"
      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
      className={`flex items-center space-x-2 rounded-lg text-white hover:text-primary transition-colors duration-200 ${
        compact ? "px-1 py-1" : "px-2 py-1"
      }`}
      aria-haspopup="true"
      aria-expanded={showProfileDropdown}
    >
      {currentUser?.brand_profile || currentUser?.creator_profile ? (
        <img
          src={
            currentUser?.brand_profile?.brand_logo_url ||
            currentUser?.creator_profile?.profile_photo_url
          }
          alt={currentUser?.first_name || "User avatar"}
          className={`rounded-full object-cover border border-white/30 ${compact ? "w-7 h-7" : "w-8 h-8"}`}
        />
      ) : (
        <div
          className={`bg-white/20 text-white rounded-full flex items-center justify-center text-xs font-semibold ${
            compact ? "w-7 h-7" : "w-6 h-6"
          }`}
        >
          {getUserInitials(currentUser?.first_name || currentUser?.last_name || "")}
        </div>
      )}

      {!compact && (
        <div className="hidden sm:block text-left">
          <p className="text-xs text-white">{capitalizeFirstLetter(currentUser?.first_name)}</p>
        </div>
      )}
    </button>
  );

  const profileDropdown = (alignClass) =>
    showProfileDropdown ? (
      <>
        <div
          className="fixed inset-0 z-[58]"
          onClick={() => setShowProfileDropdown(false)}
          aria-hidden="true"
        />
        <div
          className={`absolute w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[59] ${alignClass}`}
        >
          <div className="border-b border-gray-100 p-2.5 sm:p-3">
            <div className="flex items-center space-x-3">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser?.first_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {getUserInitials(
                    `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim()
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                  {currentUser?.first_name} {currentUser?.last_name}
                </p>
                <p className="truncate text-[10px] text-gray-500 sm:text-xs">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            {profileMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setShowProfileDropdown(false);
                }}
                className={`flex w-full items-center space-x-2 px-3 py-2 text-xs transition-colors sm:text-sm ${
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
    ) : null;

  return (
    <>
      <header className="hidden md:flex fixed top-0 left-0 w-full z-50 bg-primary shadow-sm border-b border-primary/30">
        <div className="flex items-center h-12 px-4 w-full">
          <nav className="flex items-center space-x-2 flex-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = isNavLinkActive(href);
              const baseStyles =
                "text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-2";
              const activeStyles = "text-primary bg-white";
              const inactiveStyles = "text-white hover:text-primary hover:bg-gray-100";

              return (
                <Link
                  key={label}
                  href={href}
                  prefetch={true}
                  className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-90" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="relative ml-auto">
            {profileButton(false)}
            {profileDropdown("right-0 top-11")}
          </div>
        </div>
      </header>

      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] h-12 px-3 flex items-center justify-between bg-primary border-b border-primary/30">
        <Link
          href="/campaign"
          prefetch={true}
          className="inline-flex items-center gap-1.5 text-white font-semibold text-xs sm:text-sm tracking-tight"
        >
          <span className="inline-flex items-center rounded">
            <img
              src="/assets/images/horizontal-logo-white.png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            {profileButton(true)}
            {profileDropdown("right-0 top-full mt-1")}
          </div>
          {mobileRightSlot}
        </div>
      </div>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[60] flex items-stretch justify-around gap-0 h-[3rem] min-h-[3rem] sm:h-16 sm:min-h-16 pt-0.5 pb-[max(0.25rem,env(safe-area-inset-bottom))] bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
        aria-label="Main navigation"
      >
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = isNavLinkActive(href);
          return (
            <Link
              key={label}
              href={href}
              prefetch={true}
              className={`flex flex-1 flex-col items-center justify-center gap-0 min-w-0 px-0.5 text-2xs font-medium leading-none sm:text-[10px] sm:leading-tight sm:gap-0.5 ${
                isActive ? "text-primary" : "text-gray-600"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 sm:w-[18px] sm:h-[18px] ${isActive ? "text-primary" : "text-gray-500"}`}
                aria-hidden
              />
              <span className="truncate max-w-full text-center">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default Header;

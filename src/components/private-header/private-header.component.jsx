"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { isCreatorMode } from "@/common/utils/users.util";
import usePrivateHeader from "./use-private-header.hook";

function Header() {
  const pathname = usePathname();
  const isCreator = isCreatorMode();

  const {
    currentUser,
    showProfileDropdown,
    setShowProfileDropdown,
    profileMenuItems,
    getUserInitials,
  } = usePrivateHeader();

  const links = useMemo(() => {
    const portfolioLink = isCreator
      ? { href: "/creator-portfolio", label: "Portfolio" }
      : { href: "/brand-portfolio", label: "Profile" };

    return [
      { href: "/campaign", label: "Campaigns" },
      portfolioLink,
      // { href: "/chat-inbox", label: "Inbox" },
      { href: "/notifications", label: "Notifications" },
      { href: "/admin/dashboard", label: "Settings" },
    ];
  }, [isCreator]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary shadow-sm border-b border-primary/30">
      <div className="flex items-center h-12 px-4">
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-3 flex-1">
          {links.map(({ href, label }) => {
            const isActive =
              pathname === href ||
              (href.includes("creator-portfolio") && pathname.includes("/creator-profile")) ||
              (href.includes("brand-portfolio") && pathname.includes("/brand-portfolio"));

            const baseStyles =
              "text-xs font-medium px-3 py-1 rounded-md transition-all duration-200";
            const activeStyles = "text-primary bg-white";
            const inactiveStyles = "text-white hover:text-primary hover:bg-gray-100";

            return (
              <Link
                key={label}
                href={href}
                prefetch={true}
                className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Profile Dropdown */}
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2 px-2 py-1 rounded-lg text-white hover:text-primary transition-colors duration-200"
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
                className="w-8 h-8 rounded-full object-cover border border-white/30"
              />
            ) : (
              <div className="w-6 h-6 bg-white/20 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                {getUserInitials(currentUser?.first_name || currentUser?.last_name || "")}
              </div>
            )}

            <div className="hidden sm:block text-left">
              <p className="text-xs text-white">{capitalizeFirstLetter(currentUser?.first_name)}</p>
            </div>
          </button>

          {showProfileDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
              <div className="absolute right-0 top-11 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-100">
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
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {currentUser?.first_name} {currentUser?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
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
    </header>
  );
}

export default Header;

"use client";

import { isCreatorMode } from "@/common/utils/users.util";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

function Header() {
  const pathname = usePathname();
  const isCreator = isCreatorMode();

  const links = useMemo(() => {
    const portfolioLink = isCreator
      ? { href: "/creator-portfolio", label: "Portfolio" }
      : { href: "/brand-portfolio", label: "Profile" };

    return [
      { href: "/campaign", label: "Campaigns" },
      portfolioLink,
      { href: "/chat-inbox", label: "Inbox" },
      { href: "/notifications", label: "Notifications" },
      { href: "/admin/dashboard", label: "Settings" },
    ];
  }, [isCreator]);

  const handleInboxClick = (e) => {
    e.preventDefault();
    window.open("/chat-inbox", "_blank", "noopener,noreferrer");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary shadow-sm border-b">
      <div className="flex items-center h-12">
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-3">
          {links.map(({ href, label, openInNewTab }) => {
            const isActive =
              pathname === href ||
              (href.includes("creator-portfolio") && pathname.includes("/creator-profile")) ||
              (href.includes("brand-portfolio") && pathname.includes("/brand-portfolio"));

            const baseStyles =
              "text-xs font-medium px-3 py-1 rounded-md transition-all duration-200";
            const activeStyles = "text-primary bg-white";
            const inactiveStyles = "text-white hover:text-primary hover:bg-gray-100";

            if (openInNewTab) {
              return (
                <button
                  key={label}
                  onClick={handleInboxClick}
                  className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
                >
                  {label}
                </button>
              );
            }

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
      </div>
    </header>
  );
}

export default Header;

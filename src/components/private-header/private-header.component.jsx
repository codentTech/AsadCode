"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/campaign", label: "Campaigns" },
    { href: "/creator-portfolio", label: "My Portfolio" },
    { href: "/chat-inbox", label: "Inbox", openInNewTab: true },
    { href: "/notifications", label: "Notifications" },
    { href: "/admin/dashboard", label: "Settings" },
  ];

  const handleInboxClick = (e) => {
    e.preventDefault();
    window.open("/chat-inbox", "_blank", "noopener,noreferrer");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary shadow-sm border-b">
      <div className="flex items-center h-12">
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map(({ href, label, openInNewTab }) => {
            const isActive = pathname === href || (href.includes("#") && pathname === "/");

            const baseStyles =
              "text-xs font-medium px-3 py-1 rounded-md transition-all duration-200";
            const activeStyles = "text-primary bg-white";
            const inactiveStyles = "text-white hover:text-primary hover:bg-gray-100";

            if (openInNewTab) {
              return (
                <button
                  key={href}
                  onClick={handleInboxClick}
                  className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
                >
                  {label}
                </button>
              );
            }

            return (
              <Link
                key={href}
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

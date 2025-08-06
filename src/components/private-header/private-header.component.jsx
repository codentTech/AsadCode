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
    { href: "/admin/notifications", label: "Notifications" },
    { href: "/admin/dashboard", label: "Settings" },
  ];

  const handleInboxClick = (e) => {
    e.preventDefault();
    window.open("/chat-inbox", "_blank", "noopener,noreferrer");
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white py-5">
      <div className="px-2 flex justify-start items-center">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map(({ href, label, openInNewTab }) => {
            const isActive = pathname === href || (href.includes("#") && pathname === "/"); // for anchor links like /#features

            if (openInNewTab) {
              return (
                <button
                  key={href}
                  onClick={handleInboxClick}
                  className={`font-medium transition cursor-pointer ${
                    isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                  }`}
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
                className={`font-medium transition cursor-pointer ${
                  isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Header;

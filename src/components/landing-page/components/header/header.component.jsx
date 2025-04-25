"use client";

import { useState } from "react";

export default function Header() {
  const [dropdown, setDropdown] = useState({});

  const toggleDropdown = (id) => {
    setDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-md border-b border-gray-200 px-5 py-3 flex justify-between items-center">
      {/* Search Section */}
      <div className="flex items-center gap-3">
        <img
          src="https://yourdemolink.net/social/wp-content/uploads/2025/04/IMG_2972.png"
          alt="Logo"
          width={80}
          height={40}
        />
        <div className="flex items-center bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 w-72 h-10 transition duration-300">
          <i className="fa fa-search text-transparent bg-gradient-to-r from-[#2a398d] to-[#00abef] bg-clip-text"></i>
          <input
            type="text"
            placeholder="Find creators, brands, or posts"
            className="ml-2 w-full bg-transparent outline-none text-sm font-medium text-transparent bg-gradient-to-r from-[#2a398d] to-[#00abef] bg-clip-text placeholder-gray-600"
          />
        </div>
      </div>

      {/* Center Navigation */}
      <div className="flex items-center gap-5">
        {[
          { icon: "home", label: "Home" },
          { icon: "handshake-o", label: "Campaigns" },
          { icon: "users", label: "My Network" },
          { icon: "briefcase", label: "My Portfolio" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer font-semibold text-sm hover:bg-gray-100 text-transparent bg-gradient-to-r from-[#2a398d] to-[#00abef] bg-clip-text"
          >
            <i
              className={`fa fa-${icon} text-transparent bg-gradient-to-r from-[#2a398d] to-[#00abef] bg-clip-text`}
            ></i>
            {label}
          </div>
        ))}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4 relative">
        {["envelope", "bell", "cog"].map((icon, idx) => {
          const dropdownId = [
            "messagesDropdown",
            "notificationsDropdown",
            "settingsDropdown",
          ][idx];
          return (
            <div key={icon} className="relative">
              <div
                onClick={() => toggleDropdown(dropdownId)}
                className="cursor-pointer text-transparent bg-gradient-to-r from-[#2a398d] to-[#00abef] bg-clip-text"
              >
                <i className={`fa fa-${icon} text-lg`}></i>
              </div>
              <div
                className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-3 flex flex-col z-50 ${{ true: "flex", false: "hidden" }[dropdown[dropdownId] ? "true" : "false"]}`}
              >
                <div className="text-base font-bold border-b pb-2 mb-2 text-transparent bg-gradient-to-r from-[#2a398d] to-[#00abef] bg-clip-text">
                  {dropdownId.includes("messages")
                    ? "Messages"
                    : dropdownId.includes("notifications")
                      ? "Notifications"
                      : "Settings"}
                </div>
                {dropdownId === "messagesDropdown" && (
                  <>
                    <DropdownItem
                      unread
                      name="Alice"
                      text="Hey, how are you?"
                      time="5m ago"
                      img="https://randomuser.me/api/portraits/women/1.jpg"
                    />
                    <DropdownItem
                      name="Bob"
                      text="Meeting at 3 PM?"
                      time="20m ago"
                      img="https://randomuser.me/api/portraits/men/2.jpg"
                    />
                    <DropdownItem
                      name="Charlie"
                      text="Let's catch up!"
                      time="1h ago"
                      img="https://randomuser.me/api/portraits/women/3.jpg"
                    />
                  </>
                )}
                {dropdownId === "notificationsDropdown" && (
                  <>
                    <DropdownItem
                      unread
                      name="John"
                      text="commented on your post"
                      time="10m ago"
                      img="https://randomuser.me/api/portraits/men/4.jpg"
                    />
                    <DropdownItem
                      name="Lisa"
                      text="liked your post"
                      time="30m ago"
                      img="https://randomuser.me/api/portraits/women/5.jpg"
                    />
                    <DropdownItem
                      name="Mark"
                      text="sent you a friend request"
                      time="2h ago"
                      img="https://randomuser.me/api/portraits/men/6.jpg"
                    />
                  </>
                )}
                {dropdownId === "settingsDropdown" && (
                  <>
                    {[
                      "Account Settings",
                      "Privacy Settings",
                      "Help & Support",
                    ].map((item) => (
                      <div
                        key={item}
                        className="py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer"
                      >
                        {item}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}

function DropdownItem({ name, text, time, img, unread }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
        unread ? "font-bold" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <img src={img} alt={name} className="w-10 h-10 rounded-full" />
        <div>{`${name}: ${text}`}</div>
      </div>
      <time className="text-xs text-gray-500">{time}</time>
    </div>
  );
}

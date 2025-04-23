import React from "react";

const UserMiniProfile = () => {
  return (
    <div className="sidebar w-full max-w-[20rem] h-full max-h-[35rem] bg-white shadow-lg p-5 flex flex-col items-center font-[Poppins] rounded-xl">
      {/* User Mini Profile */}
      <div className="user-profile text-center mb-6">
        <img
          src="https://randomuser.me/api/portraits/men/45.jpg"
          alt="Profile Picture"
          className="rounded-full mx-auto w-[60px] h-[60px] border-[3px] border-blue-600 shadow-md"
        />
        <h2 className="text-[#222] font-bold text-sm mt-2">John Doe</h2>
        <p className="text-xs text-gray-600">1.2K Followers</p>
      </div>

      {/* Navigation Links */}
      <nav className="w-full">
        <ul className="space-y-3">
          {[
            {
              label: "My Reviews",
              icon: "M12 20l9-5-9-5-9 5 9 5z M12 12V4l9 5-9 5-9-5",
            },
            {
              label: "Active Collaborations",
              icon:
                "M17 20h5v-2a3 3 0 00-3-3h-2.28M9 20H4v-2a3 3 0 013-3h2.28M16 4a4 4 0 11-8 0 4 4 0 018 0zM20 8a4 4 0 11-8 0 4 4 0 018 0z",
            },
            {
              label: "Payments",
              icon:
                "M17 9V7a4 4 0 00-8 0v2a4 4 0 008 0zM5 13h14a2 2 0 012 2v4H3v-4a2 2 0 012-2z",
            },
            {
              label: "Creator Academy",
              icon:
                "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422A12.083 12.083 0 0112 21.6a12.083 12.083 0 01-6.16-10.978L12 14z",
            },
            {
              label: "Analytics",
              icon: "M3 3v18h18 M9 17V9m4 8V5m4 12v-6",
            },
            {
              label: "Explore",
              icon:
                "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z",
            },
          ].map(({ label, icon }) => (
            <li key={label}>
              <a
                href="#"
                className="group flex items-center px-3 py-2 rounded-md text-[#222] font-semibold text-sm hover:bg-blue-600 hover:text-white transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2 stroke-gray-500 group-hover:stroke-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Analytics Summary */}
      <div className="analytics bg-[#f9f9f9] rounded-xl p-4 text-center mt-auto w-full">
        <h3 className="text-sm font-bold text-[#222]">Engagement Insights</h3>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <div className="flex items-center">
            <img
              src="https://img.icons8.com/ios-glyphs/20/like--v1.png"
              alt="likes"
              className="w-4 mr-1"
            />
            300
          </div>
          <div className="flex items-center">
            <img
              src="https://img.icons8.com/ios-glyphs/20/comments.png"
              alt="comments"
              className="w-4 mr-1"
            />
            150
          </div>
          <div className="flex items-center">
            <img
              src="https://img.icons8.com/ios-glyphs/20/share.png"
              alt="shares"
              className="w-4 mr-1"
            />
            50
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMiniProfile;

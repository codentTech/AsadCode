const PremiumSidebar = () => {
    return (
      <div className="h-full min-h-[50rem] bg-gray-100 p-5 rounded-2xl max-w-sm shadow-xl">
        {/* Trending Topics */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-3 pl-2">🔥 Trending Topics</h3>
          <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md">
            <div className="border-b pb-2 last:border-b-0">
              <p className="text-sm text-gray-900 font-medium">
                <strong>Jane Williams:</strong> Brands nowadays want a full-scale campaign for the price of a latte.
              </p>
              <small className="text-xs text-gray-500">13,447 Likes • 157 Comments • 98 Shares</small>
            </div>
            <div className="border-b pb-2 last:border-b-0">
              <p className="text-sm text-gray-900 font-medium">
                <strong>Paul Clarke:</strong> Marketing through cable TV is a dying industry, prove me wrong.
              </p>
              <small className="text-xs text-gray-500">987 Likes • 94 Comments • 48 Shares</small>
            </div>
          </div>
        </div>
  
        {/* Suggested Connections */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-3 pl-2">🤝 Suggested Connections</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">John Doe</p>
                <p className="text-xs text-gray-600">Travel, Adventures, Outdoor</p>
                <a
                  href="#"
                  className="inline-block mt-1 bg-blue-700 text-white text-xs px-3 py-1 rounded-md"
                >
                  + Follow
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Sarah Williams</p>
                <p className="text-xs text-gray-600">Fashion, Skincare, Lifestyle</p>
                <a
                  href="#"
                  className="inline-block mt-1 bg-blue-700 text-white text-xs px-3 py-1 rounded-md"
                >
                  + Follow
                </a>
              </div>
            </li>
          </ul>
        </div>
  
        {/* Upcoming Events */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3 pl-2">📅 Upcoming Events</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <img
                src="https://logo.clearbit.com/google.com"
                alt="Google Event"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Google Cloud Summit</p>
                <p className="text-xs text-gray-600">March 25, 2025</p>
                <a
                  href="#"
                  className="inline-block mt-1 bg-blue-700 text-white text-xs px-3 py-1 rounded-md"
                >
                  Register Now
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <img
                src="https://logo.clearbit.com/apple.com"
                alt="Apple Event"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Apple AI Conference</p>
                <p className="text-xs text-gray-600">April 5, 2025</p>
                <a
                  href="#"
                  className="inline-block mt-1 bg-blue-700 text-white text-xs px-3 py-1 rounded-md"
                >
                  Join Event
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <img
                src="https://logo.clearbit.com/microsoft.com"
                alt="Microsoft Event"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Microsoft Tech Days</p>
                <p className="text-xs text-gray-600">April 15, 2025</p>
                <a
                  href="#"
                  className="inline-block mt-1 bg-blue-700 text-white text-xs px-3 py-1 rounded-md"
                >
                  Sign Up
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default PremiumSidebar;
  
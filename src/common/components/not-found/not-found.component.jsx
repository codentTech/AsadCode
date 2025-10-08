"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const NotFound = ({
  title = "No Campaigns Found",
  description = "No active campaigns available.",
  icon: CustomIcon = Search,
  showAnimation = true,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [showAnimation]);

  return (
    <div
      className={`flex flex-col items-center justify-center h-full bg-transparent p-6 ${className}`}
    >
      {/* Animated background elements */}
      {showAnimation && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-indigo-100 rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-indigo-200 rounded-full blur-lg opacity-40 animate-pulse delay-1000" />
        </div>
      )}

      <div
        className={`relative z-10 text-center max-w-sm transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Icon */}
        <div className="relative mb-4">
          <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
            <CustomIcon className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>

        {/* Description */}
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default NotFound;

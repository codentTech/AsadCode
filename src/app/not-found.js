"use client";

import NotFound from "@/common/components/not-found/not-found.component";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <NotFound
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist."
        showAnimation={true}
        className="min-h-screen"
      />

      {/* Custom action button for 404 page */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <Link
          href="/"
          className="inline-block px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

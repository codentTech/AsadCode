"use client";

import HeaderLayout from "@/common/layouts/header.layout";

export default function ContentLibrary() {
  return (
    <HeaderLayout className="bg-gray-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">Content Library</h1>
        <p className="text-sm text-gray-600">
          Content Library is coming soon. Approved creator deliverables will appear here for review
          and reuse.
        </p>
      </div>
    </HeaderLayout>
  );
}

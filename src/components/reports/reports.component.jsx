"use client";

import HeaderLayout from "@/common/layouts/header.layout";

export default function Reports() {
  return (
    <HeaderLayout className="bg-gray-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">Reports</h1>
        <p className="text-sm text-gray-600">
          Reports is coming soon. Campaign performance summaries will be available here with a
          campaign selector.
        </p>
      </div>
    </HeaderLayout>
  );
}

"use client";

import { Library } from "lucide-react";

export default function SidebarEmpty() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Library className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">Asset details</h3>
      <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-gray-500">
        Select a card from the library to preview media, rights, and download options here.
      </p>
    </div>
  );
}

"use client";

import AppSidebar from "@/components/app-sidebar/app-sidebar.component";

export default function HeaderLayout({
  children,
  className = "",
  mainClassName = "",
}) {
  return (
    <div
      className={`flex min-h-0 flex-col bg-white overflow-hidden h-[100dvh] max-h-[100dvh] ${className ?? ""}`.trim()}
    >
      <AppSidebar />
      <main
        className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overscroll-contain pl-16 ${
          mainClassName || "overflow-y-auto"
        }`.trim()}
      >
        {children}
      </main>
    </div>
  );
}

"use client";

import Header from "@/components/private-header/private-header.component";

export default function HeaderLayout({ children, className = "" }) {
  return (
    <div
      className={`flex min-h-0 flex-col bg-white overflow-hidden h-[100dvh] max-h-[100dvh] ${className ?? ""}`.trim()}
    >
      <Header />
      <main className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain pt-12 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        {children}
      </main>
    </div>
  );
}

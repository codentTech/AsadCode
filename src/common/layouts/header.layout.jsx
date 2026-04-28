"use client";

import Header from "@/components/private-header/private-header.component";

export default function HeaderLayout({ children, className = "" }) {
  return (
    <div className={`flex flex-col min-h-screen bg-white overflow-hidden ${className ?? ""}`.trim()}>
      <Header />
      <main className="flex-1 flex flex-col min-h-0 pt-12 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        {children}
      </main>
    </div>
  );
}

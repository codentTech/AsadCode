"use client";

import Header from "@/components/private-header/private-header.component";

export default function HeaderLayout({ children }) {
  const HEADER_HEIGHT = 64; // You can adjust based on your Header component's height

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto" style={{ paddingTop: HEADER_HEIGHT }}>
        {children}
      </main>
    </div>
  );
}

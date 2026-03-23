"use client";

import Header from "@/components/private-header/private-header.component";

export default function HeaderLayout({ children }) {
  const HEADER_HEIGHT = 64; // You can adjust based on your Header component's height

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white overflow-hidden">
      <Header />
      <main className="flex-1" style={{ paddingTop: HEADER_HEIGHT }}>
        {children}
      </main>
    </div>
  );
}

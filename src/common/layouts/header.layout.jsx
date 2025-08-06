"use client";

import Header from "@/components/private-header/private-header.component";

export default function HeaderLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 mt-16">{children}</main>
    </div>
  );
}

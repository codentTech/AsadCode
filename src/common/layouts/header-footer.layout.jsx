"use client";

import Header from "@/components/header/header,component";
import Footer from "@/components/home/footer/footer.component";

export default function HeaderFooterLayout({ children, showBackButton = false }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 mt-20">{children}</main>
      <Footer />
    </div>
  );
}

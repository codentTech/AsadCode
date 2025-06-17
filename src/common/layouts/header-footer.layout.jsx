"use client";

import Header from "@/components/header/header";
import Footer from "@/components/home/footer/footer.component";
import { useSelector } from "react-redux";

export default function HeaderFooterLayout({ children, showBackButton = false }) {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 mt-20">{children}</main>
      <Footer />
    </div>
  );
}

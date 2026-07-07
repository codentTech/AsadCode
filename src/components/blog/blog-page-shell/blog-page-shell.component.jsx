import HeaderFooterLayout from "@/common/layouts/header-footer.layout";

export default function BlogPageShell({ children }) {
  return (
    <HeaderFooterLayout>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gradient-to-br from-primary to-primary text-left text-white md:text-center">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:py-8 lg:px-8">
            <h1 className="text-sm font-extrabold text-white md:text-lg xl:text-xl">Blog</h1>
            <p className="mt-2 text-sm text-white/90 md:text-lg xl:text-xl">
              Insights on influencer marketing, the creator economy, and platform updates.
            </p>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </HeaderFooterLayout>
  );
}

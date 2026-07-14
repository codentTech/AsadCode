import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";

const BlogPostSidebar = ({ tocEntries }) => (
  <aside className="w-full lg:w-72 lg:shrink-0">
    <div className="space-y-4 lg:sticky lg:top-24">
      {tocEntries.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:text-xs">
              Table of Contents
            </p>
          </div>
          <nav className="max-h-[calc(100vh-12rem)] overflow-y-auto px-4 py-3">
            <ul className="space-y-2">
              {tocEntries.map((entry) => (
                <li
                  key={entry.id}
                  className={entry.level === 3 ? "ml-3 list-disc marker:text-primary" : "list-disc marker:text-primary"}
                >
                  <a
                    href={`#${entry.id}`}
                    className="text-[10px] leading-snug text-gray-700 transition-colors hover:text-primary sm:text-xs"
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">Try Verified Discovery</h3>
        <p className="mt-2 text-[10px] leading-snug text-gray-600 sm:text-xs">
          Get your first 3 campaigns at zero commission.
        </p>
        <Link href="/" className="mt-4 block">
          <CustomButton text="Join the Waitlist" className="btn-outline w-full" />
        </Link>
      </div>
    </div>
  </aside>
);

export default BlogPostSidebar;

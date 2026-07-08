import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatBlogDate } from "@/common/utils/blog.utils";

export default function BlogPostCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute top-2 right-2 inline-flex rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h2 className="line-clamp-2 text-left text-sm font-semibold text-gray-900 transition-colors bg-indigo-100 p-2 rounded-lg sm:text-base">
          {post.title}
        </h2>

        <p className="mt-2 line-clamp-3 flex-1 rounded-lg bg-gray-100 p-2 text-left text-[10px] leading-snug text-gray-600 sm:text-xs">
          {post.excerpt}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-gray-500 sm:text-xs">
            <CalendarDays className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
            <time dateTime={post.published_at}>{formatBlogDate(post.published_at)}</time>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-primary sm:text-xs">
            Read
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

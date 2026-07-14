import { CalendarDays, Clock, RefreshCw } from "lucide-react";
import { formatBlogDate, formatBlogReadingTime } from "@/common/utils/blog.utils";
import { BLOG_DEFAULT_AUTHOR } from "@/common/utils/blog-content.util";

const BlogPostMetadata = ({
  publishedAt,
  updatedAt,
  showUpdatedDate,
  readingTimeMinutes,
}) => (
  <div className="mt-4 space-y-3 text-left">
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-[10px] text-gray-700 sm:text-xs">
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
        <span>
          <span className="font-semibold text-gray-900">Published</span>
          <span className="mx-1.5 text-gray-400">|</span>
          <time dateTime={publishedAt}>{formatBlogDate(publishedAt)}</time>
        </span>
      </div>

      {showUpdatedDate ? (
        <div className="flex items-center gap-2 text-[10px] text-gray-700 sm:text-xs">
          <RefreshCw className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
          <span>
            <span className="font-semibold text-gray-900">Updated</span>
            <span className="mx-1.5 text-gray-400">|</span>
            <time dateTime={updatedAt}>{formatBlogDate(updatedAt)}</time>
          </span>
        </div>
      ) : null}

      <div className="flex items-center gap-2 text-[10px] text-gray-700 sm:text-xs">
        <Clock className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
        <span>
          <span className="font-semibold text-gray-900">{formatBlogReadingTime(readingTimeMinutes)}</span>
          <span className="mx-1.5 text-gray-400">|</span>
          <span>Reading</span>
        </span>
      </div>
    </div>

    <hr className="border-gray-200" />

    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white sm:h-9 sm:w-9">
        {BLOG_DEFAULT_AUTHOR.name.charAt(0)}
      </div>
      <p className="text-[10px] text-gray-700 sm:text-xs">
        <span className="font-semibold text-gray-900">{BLOG_DEFAULT_AUTHOR.name}</span>
        <span className="mx-1.5 text-gray-400">|</span>
        <span>{BLOG_DEFAULT_AUTHOR.role}</span>
      </p>
    </div>
  </div>
);

export default BlogPostMetadata;

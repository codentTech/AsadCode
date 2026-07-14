import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { formatBlogDate, formatBlogReadingTime } from "@/common/utils/blog.utils";
import { estimateReadingTime } from "@/common/utils/blog-content.util";

const BlogPostRelated = ({ posts }) => {
  if (!posts?.length) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-left text-xl font-bold text-gray-900 sm:text-2xl">Related Posts</h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
          >
            <div className="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                {post.category}
              </p>
              <h3 className="mt-2 line-clamp-2 text-left text-sm font-bold text-gray-900 sm:text-base">
                {post.title}
              </h3>
              <div className="mt-auto flex items-center gap-3 pt-4 text-[10px] text-gray-500 sm:text-xs">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatBlogDate(post.published_at)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatBlogReadingTime(estimateReadingTime(post.body))}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogPostRelated;

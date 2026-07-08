import Link from "next/link";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import BlogPageShell from "@/components/blog/blog-page-shell/blog-page-shell.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildBlogArticleSchema, formatBlogDate } from "@/common/utils/blog.utils";
import BlogPostSkeleton from "./components/blog-post-skeleton/blog-post-skeleton.component";
import useBlogPost from "./use-blog-post.hook";

export default function BlogPostPage() {
  const { post, isLoading, isValid } = useBlogPost();

  if (isLoading) {
    return (
      <BlogPageShell>
        <BlogPostSkeleton />
      </BlogPageShell>
    );
  }

  if (!isValid) {
    return null;
  }

  const articleSchema = buildBlogArticleSchema(post);

  return (
    <>
      {articleSchema ? <JsonLd data={articleSchema} /> : null}
      <BlogPageShell>
        <article className="w-full space-y-4 sm:space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full bg-gray-100 lg:aspect-[2.5/1]">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="border-t border-indigo-100 bg-white px-4 py-4">
              <h1 className="mt-2 text-left text-sm font-semibold text-gray-900 bg-indigo-100 p-2 rounded-lg sm:text-lg md:text-xl">
                {post.title}
              </h1>

              {post.excerpt ? (
                <p className="mt-2 w-full text-left text-[10px] leading-snug bg-gray-100 p-2 rounded-lg text-gray-600 sm:text-xs md:text-sm">
                  {post.excerpt}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2">
              <div
                className="blog-post-body space-y-3 text-left text-[10px] leading-relaxed text-gray-700 sm:text-xs md:text-sm"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </div>

            <aside className="flex flex-col gap-4 lg:col-span-1">
              <div className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
                  Post details
                </p>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-2 text-left">
                    <Tag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">Category</p>
                      <span className="mt-1 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-indigo-100 sm:text-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-left">
                    <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">
                        Published
                      </p>
                      <p className="mt-1 text-[10px] text-gray-700 sm:text-xs">
                        {formatBlogDate(post.published_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/blog"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary bg-white px-3 py-2.5 text-[10px] font-semibold text-primary shadow-sm transition-colors hover:bg-indigo-100 sm:text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Blog
              </Link>
            </aside>
          </div>
        </article>
      </BlogPageShell>
    </>
  );
}

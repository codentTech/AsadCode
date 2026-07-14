import BlogPageShell from "@/components/blog/blog-page-shell/blog-page-shell.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildBlogArticleSchema } from "@/common/utils/blog.utils";
import BlogPostSkeleton from "./components/blog-post-skeleton/blog-post-skeleton.component";
import BlogPostHero from "./components/blog-post-hero/blog-post-hero.component";
import BlogPostSidebar from "./components/blog-post-sidebar/blog-post-sidebar.component";
import BlogPostFaq from "./components/blog-post-faq/blog-post-faq.component";
import BlogPostRelated from "./components/blog-post-related/blog-post-related.component";
import BlogPostBottomCta from "./components/blog-post-bottom-cta/blog-post-bottom-cta.component";
import useBlogPost from "./use-blog-post.hook";

export default function BlogPostPage() {
  const {
    post,
    relatedPosts,
    isLoading,
    isValid,
    bodyHtml,
    tocEntries,
    faqItems,
    readingTimeMinutes,
    showUpdatedDate,
  } = useBlogPost();

  if (isLoading) {
    return (
      <BlogPageShell variant="post">
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
      <BlogPageShell variant="post">
        <article className="w-full">
          <BlogPostHero
            post={post}
            readingTimeMinutes={readingTimeMinutes}
            showUpdatedDate={showUpdatedDate}
          />

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <BlogPostSidebar tocEntries={tocEntries} />

            <div className="min-w-0 flex-1">
              <div
                className="blog-post-body text-left text-sm leading-relaxed text-gray-700 sm:text-base"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
              <BlogPostFaq items={faqItems} />
            </div>
          </div>

          <BlogPostRelated posts={relatedPosts} />
          <BlogPostBottomCta />
        </article>
      </BlogPageShell>
    </>
  );
}

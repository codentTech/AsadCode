import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import { fetchPublishedBlogPost, fetchPublishedBlogPosts } from "@/common/utils/blog-server.util";
import { buildBlogArticleSchema } from "@/common/utils/blog.utils";
import JsonLd from "@/components/seo/json-ld.component";
import ServerReadableContent from "@/components/seo/server-readable-content.component";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await fetchPublishedBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await fetchPublishedBlogPosts();
  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  const articleSchema = buildBlogArticleSchema(post);

  return (
    <HeaderFooterLayout>
      {articleSchema ? <JsonLd data={articleSchema} /> : null}
      <main className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          <ServerReadableContent id="server-readable-blog-article">
            <article className="w-full text-left">
              {post.cover_image_url ? (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="mb-6 aspect-[16/9] w-full rounded-xl object-cover"
                />
              ) : null}

              {post.category ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:text-xs">
                  {post.category}
                </p>
              ) : null}

              <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">
                {post.title}
              </h1>

              {post.excerpt ? (
                <p className="mt-3 text-sm italic leading-relaxed text-gray-600 sm:text-base md:text-lg">
                  {post.excerpt}
                </p>
              ) : null}

              {post.published_at ? (
                <p className="mt-3 text-[10px] text-gray-500 sm:text-xs">
                  Published{" "}
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : null}

              <div
                className="blog-post-body mt-8 text-left text-sm leading-relaxed text-gray-700 sm:text-base"
                dangerouslySetInnerHTML={{ __html: post.body || "" }}
              />

              <p className="mt-10 text-sm">
                <a href={`${SITE_URL}/blog`} className="font-semibold text-primary hover:underline">
                  Back to {SITE_NAME} Blog
                </a>
              </p>
            </article>
          </ServerReadableContent>

          {relatedPosts.length > 0 ? (
            <section className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-left text-sm font-semibold text-gray-900 sm:text-lg">
                Related articles
              </h2>
              <ul className="mt-4 space-y-3 text-left">
                {relatedPosts.map((related) => (
                  <li key={related.id || related.slug}>
                    <a
                      href={`${SITE_URL}/blog/${related.slug}`}
                      className="text-sm font-medium text-primary hover:underline sm:text-base"
                    >
                      {related.title}
                    </a>
                    {related.excerpt ? (
                      <p className="mt-1 text-[10px] text-gray-600 sm:text-xs">{related.excerpt}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </main>
    </HeaderFooterLayout>
  );
}

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import { fetchPublishedBlogPost, fetchPublishedBlogPosts } from "@/common/utils/blog-server.util";
import BlogPostPage from "@/components/blog/blog-post/blog-post.component";
import CrawlableContent from "@/components/seo/crawlable-content.component";
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

  return (
    <>
      <CrawlableContent>
        <article>
          <h1>{post.title}</h1>
          {post.excerpt ? <p>{post.excerpt}</p> : null}
          {post.published_at ? (
            <p>
              Published {new Date(post.published_at).toLocaleDateString("en-US")}
            </p>
          ) : null}
          {post.category ? <p>Category: {post.category}</p> : null}
          <div dangerouslySetInnerHTML={{ __html: post.body || "" }} />
          <p>
            <a href={`${SITE_URL}/blog`}>Back to {SITE_NAME} Blog</a>
          </p>
        </article>
      </CrawlableContent>
      <Auth
        component={
          <BlogPostPage initialPost={post} initialRelatedPosts={relatedPosts} />
        }
        type={AUTH.PUBLIC}
      />
    </>
  );
}

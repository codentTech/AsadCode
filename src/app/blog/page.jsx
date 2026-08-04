import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import { SITE_URL } from "@/common/constants/site.constant";
import { fetchPublishedBlogPosts } from "@/common/utils/blog-server.util";
import BlogIndexPage from "@/components/blog/blog-index/blog-index.component";
import ServerReadableContent from "@/components/seo/server-readable-content.component";

export const revalidate = 60;

export default async function Page() {
  const posts = await fetchPublishedBlogPosts();

  return (
    <>
      <ServerReadableContent id="server-readable-blog-index">
        <h1>CleerCut Blog</h1>
        <p>
          Influencer marketing strategy, creator economy insights, and platform
          updates from CleerCut.
        </p>
        {posts.length === 0 ? (
          <p>No published articles yet.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id || post.slug}>
                <a href={`${SITE_URL}/blog/${post.slug}`}>{post.title}</a>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </ServerReadableContent>
      <Auth component={<BlogIndexPage initialPosts={posts} />} type={AUTH.PUBLIC} />
    </>
  );
}

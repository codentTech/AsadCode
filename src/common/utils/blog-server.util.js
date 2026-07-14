import { BLOG_REVALIDATE_SECONDS } from "@/common/constants/genaric.constant";

const API_BASE = process.env.NEXT_PUBLIC_MAIN_URL || "http://localhost:5000";

async function fetchBlogApi(path) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: BLOG_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    if (!json?.success) {
      return null;
    }

    return json.data;
  } catch {
    return null;
  }
}

export async function fetchPublishedBlogPosts() {
  const data = await fetchBlogApi("/blog/posts");
  return Array.isArray(data) ? data : [];
}

export async function fetchPublishedBlogPost(slug) {
  if (!slug) return null;
  return fetchBlogApi(`/blog/posts/${encodeURIComponent(slug)}`);
}

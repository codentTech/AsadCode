import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import blogService from "@/provider/features/blog/blog.service";
import {
  estimateReadingTime,
  hasBeenUpdated,
  processBlogPostHtml,
} from "@/common/utils/blog-content.util";

export default function useBlogPost({ initialPost = null, initialRelatedPosts = null } = {}) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [post, setPost] = useState(() => initialPost || null);
  const [relatedPosts, setRelatedPosts] = useState(() =>
    Array.isArray(initialRelatedPosts) ? initialRelatedPosts : []
  );
  const [isLoading, setIsLoading] = useState(() => !initialPost);

  const loadPost = useCallback(async () => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    if (initialPost && initialPost.slug === slug) {
      setPost(initialPost);
      setRelatedPosts(Array.isArray(initialRelatedPosts) ? initialRelatedPosts : []);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const response = await blogService.getPublishedPostBySlug(slug);

    if (response?.success && response?.data) {
      setPost(response.data);
      setIsLoading(false);

      const listResponse = await blogService.getPublishedPosts();
      if (listResponse?.success && Array.isArray(listResponse.data)) {
        setRelatedPosts(
          listResponse.data.filter((item) => item.slug !== response.data.slug).slice(0, 3)
        );
      }
      return;
    }

    setPost(null);
    setRelatedPosts([]);
    setIsLoading(false);
    router.replace("/not-found");
  }, [router, slug, initialPost, initialRelatedPosts]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const processedContent = useMemo(() => processBlogPostHtml(post?.body), [post?.body]);

  const readingTimeMinutes = useMemo(
    () => estimateReadingTime(post?.body),
    [post?.body]
  );

  const showUpdatedDate = useMemo(
    () => hasBeenUpdated(post?.published_at, post?.updated_at),
    [post?.published_at, post?.updated_at]
  );

  return {
    post,
    relatedPosts,
    isLoading,
    isValid: Boolean(post),
    bodyHtml: processedContent.bodyHtml,
    tocEntries: processedContent.tocEntries,
    faqItems: processedContent.faqItems,
    readingTimeMinutes,
    showUpdatedDate,
  };
}

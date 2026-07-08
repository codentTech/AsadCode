import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import blogService from "@/provider/features/blog/blog.service";

export default function useBlogPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPost = useCallback(async () => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const response = await blogService.getPublishedPostBySlug(slug);

    if (response?.success && response?.data) {
      setPost(response.data);
      setIsLoading(false);
      return;
    }

    setPost(null);
    setIsLoading(false);
    router.replace("/not-found");
  }, [router, slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return {
    post,
    isLoading,
    isValid: Boolean(post),
  };
}

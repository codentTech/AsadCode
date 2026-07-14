import { BLOG_INDEX_PAGE_METADATA } from "@/common/constants/genaric.constant";

export const revalidate = 60;
export const metadata = BLOG_INDEX_PAGE_METADATA;

export default function BlogLayout({ children }) {
  return children;
}

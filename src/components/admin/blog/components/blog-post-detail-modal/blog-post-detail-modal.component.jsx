import Link from "next/link";
import Modal from "@/common/components/modal/modal.component";
import { formatBlogDate } from "@/common/utils/blog.utils";
import { ExternalLink } from "lucide-react";

function DetailRow({ label, value, className = "" }) {
  return (
    <div className={`rounded-lg px-3 py-2.5 ${className || "bg-gray-100"}`}>
      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
        {label}
      </p>
      <p className="text-xs text-gray-900 sm:text-sm">{value}</p>
    </div>
  );
}

export default function BlogPostDetailModal({ post, onClose }) {
  return (
    <Modal show={Boolean(post)} title="Blog post details" onClose={onClose} size="lg" height="fixed">
      {post ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow label="Title" value={post.title} className="bg-indigo-100 sm:col-span-2" />
            <DetailRow label="Category" value={post.category} />
            <DetailRow label="Slug" value={post.slug} />
            <DetailRow label="Published" value={formatBlogDate(post.published_at)} />
            <DetailRow
              label="Last updated"
              value={post.updated_at ? formatBlogDate(post.updated_at) : "—"}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-100 px-3 py-2.5">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
                Excerpt
              </p>
              <p className="text-xs leading-snug text-gray-700 sm:text-sm">{post.excerpt}</p>
            </div>

            <div className="rounded-lg bg-indigo-100 px-3 py-2.5">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
                Public post
              </p>
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline sm:text-sm"
              >
                View public post
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
              Body
            </p>
            <div
              className="blog-post-body max-h-64 overflow-y-auto text-left text-xs leading-relaxed text-gray-700 sm:text-sm"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

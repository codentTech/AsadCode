import BlogPostMetadata from "../blog-post-metadata/blog-post-metadata.component";

const BlogPostHero = ({ post, readingTimeMinutes, showUpdatedDate }) => (
  <section className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
    <div className="relative min-h-[220px] overflow-hidden rounded-xl sm:min-h-[280px] lg:min-h-[360px]">
      <img
        src={post.cover_image_url}
        alt={post.title}
        className="h-full w-full object-cover"
      />
      {post.category ? (
        <div className="absolute bottom-3 left-3 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
          {post.category}
        </div>
      ) : null}
    </div>

    <div className="min-w-0 text-left">
      {post.category ? (
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:text-xs">
          {post.category}
        </p>
      ) : null}

      <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-[2.5rem]">
        {post.title}
      </h1>

      {post.excerpt ? (
        <p className="mt-3 text-sm italic leading-relaxed text-gray-600 sm:text-base md:text-lg">
          {post.excerpt}
        </p>
      ) : null}

      <BlogPostMetadata
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
        showUpdatedDate={showUpdatedDate}
        readingTimeMinutes={readingTimeMinutes}
      />
    </div>
  </section>
);

export default BlogPostHero;

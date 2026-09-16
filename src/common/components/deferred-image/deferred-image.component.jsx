import useDeferredImage from "./use-deferred-image.hook";

function DeferredImage({
  src,
  alt = "",
  className = "",
  placeholderClassName = "bg-gray-200",
  rootMargin,
  priority = false,
}) {
  const {
    containerRef,
    imageRef,
    imageSrc,
    isVisible,
    handleLoad,
    handleError,
    showPlaceholder,
  } = useDeferredImage({ src, rootMargin, priority });

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      {showPlaceholder ? (
        <div className={`absolute inset-0 ${placeholderClassName}`} aria-hidden />
      ) : null}
      {imageSrc ? (
        <img
          ref={imageRef}
          src={imageSrc}
          alt={alt}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={handleLoad}
          onError={handleError}
          className={`h-full w-full object-cover ${isVisible ? "opacity-100" : "opacity-0"}`}
        />
      ) : null}
    </div>
  );
}

export default DeferredImage;

import { ImageOff } from "lucide-react";
import useGalleryItemMedia from "./use-gallery-item-media.hook";

const GalleryItemMedia = ({
  item,
  aspectClassName = "aspect-[9/16]",
  preparingLabel = "Preparing hosted preview… this updates automatically (or use refresh).",
}) => {
  const { embedSrc, playbackSrc, thumbnailSrc, isPreparingHosted, showThumb, handleThumbError } =
    useGalleryItemMedia(item);

  return (
    <div className={`relative ${aspectClassName} w-full overflow-hidden bg-gray-900`}>
      {item.media_type === "video" && embedSrc ? (
        <iframe
          key={embedSrc}
          src={embedSrc}
          className="absolute inset-0 h-full w-full border-0 bg-black"
          title={item.caption_text || item.title || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      ) : item.media_type === "video" && playbackSrc ? (
        <video
          key={playbackSrc}
          src={playbackSrc}
          className="absolute inset-0 h-full w-full object-contain bg-black"
          preload="metadata"
          controls
          playsInline
          poster={showThumb ? thumbnailSrc : undefined}
        />
      ) : showThumb ? (
        <>
          <img
            src={thumbnailSrc}
            alt={item.caption_text || item.title || "Gallery media"}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={handleThumbError}
          />
          {isPreparingHosted ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="max-w-[90%] rounded-full bg-black/60 px-3 py-1.5 text-center text-[10px] font-medium text-white sm:text-xs">
                {preparingLabel}
              </span>
            </div>
          ) : null}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-gray-800 to-gray-950 px-3 text-center">
          <ImageOff className="h-6 w-6 text-gray-400" aria-hidden />
          <p className="text-[10px] font-medium leading-snug text-gray-300 sm:text-xs">
            {item.source_type === "post_link"
              ? "Preview unavailable — open the original post"
              : "No preview available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default GalleryItemMedia;

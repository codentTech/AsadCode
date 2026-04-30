import useMessageThreadModalAvatar from "./use-message-thread-modal-avatar.hook";

const MessageThreadModalAvatar = ({ src, alt, children, className }) => {
  const { imageError, handleImageError } = useMessageThreadModalAvatar(src);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full border-2 border-white font-semibold text-white shadow-sm ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary text-sm font-semibold text-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default MessageThreadModalAvatar;

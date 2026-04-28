import { useState, useCallback, useEffect } from "react";

function useMessageThreadModalAvatar(src) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return { imageError, handleImageError };
}

export default useMessageThreadModalAvatar;

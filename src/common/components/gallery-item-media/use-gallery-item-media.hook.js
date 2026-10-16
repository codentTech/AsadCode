import { useCallback, useEffect, useMemo, useState } from "react";
import { getGalleryMediaPresentation } from "@/common/utils/gallery-media.util";

const useGalleryItemMedia = (item) => {
  const [thumbFailed, setThumbFailed] = useState(false);

  const presentation = useMemo(() => getGalleryMediaPresentation(item), [item]);

  useEffect(() => {
    setThumbFailed(false);
  }, [item?.id, presentation.thumbnailSrc]);

  const handleThumbError = useCallback(() => {
    setThumbFailed(true);
  }, []);

  const showThumb = Boolean(presentation.thumbnailSrc) && !thumbFailed;

  return {
    ...presentation,
    showThumb,
    handleThumbError,
  };
};

export default useGalleryItemMedia;

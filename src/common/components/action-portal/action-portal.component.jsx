import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ActionDropdownPortal = ({ children, targetRef }) => {
  const [coords, setCoords] = useState(null);
  const portalRef = useRef(null);

  useEffect(() => {
    if (targetRef?.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.right - 192 + window.scrollX, // 192px = 48rem dropdown width
      });
    }
  }, [targetRef]);

  if (!coords) return null;

  return createPortal(
    <div
      ref={portalRef}
      className="absolute z-[9999] w-48 bg-white rounded-md shadow-lg border border-gray-200"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        position: "absolute",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default ActionDropdownPortal;

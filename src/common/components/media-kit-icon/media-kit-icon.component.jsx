const SIZE_STYLES = {
  discovery: {
    container: "h-11 w-11 rounded-[12px]",
    icon: "h-5 w-5",
  },
  profile: {
    container: "h-[22px] w-[22px] rounded-[6px]",
    icon: "h-3 w-3",
  },
};

const MediaKitIcon = ({ size = "discovery", className = "" }) => {
  const styles = SIZE_STYLES[size] || SIZE_STYLES.discovery;

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${styles.container} ${className}`}
      style={{
        background: "linear-gradient(135deg, #6C63FF 0%, #9B8FFF 100%)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.icon}
        aria-hidden
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
};

export default MediaKitIcon;

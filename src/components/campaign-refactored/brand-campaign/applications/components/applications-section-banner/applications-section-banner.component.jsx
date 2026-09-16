function ApplicationsSectionBanner({ label, sticky = false }) {
  return (
    <div
      className={`mb-2 w-full ${sticky ? "sticky top-0 z-[2]" : ""}`}
    >
      <div className="flex h-[38px] min-h-[38px] w-full items-center rounded-lg bg-primary px-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-white">
          {label}
        </p>
      </div>
    </div>
  );
}

export default ApplicationsSectionBanner;

import useApplicationsSubtabToggle from "./use-applications-subtab-toggle.hook";

function ApplicationsSubtabToggle({ activeSubTab, onSubTabChange, counts }) {
  const { segments, handleSelect } = useApplicationsSubtabToggle({
    activeSubTab,
    onSubTabChange,
    counts,
  });

  return (
    <div
      className="inline-flex w-full max-w-[min(100%,25rem)] shrink-0 rounded-lg bg-gray-100 p-0.5 sm:w-auto border border-gray-200"
      role="tablist"
      aria-label="Applications workflow"
    >
      {segments.map((segment) => {
        const isActive = activeSubTab === segment.id;
        return (
          <button
            key={segment.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(segment.id)}
            className={`min-h-[36px] flex-1 rounded-md px-2 py-1.5 text-[10px] font-semibold leading-tight transition-colors sm:min-w-[7.5rem] sm:px-3 sm:text-xs ${
              isActive ? "bg-primary text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}

export default ApplicationsSubtabToggle;

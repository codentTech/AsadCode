export const APPLICATIONS_SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "urgency", label: "Urgency" },
  { value: "followers", label: "Most Followers" },
  { value: "engagement", label: "Highest Engagement Rate" },
  { value: "rating", label: "Highest Rated" },
];

export const VISIBLE_APPLICATIONS_SORT_OPTIONS = APPLICATIONS_SORT_OPTIONS.filter(
  (option) => option.value !== "rating"
);

export const APPLICATIONS_SUB_TAB_DEFAULT_SORT = {
  applications: "newest",
  negotiations: "urgency",
};

export const APPLICATIONS_SORT_STORAGE_KEYS = {
  applications: "cleercut.brand.applications.sort.applications",
  negotiations: "cleercut.brand.applications.sort.negotiations",
};

export function readPersistedApplicationsSort(subTab) {
  if (typeof window === "undefined") {
    return APPLICATIONS_SUB_TAB_DEFAULT_SORT[subTab] || "newest";
  }
  const key = APPLICATIONS_SORT_STORAGE_KEYS[subTab];
  const stored = window.localStorage.getItem(key);
  if (stored && APPLICATIONS_SORT_OPTIONS.some((option) => option.value === stored)) {
    return stored;
  }
  return APPLICATIONS_SUB_TAB_DEFAULT_SORT[subTab] || "newest";
}

export function persistApplicationsSort(subTab, sortValue) {
  if (typeof window === "undefined" || !subTab || !sortValue) return;
  const key = APPLICATIONS_SORT_STORAGE_KEYS[subTab];
  window.localStorage.setItem(key, sortValue);
}

// Creator Discover uses distributed logic across sub-components
// Each sub-component has its own hook:
// - CampaignFilters: use-campaign-filters.hook.js
// - CampaignFeed: use-campaign-feed.hook.js
// - PitchTemplate: use-pitch-template.hook.js

// This hook serves as a coordinator if needed for shared state
export default function useDiscover() {
  // Currently no shared state needed - sub-components are independent
  // If shared state is needed in the future, add it here
  return {};
}

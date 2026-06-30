export const URGENCY_TIER = {
  RED: "red",
  AMBER: "amber",
  GREEN: "green",
};

export const URGENCY_PILL_CLASSES = {
  [URGENCY_TIER.RED]: "bg-red-50 text-red-700",
  [URGENCY_TIER.AMBER]: "bg-amber-50 text-amber-700",
  [URGENCY_TIER.GREEN]: "bg-green-50 text-green-700",
};

export const URGENCY_SORT_RANK = {
  [URGENCY_TIER.RED]: 0,
  [URGENCY_TIER.AMBER]: 1,
  [URGENCY_TIER.GREEN]: 2,
};

export const URGENCY_HOURS_THRESHOLD = 48;

export const BOARD_COLUMN_LABELS = {
  applications: "Applications",
  negotiations: "Negotiations",
  content_in_progress: "Content in Progress",
  awaiting_post: "Awaiting Post",
  completed: "Completed",
};

export const BOARD_THEME = {
  header: "bg-primary",
  body: "bg-indigo-50/35",
  border: "border-primary/20",
  ring: "ring-primary/10",
  card: "border-l-[3px] border-l-primary bg-white hover:border-primary/25 hover:bg-primary/[0.03] hover:shadow-md hover:shadow-primary/10",
  avatarRing: "ring-primary/25",
  subStateChip: "bg-primary/5 text-indigo-900",
};

export const CONTENT_SUB_STATE_LABELS = {
  content_recorded: "Content recorded",
  draft_submitted: "Draft submitted",
  revision_requested: "Revision requested",
  draft_approved: "Draft approved",
};

export const PIPELINE_STATE = {
  NEEDS_REVIEW: "NEEDS_REVIEW",
  REVIEW_OVERDUE: "REVIEW_OVERDUE",
  NEW_REPLY: "NEW_REPLY",
  REPLY_OVERDUE: "REPLY_OVERDUE",
  OFFER_REJECTED: "OFFER_REJECTED",
  OFFER_REJECTED_OVERDUE: "OFFER_REJECTED_OVERDUE",
  DRAFT_TO_REVIEW: "DRAFT_TO_REVIEW",
  DRAFT_REVIEW_OVERDUE: "DRAFT_REVIEW_OVERDUE",
  REVISED_DRAFT_READY: "REVISED_DRAFT_READY",
  REVISED_DRAFT_OVERDUE: "REVISED_DRAFT_OVERDUE",
  POST_TO_APPROVE: "POST_TO_APPROVE",
  APPROVAL_OVERDUE: "APPROVAL_OVERDUE",
  READY_TO_COMPLETE: "READY_TO_COMPLETE",
};

export const OVERDUE_LABEL_BY_PIPELINE_STATE = {
  [PIPELINE_STATE.NEEDS_REVIEW]: "Review overdue",
  [PIPELINE_STATE.REVIEW_OVERDUE]: "Review overdue",
  [PIPELINE_STATE.NEW_REPLY]: "Reply overdue",
  [PIPELINE_STATE.REPLY_OVERDUE]: "Reply overdue",
  [PIPELINE_STATE.OFFER_REJECTED]: "Offer rejected overdue",
  [PIPELINE_STATE.OFFER_REJECTED_OVERDUE]: "Offer rejected overdue",
  [PIPELINE_STATE.DRAFT_TO_REVIEW]: "Review overdue",
  [PIPELINE_STATE.DRAFT_REVIEW_OVERDUE]: "Review overdue",
  [PIPELINE_STATE.REVISED_DRAFT_READY]: "Review overdue",
  [PIPELINE_STATE.REVISED_DRAFT_OVERDUE]: "Review overdue",
  [PIPELINE_STATE.POST_TO_APPROVE]: "Approval overdue",
  [PIPELINE_STATE.APPROVAL_OVERDUE]: "Approval overdue",
};

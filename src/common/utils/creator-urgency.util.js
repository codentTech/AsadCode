import {
  OVERDUE_LABEL_BY_PIPELINE_STATE,
  URGENCY_HOURS_THRESHOLD,
  URGENCY_SORT_RANK,
  URGENCY_TIER,
} from "@/common/constants/creator-urgency.constant";

export function getUrgencyTierFromTimestamp(brandActionRequiredAt, ballHolder) {
  if (ballHolder === "creator" || ballHolder === "done") {
    return URGENCY_TIER.GREEN;
  }
  if (!brandActionRequiredAt) {
    return URGENCY_TIER.AMBER;
  }
  const hours =
    (Date.now() - new Date(brandActionRequiredAt).getTime()) / (1000 * 60 * 60);
  return hours >= URGENCY_HOURS_THRESHOLD ? URGENCY_TIER.RED : URGENCY_TIER.AMBER;
}

function resolveLiveUrgencyLabel(pipeline, tier) {
  const baseLabel = pipeline.urgency_label || "";
  if (tier !== URGENCY_TIER.RED) {
    return baseLabel;
  }
  return OVERDUE_LABEL_BY_PIPELINE_STATE[pipeline.pipeline_state] || baseLabel;
}

export function resolveCreatorUrgency(creator) {
  const pipeline = creator?.pipeline;
  if (!pipeline) {
    return {
      label: "",
      tier: URGENCY_TIER.GREEN,
      ballHolder: "creator",
      brandActionRequiredAt: null,
      pipelineStateEnteredAt: null,
      boardColumn: null,
      contentSubState: null,
    };
  }

  const tier = getUrgencyTierFromTimestamp(
    pipeline.brand_action_required_at,
    pipeline.ball_holder,
  );
  const label = resolveLiveUrgencyLabel(pipeline, tier);

  return {
    label,
    tier,
    ballHolder: pipeline.ball_holder,
    brandActionRequiredAt: pipeline.brand_action_required_at,
    pipelineStateEnteredAt: pipeline.pipeline_state_entered_at,
    boardColumn: pipeline.board_column,
    contentSubState: pipeline.content_sub_state,
    pipelineState: pipeline.pipeline_state,
  };
}

export function applyLivePipelineUrgency(creator) {
  if (!creator) return creator;

  const urgency = resolveCreatorUrgency(creator);
  const next = {
    ...creator,
    urgencyLabel: urgency.label,
    urgencyTier: urgency.tier,
  };

  if (creator.pipeline) {
    next.pipeline = {
      ...creator.pipeline,
      urgency_tier: urgency.tier,
      urgency_label: urgency.label,
    };
  }

  return next;
}

export function sortCreatorsByUrgency(creators) {
  if (!Array.isArray(creators)) return [];

  return [...creators].sort((a, b) => {
    const urgencyA = resolveCreatorUrgency(a);
    const urgencyB = resolveCreatorUrgency(b);

    const tierDiff =
      (URGENCY_SORT_RANK[urgencyA.tier] ?? 2) - (URGENCY_SORT_RANK[urgencyB.tier] ?? 2);
    if (tierDiff !== 0) return tierDiff;

    const aTime = urgencyA.pipelineStateEnteredAt
      ? new Date(urgencyA.pipelineStateEnteredAt).getTime()
      : 0;
    const bTime = urgencyB.pipelineStateEnteredAt
      ? new Date(urgencyB.pipelineStateEnteredAt).getTime()
      : 0;
    return aTime - bTime;
  });
}

export function bucketCreatorsByBoardColumn(creators) {
  const columns = {
    applications: [],
    negotiations: [],
    content_in_progress: [],
    awaiting_post: [],
    completed: [],
  };

  (creators || []).forEach((creator) => {
    const column = resolveCreatorUrgency(creator).boardColumn;
    if (column && columns[column]) {
      columns[column].push(creator);
    }
  });

  Object.keys(columns).forEach((key) => {
    columns[key] = sortCreatorsByUrgency(columns[key]);
  });

  return columns;
}

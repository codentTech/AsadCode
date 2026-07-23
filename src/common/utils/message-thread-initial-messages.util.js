import ROLES from "@/common/constants/role.constant";

export function normalizeThreadInitialMessagePayload(raw) {
  if (!raw?.content) return null;
  return {
    content: String(raw.content).trim(),
    senderRole: (raw.senderRole || ROLES.CREATOR).toUpperCase(),
    campaignId: raw.campaignId ?? null,
    creatorId: raw.creatorId ?? null,
    brandId: raw.brandId ?? null,
  };
}

export function normalizeThreadInitialMessagePayloads(applicationPitch) {
  if (!applicationPitch) return [];

  if (Array.isArray(applicationPitch)) {
    return applicationPitch
      .map(normalizeThreadInitialMessagePayload)
      .filter((payload) => payload?.content);
  }

  if (typeof applicationPitch === "string") {
    const trimmed = applicationPitch.trim();
    return trimmed
      ? [{ content: trimmed, senderRole: ROLES.CREATOR, campaignId: null, creatorId: null, brandId: null }]
      : [];
  }

  if (typeof applicationPitch === "object" && applicationPitch?.content) {
    const normalized = normalizeThreadInitialMessagePayload(applicationPitch);
    return normalized ? [normalized] : [];
  }

  return [];
}

export function buildAppliedCreatorThreadInitialMessages({
  pitch,
  custom_message,
  campaignId,
  creatorId,
}) {
  const payloads = [];
  const creatorPitch = pitch?.trim();
  const invitationMessage = custom_message?.trim();

  if (creatorPitch) {
    payloads.push({
      content: creatorPitch,
      senderRole: ROLES.CREATOR,
      campaignId,
      creatorId,
    });
  }

  if (invitationMessage) {
    payloads.push({
      content: invitationMessage,
      senderRole: ROLES.BRAND,
      campaignId,
      creatorId,
    });
  }

  return payloads.length ? payloads : null;
}

export function threadInitialPayloadMatchesContext(payload, { campaignId, creatorId }) {
  if (!payload?.content) return false;

  if (payload.campaignId && campaignId && String(payload.campaignId) !== String(campaignId)) {
    return false;
  }

  if (payload.creatorId && creatorId && String(payload.creatorId) !== String(creatorId)) {
    return false;
  }

  if (payload.brandId && creatorId && String(payload.brandId) !== String(creatorId)) {
    return false;
  }

  return true;
}

export function messageContentAlreadyInThread(messages, payload) {
  if (!payload?.content) return false;

  return (messages || []).some((msg) => {
    const contentMatches = msg.content?.trim() === payload.content.trim();
    const isCreatorMessage = msg.sender?.role === ROLES.CREATOR;
    const isBrandMessage = msg.sender?.role === ROLES.BRAND;
    return contentMatches && (isCreatorMessage || isBrandMessage);
  });
}

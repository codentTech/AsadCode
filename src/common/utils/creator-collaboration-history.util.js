import { getExpectedPayoutAvailableAtFromHistoryRow } from "@/common/utils/creator-payout-availability.util";

function rowCollaborationId(row) {
  if (!row || typeof row !== "object") return null;
  return row.collaborationId ?? row.collaboration_id ?? null;
}

function rowCampaignId(row) {
  if (!row || typeof row !== "object") return null;
  return row.campaignId ?? row.campaign_id ?? null;
}

function rowCompletionDate(row) {
  if (!row || typeof row !== "object") return null;
  return row.completionDate ?? row.completion_date ?? null;
}

function normalizeTitle(s) {
  return (s || "").trim().toLowerCase();
}

function getBrandIdFromSelectedCampaign(selectedCampaign) {
  const c = selectedCampaign?.campaign || selectedCampaign?.application?.campaign;
  if (c?.created_by?.id) {
    return c.created_by.id;
  }
  if (selectedCampaign?.brand?.id) {
    return selectedCampaign.brand.id;
  }
  if (selectedCampaign?.application?.brand?.id) {
    return selectedCampaign.application.brand.id;
  }
  return null;
}

function pickLatestByCompletionDate(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }
  if (rows.length === 1) {
    return rows[0];
  }
  return rows.sort(
    (a, b) =>
      new Date(rowCompletionDate(b) || 0).getTime() -
      new Date(rowCompletionDate(a) || 0).getTime()
  )[0];
}

export function resolveCollaborationIdFromRawApplication(application) {
  if (!application) return null;
  if (application.contract?.id) {
    return application.contract.id;
  }
  const creatorUserId = application.creator?.id;
  const contracts = application.campaign?.contracts;
  if (!creatorUserId || !Array.isArray(contracts) || contracts.length === 0) {
    return null;
  }
  const match = contracts.find(
    (c) =>
      c.creator_id === creatorUserId ||
      c.creatorId === creatorUserId ||
      (c.creator && c.creator.id === creatorUserId)
  );
  return match?.id ?? null;
}

export function resolveCollaborationIdFromSelectedCampaign(selectedCampaign) {
  if (!selectedCampaign) return null;

  if (selectedCampaign.collaborationId) {
    return selectedCampaign.collaborationId;
  }

  const direct =
    selectedCampaign.contract?.id ||
    selectedCampaign.application?.contract?.id;
  if (direct) {
    return direct;
  }

  const fromApplication = resolveCollaborationIdFromRawApplication(
    selectedCampaign.application || selectedCampaign
  );
  if (fromApplication) {
    return fromApplication;
  }

  const creatorUserId =
    selectedCampaign.application?.creator?.id || selectedCampaign.creator?.id;

  const contracts =
    selectedCampaign.campaign?.contracts || selectedCampaign.application?.campaign?.contracts;

  if (creatorUserId && Array.isArray(contracts) && contracts.length > 0) {
    const match = contracts.find(
      (c) =>
        c.creator_id === creatorUserId ||
        c.creatorId === creatorUserId ||
        (c.creator && c.creator.id === creatorUserId)
    );
    if (match?.id) {
      return match.id;
    }
  }

  return null;
}

export function findCreatorCollaborationHistoryItem(historyItems, selectedCampaign) {
  if (!Array.isArray(historyItems) || historyItems.length === 0) {
    return null;
  }

  const collaborationId = resolveCollaborationIdFromSelectedCampaign(selectedCampaign);
  if (collaborationId) {
    const byContract = historyItems.find(
      (item) => String(rowCollaborationId(item)) === String(collaborationId)
    );
    if (byContract) {
      return byContract;
    }
  }

  const contracts =
    selectedCampaign.campaign?.contracts || selectedCampaign.application?.campaign?.contracts;

  if (Array.isArray(contracts) && contracts.length > 0) {
    const allListedContractIds = new Set(contracts.map((c) => String(c.id)));
    const byAnyListedContract = historyItems.filter((item) =>
      allListedContractIds.has(String(rowCollaborationId(item)))
    );
    if (byAnyListedContract.length === 1) {
      return byAnyListedContract[0];
    }
    if (byAnyListedContract.length > 1) {
      const withPayout = byAnyListedContract.filter(
        (m) => getExpectedPayoutAvailableAtFromHistoryRow(m) != null
      );
      if (withPayout.length === 1) {
        return withPayout[0];
      }
      if (withPayout.length > 1) {
        return withPayout.sort(
          (a, b) =>
            new Date(rowCompletionDate(b) || 0).getTime() -
            new Date(rowCompletionDate(a) || 0).getTime()
        )[0];
      }
      return byAnyListedContract.sort(
        (a, b) =>
          new Date(rowCompletionDate(b) || 0).getTime() -
          new Date(rowCompletionDate(a) || 0).getTime()
      )[0];
    }
  }

  const campaignId = selectedCampaign?.id || selectedCampaign?.campaign?.id;
  if (!campaignId) {
    const brandId = getBrandIdFromSelectedCampaign(selectedCampaign);
    if (!brandId) {
      return null;
    }
    const brandMatches = historyItems.filter(
      (item) => String(item.brand?.id) === String(brandId)
    );
    if (brandMatches.length === 0) {
      return null;
    }
    const titleNorm = normalizeTitle(
      selectedCampaign.title || selectedCampaign?.campaign?.campaign_title
    );
    let pool = brandMatches;
    if (titleNorm.length > 0) {
      const byTitle = brandMatches.filter((item) => {
        const rowTitle = normalizeTitle(item.campaignName);
        return (
          rowTitle.length > 0 &&
          (rowTitle.includes(titleNorm) || titleNorm.includes(rowTitle) || rowTitle === titleNorm)
        );
      });
      if (byTitle.length > 0) {
        pool = byTitle;
      }
    }
    const withPayout = pool.filter(
      (m) => getExpectedPayoutAvailableAtFromHistoryRow(m) != null
    );
    if (withPayout.length >= 1) {
      return pickLatestByCompletionDate(withPayout);
    }
    return pickLatestByCompletionDate(pool);
  }

  const matches = historyItems.filter(
    (item) => String(rowCampaignId(item)) === String(campaignId)
  );

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length === 0) {
    return null;
  }

  const creatorUserId =
    selectedCampaign.application?.creator?.id || selectedCampaign.creator?.id;

  if (creatorUserId && Array.isArray(contracts) && contracts.length > 0) {
    const allowed = new Set(
      contracts
        .filter(
          (c) =>
            c.creator_id === creatorUserId ||
            c.creatorId === creatorUserId ||
            (c.creator && c.creator.id === creatorUserId)
        )
        .map((c) => String(c.id))
    );
    const resolved = matches.find((m) => allowed.has(String(rowCollaborationId(m))));
    if (resolved) {
      return resolved;
    }

    const allContractIds = new Set(contracts.map((c) => String(c.id)));
    const byListedContract = matches.find((m) =>
      allContractIds.has(String(rowCollaborationId(m)))
    );
    if (byListedContract) {
      return byListedContract;
    }
  }

  const withExpectedPayout = matches.filter(
    (m) => getExpectedPayoutAvailableAtFromHistoryRow(m) != null
  );
  if (withExpectedPayout.length === 1) {
    return withExpectedPayout[0];
  }
  if (withExpectedPayout.length > 1) {
    return withExpectedPayout.sort(
      (a, b) =>
        new Date(rowCompletionDate(b) || 0).getTime() -
        new Date(rowCompletionDate(a) || 0).getTime()
    )[0];
  }

  return matches.sort(
    (a, b) =>
      new Date(rowCompletionDate(b) || 0).getTime() -
      new Date(rowCompletionDate(a) || 0).getTime()
  )[0];
}

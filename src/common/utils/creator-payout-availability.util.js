export function getCollaborationHistoryRows(historyPayload) {
  if (!historyPayload) {
    return null;
  }
  if (Array.isArray(historyPayload)) {
    return historyPayload;
  }
  const inner = historyPayload.data;
  if (Array.isArray(inner)) {
    return inner;
  }
  if (inner && typeof inner === "object" && Array.isArray(inner.data)) {
    return inner.data;
  }
  return null;
}

export function getExpectedPayoutAvailableAtFromHistoryRow(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  const v = row.expectedPayoutAvailableAt ?? row.expected_payout_available_at;
  if (v == null || v === "") {
    return null;
  }
  return v;
}

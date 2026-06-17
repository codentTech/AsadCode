import { useEffect, useMemo, useRef, useState } from "react";
import phylloService from "@/provider/features/phyllo/phyllo.service";

export default function useCreatorPhylloFollowers(creatorIds) {
  const [accountsByCreatorId, setAccountsByCreatorId] = useState({});
  const requestedRef = useRef(new Set());

  const stableIdsKey = useMemo(() => {
    const ids = [...new Set((creatorIds || []).filter(Boolean))];
    ids.sort();
    return ids.join("|");
  }, [creatorIds]);

  useEffect(() => {
    const ids = stableIdsKey ? stableIdsKey.split("|").filter(Boolean) : [];

    ids.forEach((creatorId) => {
      if (requestedRef.current.has(creatorId)) return;
      requestedRef.current.add(creatorId);

      phylloService.fetchCreatorSocialAccounts(creatorId).then(
        (response) => {
          const payload = Array.isArray(response?.data) ? response.data : [];
          setAccountsByCreatorId((prev) => ({
            ...prev,
            [creatorId]: payload,
          }));
        },
        () => {
          setAccountsByCreatorId((prev) => ({
            ...prev,
            [creatorId]: prev[creatorId] || [],
          }));
        },
      );
    });
  }, [stableIdsKey]);

  return accountsByCreatorId;
}

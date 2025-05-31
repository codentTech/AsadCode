import { fetchAllUserWaitinglist } from "@/provider/features/dashboard/dashboard.slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function useWaitingList() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [waitingList, setWaitingList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserWaitinglist();
  }, []);

  const fetchUserWaitinglist = async () => {
    try {
      setLoading(true);
      const response = await dispatch(fetchAllUserWaitinglist());
      if (response.payload) {
        setWaitingList(response.payload.userWaitlist);
      }
    } catch (err) {
      setError("Failed to fetch waiting list");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    waitingList,
    error,
    refetch: fetchUserWaitinglist,
  };
}

export default useWaitingList;

import { isCreatorMode } from "@/common/utils/users.util";

function usePaymentHistory() {
  return { isCreator: isCreatorMode() };
}

export default usePaymentHistory;

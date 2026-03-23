import { getUser } from "@/common/utils/users.util";
import ROLES from "@/common/constants/role.constant";
import TaskManagerBrandModal from "./brand/task-manager-brand.component";

const TaskManagerModal = ({ show, onClose, selectedCampaignId = null, isMultiCreator = true }) => {
  const currentUser = getUser();
  const isBrand = currentUser?.role === ROLES.BRAND;

  // Always render the brand modal if show is true, regardless of role check
  // The backend will handle authorization
  if (show) {
    return (
      <TaskManagerBrandModal
        show={show}
        onClose={onClose}
        selectedCampaignId={selectedCampaignId}
        isMultiCreator={isMultiCreator}
      />
    );
  }

  return null;
};

export default TaskManagerModal;

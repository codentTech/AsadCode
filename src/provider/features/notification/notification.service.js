import api from "@/common/utils/api";

const getMyNotifications = async (campaignId) => {
  const params = campaignId ? { campaignId } : {};
  const response = await api().get("/notifications", { params });
  return response.data;
};

const getActionRequiredNotifications = async (campaignId) => {
  const params = campaignId ? { campaignId } : {};
  const response = await api().get("/notifications/action-required", { params });
  return response.data;
};

const getUnreadCount = async () => {
  const response = await api().get("/notifications/unread-count");
  return response.data;
};

const markAsRead = async (notificationId) => {
  const response = await api().put(`/notifications/${notificationId}/mark-read`);
  return response.data;
};

const markAllAsRead = async () => {
  const response = await api().put("/notifications/mark-all-read");
  return response.data;
};

const deleteNotification = async (notificationId) => {
  const response = await api().delete(`/notifications/${notificationId}`);
  return response.data;
};

const notificationService = {
  getMyNotifications,
  getActionRequiredNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;

import api from "@/common/utils/api";

const getMyNotifications = async () => {
  const response = await api().get("/notifications");
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
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;

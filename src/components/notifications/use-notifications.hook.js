import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyNotifications } from "@/provider/features/notification/notification.slice";
import notificationService from "@/provider/features/notification/notification.service";

function useNotifications() {
  const dispatch = useDispatch();

  const notificationsState = useSelector((state) => state.notification?.getMyNotifications);
  const notifications = notificationsState?.data?.data || [];

  useEffect(() => {
    dispatch(getMyNotifications());
  }, [dispatch]);

  const markAsRead = async (id) => {
    await notificationService.markAsRead(id);
    dispatch(getMyNotifications());
  };

  const removeNotification = async (id) => {
    await notificationService.deleteNotification(id);
    dispatch(getMyNotifications());
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    dispatch(getMyNotifications());
  };

  return { notifications, markAsRead, removeNotification, markAllAsRead };
}

export default useNotifications;

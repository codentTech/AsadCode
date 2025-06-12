function useNotifications({ setNotifications }) {
  const markAsRead = (id) => {
    setNotifications((prev) => ({
      ...prev,
      ["brand"]: prev["brand"].map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      ),
    }));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => ({
      ...prev,
      ["brand"]: prev["brand"].filter((notif) => notif.id !== id),
    }));
  };
  return { markAsRead, removeNotification };
}

export default useNotifications;

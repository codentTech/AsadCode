import NotificationCard from "./notification-card.component";

function NotificationSection({
  title,
  icon: Icon,
  notifications,
  isActionRequired,
  onMarkAsRead,
  onDismiss,
  onClick,
  emptyMessage,
}) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
            isActionRequired ? "bg-red-100" : "bg-indigo-100"
          }`}
        >
          <Icon
            className={`w-3.5 h-3.5 ${isActionRequired ? "text-red-600" : "text-indigo-600"}`}
            strokeWidth={2}
          />
        </div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {notifications.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {notifications.map((notification) => (
          <NotificationCard
            key={
              notification.id ||
              `${notification.type}-${notification.campaign_id}-${notification.creator_id}`
            }
            notification={notification}
            isActionRequired={isActionRequired}
            onMarkAsRead={onMarkAsRead}
            onDismiss={onDismiss}
            onClick={() => onClick(notification)}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationSection;


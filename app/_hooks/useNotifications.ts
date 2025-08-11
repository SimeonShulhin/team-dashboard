import { useState, useCallback } from 'react';
import { NotificationState } from '@/types/index'

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const addNotification = useCallback(
    (type: NotificationState['type'], message: string, duration = 2000) => {
      const id = Date.now().toString();
      const notification: NotificationState = {
        id,
        type,
        message,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      return addNotification('success', message, duration);
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      return addNotification('error', message, duration);
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      return addNotification('info', message, duration);
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showInfo,
  };
}

import React, { useEffect } from 'react';
import { useNotification } from '../NotificationContext';

const Notification = () => {
  const { notification, notificationDispatch } = useNotification();
  
  useEffect(() => {
    if (notification.isVisible) {
      const timeout = setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [notification, notificationDispatch]);

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display: notification.isVisible ? 'block' : 'none',
  };

  return (
    <div style={style}>
      {notification.message}
    </div>
  );
};

export default Notification;

'use client';

import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { NotificationState } from '@/types/index';

interface NotificationsProps {
  notifications: NotificationState[];
  onRemove: (id: string) => void;
}

export default function Notifications({ notifications, onRemove }: NotificationsProps) {
  if (notifications.length === 0) return null;

  const getIcon = (type: NotificationState['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case 'error':
        return <XCircle className='h-5 w-5 text-red-500' />;
      case 'info':
        return <Info className='h-5 w-5 text-blue-500' />;
      default:
        return <Info className='h-5 w-5 text-gray-500' />;
    }
  };

  const getBackgroundColor = (type: NotificationState['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-center p-4 rounded-lg border shadow-lg max-w-md
            ${getBackgroundColor(notification.type)}
            animate-in slide-in-from-right duration-300
          `}>
          <div className='flex-shrink-0'>{getIcon(notification.type)}</div>

          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium text-gray-900'>{notification.message}</p>
          </div>

          <button
            onClick={() => onRemove(notification.id)}
            className='ml-4 flex-shrink-0 rounded-md p-1.5 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            <X className='h-4 w-4 text-gray-400' />
          </button>
        </div>
      ))}
    </div>
  );
}

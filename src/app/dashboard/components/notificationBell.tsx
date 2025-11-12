"use client";
import React, { useState } from 'react';
import { useNotifications } from './NotificationsProvider';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, remove } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="relative p-2 rounded-full hover:bg-gray-100"
        onClick={() => setOpen(v => !v)}
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="font-medium text-sm">Notificaciones</span>
            <button className="text-xs text-blue-600 hover:underline" onClick={() => { markAllRead(); setOpen(false); }}>Marcar todas</button>
          </div>
          <ul className="max-h-80 overflow-auto divide-y">
            {notifications.length === 0 && (
              <li className="p-3 text-sm text-gray-500">Sin notificaciones</li>
            )}
            {notifications.map(n => (
              <li key={n.id} className="p-3 text-sm flex items-start gap-2">
                <div className={`mt-1 w-2 h-2 rounded-full ${n.kind==='ERROR' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-gray-600 text-xs">{n.message}</div>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-800" onClick={() => remove(n.id)}>✕</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

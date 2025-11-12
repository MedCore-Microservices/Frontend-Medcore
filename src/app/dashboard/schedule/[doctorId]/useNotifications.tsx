"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UILocalNotification, NotificationKind } from './types';

const genId = () => Math.random().toString(36).slice(2, 10);

interface NotificationsContextValue {
  notifications: UILocalNotification[];
  push: (kind: NotificationKind, title: string, message: string, opts?: { ttlMs?: number }) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<UILocalNotification[]>([]);
  const timers = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
    const t = timers.current[id];
    if (t) {
      clearTimeout(t);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback((kind: NotificationKind, title: string, message: string, opts?: { ttlMs?: number }) => {
    const id = genId();
    const ttlDefault = kind === 'ERROR' ? 12000 : 6000;
    const ttl = opts?.ttlMs ?? ttlDefault;
    const n: UILocalNotification = { id, kind, title, message, createdAt: Date.now(), read: false };
    setItems(prev => [n, ...prev]);
    if (ttl > 0) {
      timers.current[id] = window.setTimeout(() => remove(id), ttl);
    }
  }, [remove]);

  const markAllRead = useCallback(() => {
    setItems(prev => {
      prev.forEach(n => { const t = timers.current[n.id]; if (t) clearTimeout(t); });
      timers.current = {};
      return [];
    });
  }, []);

  const unreadCount = items.filter(i => !i.read).length;

  useEffect(() => () => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications: items, push, markAllRead, remove, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  return ctx;
}
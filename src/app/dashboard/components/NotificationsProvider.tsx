"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type NotificationKind =
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_STATUS_CHANGED'
  | 'SCHEDULE_CONFIGURED'
  | 'SCHEDULE_BLOCKED'
  | 'INFO'
  | 'ERROR';

export interface UILocalNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  createdAt: number;
  read?: boolean;
}

const genId = () => Math.random().toString(36).slice(2, 10);

interface PushOptions { ttlMs?: number; persistent?: boolean }
interface NotificationsContextValue {
  notifications: UILocalNotification[];
  push: (kind: NotificationKind, title: string, message: string, opts?: PushOptions) => void;
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

  const push = useCallback((kind: NotificationKind, title: string, message: string, opts?: { ttlMs?: number; persistent?: boolean }) => {
    const id = genId();
    const ttlDefault = kind === 'ERROR' ? 12000 : 6000; // más tiempo para errores
    const ttl = opts?.ttlMs ?? ttlDefault;
    const n: UILocalNotification = { id, kind, title, message, createdAt: Date.now(), read: false };
    setItems(prev => [n, ...prev]);
    if (!opts?.persistent && ttl > 0 && typeof window !== 'undefined') {
      timers.current[id] = window.setTimeout(() => remove(id), ttl);
    }
  }, [remove]);

  const markAllRead = useCallback(() => {
    // Marcar leídas y vaciar la bandeja
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    setItems([]);
  }, []);

  const unreadCount = items.length; // Cada notificación sin leer (se vacían al marcar todas)

  useEffect(() => {
    // Suscribirse a eventos globales (creación de cita)
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ appointmentId: number | string } & Record<string, unknown>>;
      push('APPOINTMENT_CREATED', 'Cita creada', `ID #${ce.detail?.appointmentId ?? ''}`);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('appointment:created', handler as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('appointment:created', handler as EventListener);
      }
    };
  }, [push]);

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

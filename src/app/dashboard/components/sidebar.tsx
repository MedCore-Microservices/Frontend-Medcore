// src/app/dashboard/components/Sidebar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarState } from './SidebarStateProvider';
import { NAV_ITEMS, type NavItem } from '../../../lib/nav';
import { getAuthTokenClient } from '@/lib/getAuthToken';

type Props = { role?: string | null };

export default function Sidebar({ role = 'guest' }: Props) {
  const pathname = usePathname();
  const { desktopOpen, mobileOpen, toggleDesktop } = useSidebarState();
  const [doctorId, setDoctorId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Derivar doctorId desde token JWT si existe (para construir enlaces dinámicos)
    try {
      const raw = getAuthTokenClient();
      if (!raw) return;
      const payload = raw.split('.')[1];
      if (!payload) return;
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '='));
      const data = JSON.parse(json);
      const id = data.doctorId ?? data.userId ?? data.sub;
      setDoctorId(id != null ? String(id) : null);
    } catch {
      setDoctorId(null);
    }
  }, []);

  // Si mobile está abierto, ocultamos el sidebar de escritorio (tal como pediste)
  if (mobileOpen) return null;

  const roleKey = role ?? 'guest';
  const items: NavItem[] = (NAV_ITEMS[roleKey] ?? NAV_ITEMS['guest'] ?? []).map(it => {
    if (it.href?.includes('/ME')) {
      const real = doctorId ? it.href.replace('/ME', `/${doctorId}`) : it.href;
      return { ...it, href: real };
    }
    return it;
  });

  return (
    <aside
      aria-hidden={mobileOpen}
      className={`bg-gray-800 text-white min-h-screen transition-all duration-200 ${
        desktopOpen ? 'w-64' : 'w-16'
      } hidden md:block z-20`}
    >
  <div className="flex items-center justify-between px-3 py-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg">{desktopOpen ? 'MedCore' : 'MC'}</div>
        </div>

        <button
          onClick={toggleDesktop}
          aria-label={desktopOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
          className="text-white/80 hover:text-white p-1"
        >
          {desktopOpen ? '⟨' : '⟩'}
        </button>
      </div>

  <nav className="p-2 mt-3">
        {items.map((it) => {
          const active = pathname?.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`block rounded-md px-3 py-2 mb-1 text-sm ${
                active ? 'bg-gray-700' : 'hover:bg-gray-700/60'
              }`}
            >
              {/* Texto en blanco (requisito) */}
              <span className="text-white">{desktopOpen ? it.label : it.label.charAt(0)}</span>
            </Link>
          );
        })}
      </nav>


    </aside>
  );
}

// src/app/dashboard/components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarState } from './SidebarStateProvider';
import { NAV_ITEMS, type NavItem } from '../../../lib/nav';

type Props = { role?: string | null };

export default function Sidebar({ role = 'guest' }: Props) {
  const pathname = usePathname();
  const { desktopOpen, mobileOpen, toggleDesktop } = useSidebarState();

  // Si mobile está abierto, ocultamos el sidebar de escritorio (tal como pediste)
  if (mobileOpen) return null;

  const items: NavItem[] = NAV_ITEMS[role] ?? NAV_ITEMS['guest'] ?? [];

  return (
    <aside
      className={`bg-gray-800 text-white min-h-screen transition-all duration-200 ${
        desktopOpen ? 'w-64' : 'w-16'
      } hidden md:block`}
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

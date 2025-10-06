// src/app/dashboard/components/MobileSidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarState } from './SidebarStateProvider';
import { NAV_ITEMS, type NavItem } from '../../../lib/nav';

type Props = { role?: string | null; inlineButton?: boolean };

export default function MobileSidebar({ role = 'guest', inlineButton = false }: Props) {
  const pathname = usePathname();
  const { mobileOpen, toggleMobile } = useSidebarState();
  const items: NavItem[] = NAV_ITEMS[role] ?? NAV_ITEMS['guest'] ?? [];

  // Si inlineButton=true, mostramos sólo el botón (sin posicionamiento fixed)
  const button = (
    <button
      onClick={toggleMobile}
      aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
      className="p-2 rounded-md bg-gray-800 text-white shadow-md focus:outline-none"
    >
      {mobileOpen ? '✕' : '☰'}
    </button>
  );

  return (
    <>
      {inlineButton ? (
        // botón colocado inline (debe insertarse dentro del header)
        <div className="md:hidden">{button}</div>
      ) : (
        // botón fijo en esquina (como antes) — visible solo en mobile
        <div className="fixed top-3 left-3 z-50 md:hidden">{button}</div>
      )}

      {/* Drawer (igual que antes) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={toggleMobile} aria-hidden />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-gray-800 text-white p-4 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">MedCore</h3>
              <button onClick={toggleMobile} className="p-1 text-white/90">✕</button>
            </div>

            <nav>
              {items.map((it) => {
                const active = pathname?.startsWith(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={toggleMobile}
                    className={`block px-3 py-2 rounded-md mb-1 text-sm ${active ? 'bg-gray-700' : 'hover:bg-gray-700/60'}`}
                  >
                    <span className="text-white">{it.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

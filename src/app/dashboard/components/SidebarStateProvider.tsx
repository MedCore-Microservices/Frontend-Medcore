'use client';
import React, { createContext, useContext, useState } from 'react';

type SidebarContext = {
  desktopOpen: boolean;
  mobileOpen: boolean;
  setDesktopOpen: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
  toggleDesktop: () => void;
  toggleMobile: () => void;
};

const ctx = createContext<SidebarContext | null>(null);

export function SidebarStateProvider({ children }: { children: React.ReactNode }) {
  const [desktopOpen, setDesktopOpenState] = useState<boolean>(true);
  const [mobileOpen, setMobileOpenState] = useState<boolean>(false);

  // Actualizaciones funcionales para evitar problemas de closure/stale state
  const setDesktopOpen = (v: boolean) => {
    setDesktopOpenState(v);
    if (v) setMobileOpenState(false);
  };

  const setMobileOpen = (v: boolean) => {
    setMobileOpenState(v);
    if (v) setDesktopOpenState(false);
  };

  const toggleDesktop = () => {
    setDesktopOpenState(prev => {
      const nv = !prev;
      if (nv) setMobileOpenState(false);
      return nv;
    });
  };

  const toggleMobile = () => {
    setMobileOpenState(prev => {
      const nv = !prev;
      if (nv) setDesktopOpenState(false);
      return nv;
    });
  };

  return (
    <ctx.Provider value={{ desktopOpen, mobileOpen, setDesktopOpen, setMobileOpen, toggleDesktop, toggleMobile }}>
      {children}
    </ctx.Provider>
  );
}

export function useSidebarState() {
  const c = useContext(ctx);
  if (!c) throw new Error('useSidebarState must be used within SidebarStateProvider');
  return c;
}

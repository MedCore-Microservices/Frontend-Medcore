'use client';
import React from 'react';
import { SidebarStateProvider } from './SidebarStateProvider';
import Sidebar from './sidebar';
import MobileSidebar from './mobileSidebar';

export default function DashboardShell({ role, children }: { role: string; children: React.ReactNode; }) {
  return (
    <SidebarStateProvider>
      <div className="flex min-h-screen">
        {/* Mobile button + drawer (visible solo en mobile) */}
        <MobileSidebar role={role} />

        {/* Sidebar escritorio */}
        <Sidebar role={role} />

        {/* Main content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </SidebarStateProvider>
  );
}

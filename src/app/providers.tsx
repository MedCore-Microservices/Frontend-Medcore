// app/providers.tsx
'use client'; 
import { SessionProvider } from 'next-auth/react';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Ahora SessionProvider se ejecuta en el lado del cliente, donde debe estar.
  return <SessionProvider>{children}</SessionProvider>;
}
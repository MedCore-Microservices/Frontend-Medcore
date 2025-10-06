'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CerrarSesion() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/logout')
      .then(() => router.push('/'));
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">Cerrando sesión...</p>
    </div>
  );
}

'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/auth";

export default function CerrarSesionPage() {
   const router = useRouter();

   useEffect(() => {
      // Limpiar localStorage y sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      // Cerrar sesión con NextAuth
      signOut();
      // Redirigir a la landing
      setTimeout(() => router.push("/"), 1000);
   }, [router]);

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <span className="text-xl text-gray-700">Cerrando sesión...</span>
      </div>
   );
}
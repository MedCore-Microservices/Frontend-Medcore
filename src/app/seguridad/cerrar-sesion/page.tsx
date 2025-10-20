'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CerrarSesionPage() {
   const router = useRouter();

   useEffect(() => {
      // Limpiar localStorage y sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Cerrar sesión con NextAuth usando la ruta API
      fetch('/api/auth/signout', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then(() => {
         // Redirigir a la landing
         router.push("/");
      });
   }, [router]);

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <span className="text-xl text-gray-700">Cerrando sesión...</span>
      </div>
   );
}

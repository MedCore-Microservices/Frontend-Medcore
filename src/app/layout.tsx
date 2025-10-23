// app/layout.tsx (CÓDIGO CORREGIDO)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// ✅ Importa el componente cliente
import { Providers } from "./providers"; // Asegúrate de que la ruta sea correcta

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedCore",
  description: "Sistema Integral de Gestión Hospitalaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/*  Eliminamos SessionProvider de aquí */}
        
        {/* ✅ Usamos el componente cliente que lo contiene */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
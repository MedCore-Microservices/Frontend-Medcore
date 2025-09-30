import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { registerUsuario, loginUser } from "./app/servicios/seguridad.service"; 


declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
   secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        fullname: { label: "Full Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          let usuario;
          
   
          if (credentials.fullname) {
            // REGISTRO
            usuario = await registerUsuario(
              String(credentials.email),
              String(credentials.fullname),
              String(credentials.password),
            );
          } else {
            // LOGIN
            const loginData = await loginUser(
              String(credentials.email),
              String(credentials.password)
            );
            usuario = loginData.user;
          }

          if (!usuario || !usuario.id) return null;

          return {
            id: String(usuario.id), 
            email: usuario.email,  
            name: usuario.name || usuario.email,
            role: usuario.role || "paciente" // ← AGREGAR ROL
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string; 
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role; 
      }
      return token;
    },
  },
  pages: {
    signIn: "/seguridad/identificacion-usuarios",
  },
});
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { registerUsuario } from "./app/servicios/seguridad.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
      const usuario = await registerUsuario(
        String(credentials.email),
         String(credentials.fullname),
        String(credentials.password),
       
      );

          if (!usuario || !usuario.id) return null;

          return {
            id: String(usuario.id), 
            email: usuario.email,  
            name: usuario.email,    
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
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/seguridad/identificacion-usuarios",
  },
});
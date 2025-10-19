import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginUser } from "./app/servicios/seguridad.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
          return null;
        }

        try {
         
          const response = await loginUser(credentials.email, credentials.password);
          const user = response.user; 

          if (!user || !user.id) {
            return null;
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.fullname || user.email?.split('@')[0] || 'Usuario',
            role: user.role, 
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
      if (session.user) {
        session.user.id = token.sub as string;
     
        if (token.role) {
          session.user.role = token.role as string;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        if (user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/seguridad/identificacion-usuario",
  },
});

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
            accessToken: response.accessToken, // ← Guardamos el token
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Cuando el usuario inicia sesión, `user` está disponible
      if (user) {
        token.id = user.id;      //  Guardar id explícitamente
        token.role = user.role;  // Guardar role
        token.accessToken = user.accessToken; // Guardar accessToken
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar id, role y accessToken a la sesión del cliente
      if (session.user) {
        session.user.id = token.id as string;    //  Usar token.id, no token.sub
        session.user.role = token.role as string;
      }
      session.accessToken = token.accessToken as string; // Pasar el token a la sesión
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirige al dashboard después del login exitoso
      if (url === baseUrl) {
        return `${baseUrl}/dashboard`;
      }
      // Permite redirecciones relativas
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Permite redirecciones al mismo origen
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/seguridad/identificacion-usuario",
  },
});
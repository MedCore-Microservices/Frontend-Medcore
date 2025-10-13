import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { registerUsuario, loginUser } from "@/app/servicios/seguridad.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1800, // 30 minutos en segundos
      },
    },
  },
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
              String(credentials.password)
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
            role: usuario.role || "paciente",
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  // CONFIGURACIÓN AÑADIDA PARA LA COOKIE DE SESIÓN
  // Esto asegura que la cookie de sesión se elimine cuando se cierre el navegador.
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
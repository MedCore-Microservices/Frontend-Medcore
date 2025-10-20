'use server'

import { passwordSchema } from "@/validation/passwordSchema"
import z from "zod"
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { loginUser } from "@/app/servicios/seguridad.service";

export const loginWithCredentials = async ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema
  });

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      error: true,
      message: "Credenciales inválidas"
    };
  }

  try {
    // Primero obtener el token del backend
    const backendResponse = await loginUser(email, password);
    
    // Luego crear la sesión de NextAuth
    await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    
    return {
      success: true,
      message: "Login exitoso",
      accessToken: backendResponse.accessToken // Devolver el token para guardarlo en localStorage
    };
  } catch (error: any) {
    if (error instanceof AuthError) {
      return {
        error: true,
        message: "Email o contraseña incorrectos"
      };
    }
    return {
      error: true,
      message: error.message || "Error en el login"
    };
  }
};
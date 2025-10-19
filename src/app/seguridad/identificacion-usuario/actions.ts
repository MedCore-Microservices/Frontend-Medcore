'use server'

import { passwordSchema } from "@/validation/passwordSchema"
import z from "zod"
import { signIn } from "@/auth";
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
    // Llama directamente a tu servicio de auth (no usa NextAuth internamente)
    const response = await loginUser(email, password);
    
    return {
      success: true,
      message: "Login exitoso",
      accessToken: response.accessToken, // ← esto es clave
      user: response.user
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message || "Error en el login"
    };
  }
};
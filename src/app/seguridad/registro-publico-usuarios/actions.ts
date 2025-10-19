// actions.ts
'use server';

import { z } from "zod";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { registerUsuario } from "@/app/servicios/seguridad.service";

const newUserSchema = z.object({
  email: z.string().email(),
  fullname: z.string().min(1, "El nombre completo es obligatorio"), 
}).and(passwordMatchSchema);

export const registerUser = async ({
  email,
  fullname,
  password,
  passwordConfirm
}: {
  email: string;
  fullname: string;
  password: string;
  passwordConfirm: string;
}) => {

  const newUserValidation = newUserSchema.safeParse({
    email,
    fullname,          
    password,
    passwordConfirm
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message: newUserValidation.error.issues[0]?.message ?? "Error de validación"
    };
  }

  // 3. Si la validación pasa, llamamos al backend
  try {
    const result = await registerUsuario(email, password, fullname);

    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message || "Error al registrar el usuario en el servidor"
    };
  }
};
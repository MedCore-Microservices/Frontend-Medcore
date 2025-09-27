// actions.ts
'use server';

import { z } from "zod";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { registerUsuario } from "../../servicios/seguridad.service";

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
   console.log('🔍 SERVER ACTION: Iniciando registro...');

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
     console.log('📡 Llamando a registerUsuario...'); // ← LOG
    const result = await registerUsuario(email, password, fullname);
        console.log('✅ Resultado del servicio:', result); // ← LOG

    return {
      success: true,
      data: result
    };
  } catch (error: any) {
     console.log('❌ Error en server action:', error); // ← LOG
    return {
      error: true,
      message: error.message || "Error al registrar el usuario en el servidor"
    };
  }
};
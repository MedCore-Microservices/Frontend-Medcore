// actions.ts
'use server';

import { z } from "zod";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { registerUsuario, resendVerificationCode, verifyEmailCode } from "../../servicios/seguridad.service";

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

  // Server-side guard: permiso para registro
  // Si la variable está definida y es 'false', rechazamos el registro
  { /*if (process.env.ALLOW_REGISTRATION_SERVER_SIDE === 'false') {
    return {
      error: true,
      message: 'Registro deshabilitado en este entorno'
    };
  }*/ }

  // 3. Si la validación pasa, llamamos al backend
  try {
     console.log('📡 Llamando a registerUsuario...'); // ← LOG
    const result = await registerUsuario(email, password, fullname);
        console.log('✅ Resultado del servicio:', result); // ← LOG

    return {
      success: true,
      data: result,
       message: "Usuario registrado. Por favor verifica tu email con el código enviado.",
      requiresVerification: true // ← NUEVO: indica que necesita verificación

    };
  } catch (error) {
     console.log('❌ Error en server action:', error); // ← LOG
    const errMsg = error instanceof Error ? error.message : String(error);
    return {
      error: true,
      message: errMsg || "Error al registrar el usuario en el servidor"
    };
  }
};

export const verifyEmail = async (email: string, code: string) => {
  try {
    console.log('🔍 Verificando código para:', email);
    const result = await verifyEmailCode(email, code);
    
    return {
      success: true,
      message: result.message,
      data: result.user
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return {
      error: true,
      message: errMsg || "Error al verificar el código"
    };
  }
};

// Acción para reenviar código
export const resendVerification = async (email: string) => {
  try {
    console.log('🔍 Reenviando código para:', email);
    const result = await resendVerificationCode(email);
    
    return {
      success: true,
      message: result.message
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return {
      error: true,
      message: errMsg || "Error al reenviar el código"
    };
  }
};
'use server';

import { verifyEmailCode, resendVerificationCode } from "../../servicios/seguridad.service";

export const verifyEmailAction = async (email: string, code: string) => {
  try {
    console.log('🔍 Verificando código para:', email);
    const result = await verifyEmailCode(email, code);
    
    return {
      success: true,
      message: result.message,
      data: result.user
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message || "Error al verificar el código"
    };
  }
};

export const resendVerificationAction = async (email: string) => {
  try {
    console.log('🔍 Reenviando código para:', email);
    const result = await resendVerificationCode(email);
    
    return {
      success: true,
      message: result.message
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message || "Error al reenviar el código"
    };
  }
};
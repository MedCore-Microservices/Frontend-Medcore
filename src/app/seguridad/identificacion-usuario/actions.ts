'use server'

import { passwordSchema } from "@/validation/passwordSchema"
import z from "zod"
import { signIn } from "@/auth";

export const loginWithCredentials = async ({
    email,
    password
}: {
    email: string,
    password: string
}) => {
    const loginSchema = z.object({
        email: z.string().email(),
        password: passwordSchema
    })
    
    const loginValidation = loginSchema.safeParse({
        email,
        password
    })
    
    if (!loginValidation.success) {
        return {
            error: true,
            message: loginValidation.error.issues[0]?.message ?? "Error de validación"
        }
    }

    try {
        console.log('📡 Intentando login con NextAuth para:', email);
        
 
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (result?.error) {
            return {
                error: true,
                message: "Credenciales inválidas"
            };
        }

        return {
            success: true,
            message: "Login exitoso"
        };
    } catch (error: any) {
        const errorMessage = error.message.includes('verifica tu email') 
            ? "Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada."
            : error.message || "Error en el login";
            
        return {
            error: true,
            message: errorMessage
        };
    }
}
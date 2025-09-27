'use server'

import { passwordSchema } from "@/validation/passwordSchema"
import z from "zod"
import { loginUser } from "../../servicios/seguridad.service";

export const loginWithCredentials=async({
    email,
    password
}: {
    email:string,
    password:string
})=>{
    const loginSchema=z.object({
        email:z.string().email(),
        password:passwordSchema
    })
    const loginValidation=loginSchema.safeParse({
        email,
        password
    })
    if(!loginValidation.success){
        return {
            error:true,
            message:loginValidation.error.issues[0]?.message ??"Error de validación"


        }
    }

      try {
        console.log('📡 Intentando login para:', email);
        const result = await loginUser(email, password);
        
        return {
            success: true,
            message: "Login exitoso",
            data: result // { accessToken, refreshToken, user }
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
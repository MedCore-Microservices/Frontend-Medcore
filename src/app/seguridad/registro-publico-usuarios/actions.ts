"use server";
import { z } from "zod";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
export const registerUser=async(
    {email,password,passwordConfirm}:{
    email:string;
    password:string;
    passwordConfirm:string;

})=>{
    const newUserSchema=z.object({
        email:z.string().email(),
    }).and(passwordMatchSchema);

    const newUserValidation=newUserSchema.safeParse({
        email,
        password,
        passwordConfirm

    })

    if(!newUserValidation.success){
        return {
            error:true,
            message:newUserValidation.error.issues[0]?.message ??"Error de validación"

        }
    }
}

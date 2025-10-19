'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/validation/passwordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { loginWithCredentials } from "./actions";
import { useState } from "react"; // ← IMPORTAR useState
import {useRouter} from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // iconos de lucide-react


const formSchema = z.object({
   email: z.string().email(),
   password: passwordSchema,
})

export default function IdentificacionUsuarioPage() {
   const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
   
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues:{
         email: '',
         password: '',
      }
   });

 const handleSubmit = async (data: z.infer<typeof formSchema>) => {
  setLoading(true);
  setMessage(null);
  
  try {
    const response = await loginWithCredentials({
      email: data.email,
      password: data.password
    });

    if (response.error) {
      setMessage({ type: 'error', text: response.message });
    } else {
      // GUARDAR EL TOKEN EN LOCALSTORAGE
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.accessToken);
      }

      setMessage({ type: 'success', text: '¡Login exitoso! Redirigiendo...' });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  } catch {
    setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
  } finally {
    setLoading(false);
  }
};
   return (
      <main className="flex justify-center items-center min-h-screen px-4">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle>Login</CardTitle>
               <CardDescription>Inicia sesión en tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
               {/*  MOSTRAR MENSAJES - COMO EN REGISTRO */}
               {message && (
                  <div className={`p-3 rounded mb-4 ${
                     message.type === 'success' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                     {message.text}
                  </div>
               )}
     
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                     <fieldset
                        disabled={loading}
                        className="flex flex-col gap-2"
                     >
                        <FormField
                           control={form.control}
                           name="email"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Email</FormLabel>
                                 <FormControl>
                                    <Input {...field} type="email" placeholder="example@example.com" />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

<FormField
         control={form.control}
         name="password"
         render={({ field }) => (
         <FormItem>
            <FormLabel>Contraseña</FormLabel>
            <div className="relative">
               <FormControl>
                  <Input
                     {...field}
                     type={showPassword ? "text" : "password"}
                     placeholder="••••••"
                     className="pr-10"
                  />
               </FormControl>
               <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
               >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
            </div>
            <FormMessage />
         </FormItem>
   )}
/>

                        <Button type="submit" disabled={loading} className="w-full">
                           {loading ? "Iniciando sesión..." : "Login"}
                        </Button>
                     </fieldset>
                  </form>
               </Form>
               <button
      onClick={() => router.back()}
      className="text-sm underline mr-2"
    >
      Volver
      </button>
            </CardContent>
         </Card>
      </main>
   );
}
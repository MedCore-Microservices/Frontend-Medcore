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

const formSchema = z.object({
   email: z.string().email(),
   password: passwordSchema,
})

export default function IdentificacionUsuarioPage() {
   const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
   const [loading, setLoading] = useState(false);
   
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

         console.log("Respuesta del login:", response);
         
         if (response.error) {
            // ✅ MOSTRAR MENSAJE DE ERROR (incluye "verifica tu email")
            setMessage({ type: 'error', text: response.message });
         } else {
            setMessage({ type: 'success', text: '¡Login exitoso!' });
            // Aquí redirigir al dashboard o guardar token
            form.reset();
         }
      } catch (error) {
         setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
      } finally {
         setLoading(false);
      }
   };

   return (
      <main className="flex justify-center items-center min-h-screen">
         <Card className="w-[350px]">
            <CardHeader>
               <CardTitle>Login</CardTitle>
               <CardDescription>Inicia sesión en tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
               {/* ✅ MOSTRAR MENSAJES - COMO EN REGISTRO */}
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
                                 <FormControl>
                                    <Input {...field} type="password" placeholder="••••••" />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <Button type="submit" disabled={loading}>
                           {loading ? "Iniciando sesión..." : "Login"}
                        </Button>
                     </fieldset>
                  </form>
               </Form>
            </CardContent>
         </Card>
      </main>
   );
}
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form"; 
import { useForm } from "react-hook-form";   
import { z } from 'zod';
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { registerUser } from "./actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VerifyEmailModal from "../components/VerifyEmailModal"; // ← NUEVO IMPORT

// Esquema actualizado: incluye fullname y valida contraseñas
const formSchema = z.object({
  email: z.string().email("Email inválido"),
  fullname: z.string().min(1, "El nombre completo es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  passwordConfirm: z.string().min(6, "La confirmación de contraseña debe tener al menos 6 caracteres"),
}).and(passwordMatchSchema);

export default function RegistroPublicoUsuariosPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // ✅ NUEVOS ESTADOS PARA EL MODAL
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{email: string, fullname: string} | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      fullname: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await registerUser({
        email: data.email,
        fullname: data.fullname,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });
      
      console.log("Respuesta del servidor:", response);
      
      if (response.error) {
        setMessage({ type: 'error', text: response.message });
      } else {
        // ✅ MOSTRAR MODAL EN LUGAR DE MENSAJE DE ÉXITO
        setRegisteredUser({
          email: data.email,
          fullname: data.fullname
        });
        setShowVerifyModal(true);
        // NO hacer form.reset() aquí, lo haremos después de verificación
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN CUANDO LA VERIFICACIÓN ES EXITOSA
  const handleVerificationSuccess = () => {
    setMessage({ type: 'success', text: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.' });
    form.reset(); // Limpiar formulario solo después de verificación exitosa
    setRegisteredUser(null);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Crea una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mensaje de feedback */}
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
              
              {/* Campo: Nombre completo */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ana García" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="ana@ejemplo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Contraseña */}
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

              {/* Campo: Confirmar contraseña */}
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botón de envío */}
              <Button 
                type="submit" 
                className="mt-2"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ✅ MODAL DE VERIFICACIÓN */}
      {registeredUser && (
        <VerifyEmailModal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          userEmail={registeredUser.email}
          userFullname={registeredUser.fullname}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}
    </main>
  );
}
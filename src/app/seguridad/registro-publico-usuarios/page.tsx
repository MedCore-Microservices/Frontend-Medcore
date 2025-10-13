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
import VerifyEmailModal from "../components/VerifyEmailModal";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

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
  const router = useRouter();

  // Estados para modal y usuario registrado
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{email: string, fullname: string} | null>(null);

  // Estados para mostrar/ocultar contraseñas (mover hooks fuera del render prop)
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
      
      if (response?.error) {
        setMessage({ type: 'error', text: response.message ?? 'Error en el registro' });
      } else {
        setRegisteredUser({
          email: data.email,
          fullname: data.fullname
        });
        setShowVerifyModal(true);
        // no reseteamos aquí, lo hacemos después de verificación exitosa
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setMessage({ type: 'success', text: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.' });
    form.reset(); // Limpiar formulario solo después de verificación exitosa
    setRegisteredUser(null);
    setTimeout(() => router.push('/seguridad/identificacion-usuario'), 800);
  };

  return (
    <main className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Crea una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent>
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
              
              {/* Nombre completo */}
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

              {/* Email */}
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

              {/* Contraseña */}
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
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmación de contraseña (¡IMPORTANTE!) */}
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPasswordConfirm ? "text" : "password"}
                          placeholder="••••••"
                          className="pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(prev => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showPasswordConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                      >
                        {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="mt-2 w-full"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </Form>

          <button
            onClick={() => router.back()}
            className="text-sm underline mr-2 mt-3"
          >
            Volver
          </button>
        </CardContent>
      </Card>

      {/* Modal de verificación */}
      {registeredUser && (
        <VerifyEmailModal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          userEmail={registeredUser.email}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}
    </main>
  );
}

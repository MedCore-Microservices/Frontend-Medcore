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

// Schema actualizado para registro de pacientes (incluye validaciones por campo)
const formSchema = z.object({
  identification: z.string().min(4, "La identificación es obligatoria"),
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido"),
  dateOfBirth: z.string().refine((val: string) => !isNaN(Date.parse(val)), { message: 'Fecha de nacimiento inválida' }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"] as const, { message: 'Selecciona un género' }),
  phone: z.string().min(7, "Teléfono inválido"),
  address: z.string().min(3, "La dirección es obligatoria"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  passwordConfirm: z.string().min(6, "La confirmación debe tener al menos 6 caracteres"),
}).and(passwordMatchSchema);

export default function RegistroPacientePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  // Estados para modal y usuario registrado
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{ email: string, fullname: string } | null>(null);

  // Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identification: '',
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      gender: 'MALE',
      phone: '',
      address: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setMessage(null);

    const fullname = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

    try {
      // Incluimos passwordConfirm para evitar "undefined" en el backend
      const payload = {
        identificationNumber: data.identification,
        fullname,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        role: 'PACIENTE',
      } as any;

      const response = await registerUser(payload);
      console.log('Respuesta del servidor:', response);

      // Mantener flujo original: si hay error -> mostrar mensaje; si ok -> abrir modal y setRegisteredUser
      if (response?.error) {
        setMessage({ type: 'error', text: response.message ?? 'Error en el registro' });
      } else {
        setRegisteredUser({ email: data.email, fullname });
        setShowVerifyModal(true);
        // NO resetear formulario aquí — se hace después de verificación exitosa
      }
    } catch (err: any) {
      console.error(err);
      // Si el backend responde con un body pero hubo problema al parsear, lo mostramos
      const text = err?.message ?? 'Error de conexión con el servidor';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setMessage({ type: 'success', text: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.' });
    form.reset(); // Limpiar formulario solo después de verificación exitosa
    setRegisteredUser(null);
    // Mantener redirect EXACTO que tenías
    setTimeout(() => router.push('/patients'), 800);
  };

  return (
    <main className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de Paciente</CardTitle>
          <CardDescription>Formulario de registro público para nuevos pacientes</CardDescription>
        </CardHeader>

        <CardContent>
          {message && (
            <div className={`p-3 rounded mb-4 ${message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
              {message.text}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Identificación */}
              <FormField
                control={form.control}
                name="identification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificación</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="C.C. 12345678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nombre */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ana" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Apellido */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="García" />
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

              {/* Fecha de nacimiento */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Género - select nativo para evitar problemas de import */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="MALE">Masculino</option>
                        <option value="FEMALE">Femenino</option>
                        <option value="OTHER">Otro / Prefiero no decir</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Teléfono */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contacto (teléfono)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+57 300 1234567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dirección */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Calle 123 #45-67, Medellín" />
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

              {/* Confirmar contraseña */}
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

              {/* Botones */}
              <div className="md:col-span-2 flex gap-3 mt-2">
                <Button type="submit" className="w-40" disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrar paciente'}
                </Button>
                <Button variant="outline" type="button" onClick={() => router.push('/patients')} className="w-40">
                  Cancelar
                </Button>
              </div>

            </form>
          </Form>

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

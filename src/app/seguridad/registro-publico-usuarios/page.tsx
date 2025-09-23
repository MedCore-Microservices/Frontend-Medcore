'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form"; // ← SÍ
import { useForm } from "react-hook-form";   
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must contain at least 6 characters").max(100),
  confirmPassword: z.string().min(6, "Password must contain at least 6 characters").max(100),
});

export default function RegistroPublicoUsuariosPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);

  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Register for a new account</CardDescription>
        </CardHeader>
        <CardContent>
     
          <Form {...form}>
      
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button type="submit" className="w-full mt-4">
                Register
              </button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
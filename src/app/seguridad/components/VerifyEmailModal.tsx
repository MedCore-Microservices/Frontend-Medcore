'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyEmailAction, resendVerificationAction } from "./actions"; // ← USAR ACTIONS

interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userFullname: string;
  onVerificationSuccess: () => void;
}

export default function VerifyEmailModal({ 
  isOpen, 
  onClose, 
  userEmail, 
  userFullname,
  onVerificationSuccess 
}: VerifyEmailModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (code.length !== 6) {
      setMessage({ type: 'error', text: 'El código debe tener 6 dígitos' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // ✅ USAR SERVER ACTION
      const response = await verifyEmailAction(userEmail, code);
      
      if (response.error) {
        setMessage({ type: 'error', text: response.message });
      } else {
        setMessage({ type: 'success', text: response.message });
        
        setTimeout(() => {
          onVerificationSuccess();
          onClose();
        }, 1500);
      }
      
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setMessage(null);

    try {
      // ✅ USAR SERVER ACTION
      const response = await resendVerificationAction(userEmail);
      
      if (response.error) {
        setMessage({ type: 'error', text: response.message });
      } else {
        setMessage({ type: 'success', text: response.message });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[400px] mx-4">
        <CardHeader>
          <CardTitle>Verifica tu email</CardTitle>
          <CardDescription>
            Te enviamos un código de 6 dígitos a <strong>{userEmail}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {message && (
            <div className={`p-3 rounded ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Código de verificación
            </label>
            <Input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="text-center text-xl font-mono tracking-widest"
            />
            <p className="text-xs text-gray-500 mt-1">Ingresa el código de 6 dígitos que recibiste</p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleVerify} 
              disabled={loading || code.length !== 6}
              className="flex-1"
            >
              {loading ? "Verificando..." : "Verificar"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleResendCode}
              disabled={resendLoading}
            >
              {resendLoading ? "Enviando..." : "Reenviar código"}
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} size="sm">
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
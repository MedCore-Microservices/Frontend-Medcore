import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { getAuthTokenClient } from '@/lib/getAuthToken';
import { createAppointment } from '@/app/servicios/appointment.service';

const BUSINESS_URL = process.env.NEXT_PUBLIC_MS_BUSINESS_URL || 'http://localhost:3002';

export default function ConsultationForm({ 
  appointmentId, 
  initialPatientId, 
  initialPatientName, 
  initialReason,
  onSuccess = () => {} 
}) {
  const [patientId, setPatientId] = useState(initialPatientId || '');
  const [patientName, setPatientName] = useState(initialPatientName || '');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState(initialReason || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [priority, setPriority] = useState('routine');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Si cambian las props iniciales, actualizar estado (útil si cargan asíncronamente)
  useEffect(() => {
    if (initialPatientId) setPatientId(initialPatientId);
    if (initialPatientName) setPatientName(initialPatientName);
    if (initialReason) setReason(initialReason);
  }, [initialPatientId, initialPatientName, initialReason]);

  const validate = () => {
    if (!patientId && !patientName) {
      setError('Debe indicar el paciente (ID o nombre).');
      return false;
    }
    // Si es nueva cita, fecha es obligatoria. Si es consulta existente, no.
    if (!appointmentId && !date) {
      setError('Fecha y hora son requeridas.');
      return false;
    }
    if (!reason) {
      setError('Motivo de la consulta es requerido.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccessMsg(null);
    setError(null);

    try {
      if (appointmentId) {
        // MODO: Registrar Historia Clínica / Diagnóstico para cita existente
        const token = getAuthTokenClient();
        const payload = {
          patientId: Number(patientId),
          description: reason,
          diagnosis: diagnosis,
          treatment: treatment,
          // Otros campos que MedicalRecord espera
          doctorId: undefined, // El backend lo saca del token si es médico
        };

        const res = await fetch(`${BUSINESS_URL}/api/medical-records`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });

        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.message || 'Error guardando historia clínica');
        }
        
        setSuccessMsg('Historia clínica guardada correctamente');
        onSuccess(body);

      } else {
        // MODO: Crear nueva cita (Agendamiento)
        const payload = {
          patientId: patientId ? String(patientId) : undefined,
          date, // ISO string o lo que espere el servicio
          reason,
          doctorId: undefined, // Se asignará o seleccionará
          // diagnosis y treatment no se guardan al crear la cita inicial
        };
        
        // Usamos el servicio existente que ya maneja la URL correcta
        const created = await createAppointment(payload);
        setSuccessMsg('Cita creada correctamente');
        
        // Limpiar formulario solo si es creación
        setPatientId('');
        setPatientName('');
        setDate('');
        setReason('');
        onSuccess(created);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error de red al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!appointmentId;

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Registrar atención médica' : 'Registrar nueva cita'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Paciente ID</label>
              <Input 
                value={patientId} 
                onChange={(e) => setPatientId(e.target.value)} 
                placeholder="Id numérico" 
                disabled={isEditMode} // No cambiar paciente en consulta activa
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Nombre del paciente</label>
              <Input 
                value={patientName} 
                onChange={(e) => setPatientName(e.target.value)} 
                placeholder="Nombre completo" 
                disabled={isEditMode}
              />
            </div>

            {!isEditMode && (
              <div>
                <label className="text-sm text-muted-foreground">Fecha y hora</label>
                <input className="w-full rounded-md border px-3 py-2" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground">Prioridad</label>
              <select className="w-full rounded-md border px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="routine">Normal</option>
                <option value="urgent">Urgente</option>
                <option value="stat">Estat</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground">Motivo de consulta</label>
              <textarea 
                className="w-full rounded-md border p-2" 
                rows={3} 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground font-bold">Diagnóstico</label>
              <textarea 
                className="w-full rounded-md border p-2 bg-yellow-50" 
                rows={3} 
                value={diagnosis} 
                onChange={(e) => setDiagnosis(e.target.value)} 
                placeholder="Escriba el diagnóstico médico..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground font-bold">Tratamiento</label>
              <textarea 
                className="w-full rounded-md border p-2 bg-green-50" 
                rows={3} 
                value={treatment} 
                onChange={(e) => setTreatment(e.target.value)} 
                placeholder="Escriba el plan de tratamiento..."
              />
            </div>
          </div>

          {error && <div className="mt-3 text-sm text-destructive">{error}</div>}
          {successMsg && <div className="mt-3 text-sm text-green-600">{successMsg}</div>}
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2">
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white" disabled={loading}>
              {loading ? 'Guardando...' : (isEditMode ? 'Guardar Historia Clínica' : 'Crear Cita')}
            </button>
            {!isEditMode && (
              <button type="button" className="px-4 py-2 rounded-md border" onClick={() => {
                setPatientId(''); setPatientName(''); setDate(''); setReason(''); setDiagnosis(''); setTreatment(''); setPriority('routine'); setError(null); setSuccessMsg(null);
              }}>
                Limpiar
              </button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

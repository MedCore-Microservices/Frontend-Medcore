import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';

export default function ConsultationForm({ onSuccess = () => {} }) {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [priority, setPriority] = useState('routine');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const validate = () => {
    if (!patientId && !patientName) {
      setError('Debe indicar el paciente (ID o nombre).');
      return false;
    }
    if (!date) {
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

    const payload = {
      patientId: patientId ? Number(patientId) : undefined,
      patientName: patientName || undefined,
      date,
      reason,
      diagnosis,
      treatment,
      priority,
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.message || 'Error creando la consulta');
      } else {
        setSuccessMsg('Consulta creada correctamente');
        setPatientId('');
        setPatientName('');
        setDate('');
        setReason('');
        setDiagnosis('');
        setTreatment('');
        setPriority('routine');
        onSuccess(body);
      }
    } catch (err) {
      console.error(err);
      setError('Error de red al crear la consulta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Registrar consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Paciente ID</label>
              <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Id numérico (opcional)" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Nombre del paciente</label>
              <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Nombre completo" />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Fecha y hora</label>
              <input className="w-full rounded-md border px-3 py-2" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Prioridad</label>
              <select className="w-full rounded-md border px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="routine">Normal</option>
                <option value="urgent">Urgente</option>
                <option value="stat">Estat</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground">Motivo</label>
              <textarea className="w-full rounded-md border p-2" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground">Diagnóstico (opcional)</label>
              <textarea className="w-full rounded-md border p-2" rows={3} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground">Tratamiento (opcional)</label>
              <textarea className="w-full rounded-md border p-2" rows={3} value={treatment} onChange={(e) => setTreatment(e.target.value)} />
            </div>
          </div>

          {error && <div className="mt-3 text-sm text-destructive">{error}</div>}
          {successMsg && <div className="mt-3 text-sm text-green-600">{successMsg}</div>}
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2">
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar consulta'}
            </button>
            <button type="button" className="px-4 py-2 rounded-md border" onClick={() => {
              setPatientId(''); setPatientName(''); setDate(''); setReason(''); setDiagnosis(''); setTreatment(''); setPriority('routine'); setError(null); setSuccessMsg(null);
            }}>
              Limpiar
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

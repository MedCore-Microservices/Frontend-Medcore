import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';

export default function PatientVitals({ onSuccess = () => {} }) {
  const [patientId, setPatientId] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [spo2, setSpo2] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [pain, setPain] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const validate = () => {
    // patientId optional, but at least one vital must be provided
    const anyProvided = [systolic, diastolic, heartRate, respiratoryRate, temperature, spo2, weight, height, pain].some((v) => v !== '');
    if (!anyProvided) {
      setError('Debe registrar al menos un signo vital.');
      return false;
    }

    // numeric validations
    const numericFields = [
      { name: 'Sistólica', value: systolic },
      { name: 'Diastólica', value: diastolic },
      { name: 'Frecuencia cardíaca', value: heartRate },
      { name: 'Frecuencia respiratoria', value: respiratoryRate },
      { name: 'Temperatura', value: temperature },
      { name: 'SpO2', value: spo2 },
      { name: 'Peso', value: weight },
      { name: 'Talla', value: height },
      { name: 'Dolor', value: pain },
    ];

    for (const f of numericFields) {
      if (f.value === '') continue;
      const n = Number(f.value);
      if (Number.isNaN(n)) {
        setError(`${f.name} debe ser un número válido.`);
        return false;
      }
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
      vitals: {
        bloodPressure: systolic || diastolic ? { systolic: systolic ? Number(systolic) : null, diastolic: diastolic ? Number(diastolic) : null } : undefined,
        heartRate: heartRate ? Number(heartRate) : undefined,
        respiratoryRate: respiratoryRate ? Number(respiratoryRate) : undefined,
        temperature: temperature ? Number(temperature) : undefined,
        spo2: spo2 ? Number(spo2) : undefined,
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
        painScore: pain ? Number(pain) : undefined,
        notes: notes || undefined,
      }
    };

    try {
      const res = await fetch('/api/medical-records/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.message || 'Error guardando signos vitales');
      } else {
        setSuccessMsg('Signos vitales guardados');
        onSuccess(body);
        // keep fields or clear
      }
    } catch (err) {
      console.error(err);
      setError('Error de red al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPatientId(''); setSystolic(''); setDiastolic(''); setHeartRate(''); setRespiratoryRate(''); setTemperature(''); setSpo2(''); setWeight(''); setHeight(''); setPain(''); setNotes(''); setError(null); setSuccessMsg(null);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Signos vitales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <label className="text-sm text-muted-foreground">Paciente ID</label>
              <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Id (opcional)" />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Sistólica (mmHg)</label>
              <Input value={systolic} onChange={(e) => setSystolic(e.target.value)} placeholder="Ej. 120" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Diastólica (mmHg)</label>
              <Input value={diastolic} onChange={(e) => setDiastolic(e.target.value)} placeholder="Ej. 80" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Frecuencia cardíaca (lpm)</label>
              <Input value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="Ej. 75" />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Frecuencia respiratoria (rpm)</label>
              <Input value={respiratoryRate} onChange={(e) => setRespiratoryRate(e.target.value)} placeholder="Ej. 16" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Temperatura (°C)</label>
              <Input value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="Ej. 36.6" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">SpO2 (%)</label>
              <Input value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="Ej. 98" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Dolor (0-10)</label>
              <Input value={pain} onChange={(e) => setPain(e.target.value)} placeholder="Ej. 0-10" />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Peso (kg)</label>
              <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Ej. 70" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Talla (cm)</label>
              <Input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Ej. 170" />
            </div>

            <div className="md:col-span-4">
              <label className="text-sm text-muted-foreground">Notas</label>
              <textarea className="w-full rounded-md border p-2" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          {error && <div className="mt-3 text-sm text-destructive">{error}</div>}
          {successMsg && <div className="mt-3 text-sm text-green-600">{successMsg}</div>}
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2">
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            <button type="button" className="px-4 py-2 rounded-md border" onClick={handleClear}>Limpiar</button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

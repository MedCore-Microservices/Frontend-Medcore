"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPatient, updatePatient } from '@/app/servicios/patients.service';

export default function EditPatientPage() {
  const params = useSearchParams();
  const id = params.get('id');
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    identificationNumber: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    bloodType: '',
    allergies: '',
    chronicDiseases: '',
    emergencyContact: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
        try {
        const res = await getPatient(id);
        const patient = res.patient || res;
        setFullname(patient.fullname || '');
        setForm({
          identificationNumber: patient.identificationNumber || '',
          email: patient.email || '',
          phone: patient.phone || '',
          dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
          age: patient.age ? String(patient.age) : '',
          gender: patient.gender || '',
          bloodType: patient.bloodType || '',
          allergies: patient.allergies || '',
          chronicDiseases: patient.chronicDiseases || '',
          emergencyContact: patient.emergencyContact || '',
          status: patient.status || 'ACTIVE'
        });
      } catch (e) {
        console.error('Error cargando paciente', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return alert('ID requerido');
    try {
        await updatePatient(id, {
        fullname,
        identificationNumber: form.identificationNumber,
        email: form.email || undefined,
        phone: form.phone || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        bloodType: form.bloodType || undefined,
        allergies: form.allergies || undefined,
        chronicDiseases: form.chronicDiseases || undefined,
        emergencyContact: form.emergencyContact || undefined,
        status: form.status
      });
      // Preserve other query params (like page/filters) when returning
      const qp: string[] = [];
      params.forEach((v, k) => {
        if (k !== 'id') qp.push(`${k}=${encodeURIComponent(v)}`);
      });
      const qs = qp.length ? `?${qp.join('&')}` : '';
      window.location.href = `/patients${qs}`;
    } catch (err) {
      const msg = (err as unknown as { message?: string })?.message || 'Error';
      alert('Error actualizando paciente: ' + msg);
    }
  };

  if (!id) return <div className="p-6">ID requerido en query string, ej: /patients/editPatient?id=123</div>;
  if (loading) return <div className="p-6">Cargando...</div>;

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar paciente</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Nombre completo</label>
            <input value={fullname} onChange={(e) => setFullname(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm">Identificación</label>
            <input value={form.identificationNumber} onChange={(e) => handleChange('identificationNumber', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm">Teléfono</label>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm">Fecha de nacimiento</label>
            <input type="date" value={form.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm">Edad</label>
            <input type="number" value={form.age} onChange={(e) => handleChange('age', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm">Género</label>
            <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className="mt-1 block w-full border rounded p-2">
              <option value="">--</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Tipo de sangre</label>
            <input value={form.bloodType} onChange={(e) => handleChange('bloodType', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm">Alergias</label>
            <input value={form.allergies} onChange={(e) => handleChange('allergies', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm">Enfermedades crónicas</label>
            <input value={form.chronicDiseases} onChange={(e) => handleChange('chronicDiseases', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm">Contacto de emergencia</label>
            <input value={form.emergencyContact} onChange={(e) => handleChange('emergencyContact', e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
        </div>

        <div className="flex justify-between">
          <a href={`/patients${params.toString() ? `?${params.toString().replace(/(^|&)id=[^&]*&?/, '').replace(/(^&|&$)/, '')}` : ''}`} className="px-4 py-2 bg-gray-200 rounded">Cancelar</a>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </form>
    </div>
  );
}

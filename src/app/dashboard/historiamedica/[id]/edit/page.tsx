import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getConsultationById, updateConsultation } from '@/app/servicios/business.service';

export default function EditMedicalConsultationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    observations: '',
    nextAppointment: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConsultation = async () => {
      try {
        const data = await getConsultationById(params.id);
        setFormData(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la consulta médica');
      } finally {
        setLoading(false);
      }
    };

    loadConsultation();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateConsultation(params.id, formData);
      router.push(`/dashboard/historiamedica/patient/${formData.patientId}`);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la consulta médica');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6"><h1 className="text-2xl">Cargando...</h1></div>;
  }

  if (error) {
    return <div className="p-6"><h1 className="text-2xl text-red-600">{error}</h1></div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Consulta #{params.id}</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título"
          className="block w-full p-2 border border-gray-300 rounded mb-4"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="block w-full p-2 border border-gray-300 rounded mb-4"
        />
        {/* Agregar más campos según sea necesario */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
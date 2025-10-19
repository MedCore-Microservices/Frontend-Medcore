
export default function EditMedicalConsultationPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Consulta #{params.id}</h1>
      <p className="text-gray-600 mt-2">Formulario para actualizar la consulta.</p>
    </div>
  );
}
import React from 'react';

export default function EditUser({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Editar Usuario #{params.id}</h1>
      <p className="text-gray-600">Actualiza los datos del usuario seleccionado.</p>
      {/* Implementar formulario de edición */}
    </div>
  );
}
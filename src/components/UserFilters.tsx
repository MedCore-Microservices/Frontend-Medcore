import React from 'react';

export default function UserFilters() {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4">Filtros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option>Doctor</option>
            <option>Enfermera</option>
            <option>Paciente</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Especialidad</label>
          <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option>Cardiología</option>
            <option>Pediatría</option>
            <option>Neurología</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Buscar por Nombre/ID</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Nombre o Identificación"
          />
        </div>
      </div>
    </div>
  );
}
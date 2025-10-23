import React from 'react';

export default function CsvErrorLog() {
  const errors = [
    { row: 1, document: 'file1.csv', field: 'Nombre', error: 'Campo vacío' },
    { row: 2, document: 'file2.csv', field: 'Identificación', error: 'Formato inválido' },
  ];

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4">Log de Errores</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Fila</th>
            <th className="border border-gray-300 px-4 py-2">Documento</th>
            <th className="border border-gray-300 px-4 py-2">Campo</th>
            <th className="border border-gray-300 px-4 py-2">Error</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((error, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{error.row}</td>
              <td className="border border-gray-300 px-4 py-2">{error.document}</td>
              <td className="border border-gray-300 px-4 py-2">{error.field}</td>
              <td className="border border-gray-300 px-4 py-2">{error.error}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
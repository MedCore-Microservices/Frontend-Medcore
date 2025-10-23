import React from 'react';

export default function DocumentModal({ document }: { document: { filename: string; filePath: string } }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4">Visualización de Documento</h2>
        <iframe
          src={document.filePath}
          className="w-full h-64 border rounded-lg"
          title={document.filename}
        ></iframe>
        <div className="mt-4 flex justify-end">
          <a
            href={document.filePath}
            download={document.filename}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Descargar
          </a>
        </div>
      </div>
    </div>
  );
}
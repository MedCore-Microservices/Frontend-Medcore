import { downloadDocument } from '@/app/servicios/business.service';
export default function DocumentManager({
  documents,
}: {
  documents: Array<{
    id: number;
    filename: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
  }>;
}) {
  // Función para formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (documents.length === 0) {
    return (
      <div className="text-gray-500 italic">No hay documentos adjuntos.</div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
          <div>
            <p className="font-medium text-gray-800">{doc.filename}</p>
            <p className="text-sm text-gray-600">
              {doc.fileType} • {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={async () => {
  try {
    await downloadDocument(doc.id);
  } catch (error: any) {
    alert('Error al descargar: ' + (error.message || 'Desconocido'));
  }
}} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Descargando
          </button>
        </div>
      ))}
    </div>
  );
}
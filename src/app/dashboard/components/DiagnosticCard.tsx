
export default function DiagnosticCard({
  title,
  doctorName,
  date,
  diagnosis,
}: {
  title: string;
  doctorName: string;
  date: string;
  diagnosis: string;
}) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Dr. {doctorName} • {date}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          Diagnóstico
        </span>
      </div>
      <p className="mt-3 text-gray-700">{diagnosis}</p>
    </div>
  );
}
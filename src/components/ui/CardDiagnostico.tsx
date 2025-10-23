import React from 'react';

type CardDiagnosticoProps = {
  title: string;
  description: string;
  date: string;
};

const CardDiagnostico: React.FC<CardDiagnosticoProps> = ({ title, description, date }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      <p className="text-xs text-gray-500 mt-4">Fecha: {date}</p>
    </div>
  );
};

export default CardDiagnostico;
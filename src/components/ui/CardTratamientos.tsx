import React from 'react';

type CardTratamientosProps = {
  treatmentName: string;
  description: string;
  duration: string;
};

const CardTratamientos: React.FC<CardTratamientosProps> = ({ treatmentName, description, duration }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <h3 className="text-lg font-bold text-gray-800">{treatmentName}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      <p className="text-xs text-gray-500 mt-4">Duración: {duration}</p>
    </div>
  );
};

export default CardTratamientos;
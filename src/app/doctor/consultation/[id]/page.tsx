import React from 'react';
import ConsultationDetailClient from './ConsultationDetailClient';

// Server component: recibe params (sincrónico) y pasa `id` al componente cliente
export default function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const id = params?.id;
  return <ConsultationDetailClient id={id} />;
}

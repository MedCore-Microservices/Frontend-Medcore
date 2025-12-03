import React from 'react';
import ConsultationDetailClient from './ConsultationDetailClient';

// Server component: recibe params (asíncrono en Next.js 15)
export default async function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConsultationDetailClient id={id} />;
}

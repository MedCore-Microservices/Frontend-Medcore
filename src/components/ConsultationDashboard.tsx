import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import ConsultationCard from './ConsultationCard';

type Consultation = {
  id: string | number;
  patientName?: string;
  patientId?: number;
  date?: string;
  reason?: string;
  status?: string;
  doctorId?: number;
};

export default function ConsultationDashboard() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filtered, setFiltered] = useState<Consultation[]>([]);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchActive = useCallback(async () => {
    setLoading(true);
    try {
      // Intenta endpoint típico; tolerante a distintos backends
      const candidates = [
        '/api/appointments/active',
        '/api/appointments?status=ACTIVE',
        '/api/appointments?status=active',
      ];

      let res: Response | null = null;
      let data: any = null;

      for (const url of candidates) {
        try {
          res = await fetch(url, { credentials: 'include' });
          if (!res || res.status === 404) continue;
          data = await res.json();
          // asumir array directo o { data: [...] }
          if (Array.isArray(data)) break;
          if (data && Array.isArray(data.data)) {
            data = data.data;
            break;
          }
        } catch (e) {
          // ignore and try next
        }
      }

      const list = Array.isArray(data) ? data : [];
      // Map to Consultation minimal shape
      const mapped = list.map((it: any) => ({
        id: it.id || it._id || `${it.patientId || 'p'}-${it.date || ''}`,
        patientName: it.patient?.fullname || it.patientName || (it.user && it.user.fullname) || 'Paciente',
        patientId: it.patientId || it.userId || null,
        date: it.date || it.requestedAt || it.createdAt || null,
        reason: it.reason || it.clinicalNotes || '',
        status: it.status || 'ACTIVE',
        doctorId: it.doctorId || it.requestedBy || null,
      })) as Consultation[];

      setConsultations(mapped);
      setFiltered(mapped);
      setSelected(mapped.length > 0 ? mapped[0] : null);
    } catch (error) {
      console.error('fetchActive error', error);
      setConsultations([]);
      setFiltered([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  useEffect(() => {
    if (!query) {
      setFiltered(consultations);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      consultations.filter((c) => {
        return (
          String(c.patientName || '').toLowerCase().includes(q) ||
          String(c.reason || '').toLowerCase().includes(q) ||
          String(c.id || '').toLowerCase().includes(q)
        );
      })
    );
  }, [query, consultations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Consultas activas</CardTitle>
            </div>
            <div className="w-full mt-2">
              <Input
                placeholder="Buscar por paciente, motivo o id..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {loading && <div className="text-sm text-muted-foreground">Cargando...</div>}
              {!loading && filtered.length === 0 && (
                <div className="text-sm text-muted-foreground">No hay consultas activas.</div>
              )}

              {filtered.map((c) => (
                <ConsultationCard
                  key={String(c.id)}
                  consultation={c}
                  selected={Boolean(selected && String(selected.id) === String(c.id))}
                  onSelect={() => setSelected(c)}
                  onView={() => router.push(`/patients/${c.patientId}/records`)}
                  onCreateOrder={() => router.push(`/appointments/${c.id}/order`)}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-3">
              <button
                className="btn btn-primary"
                onClick={() => fetchActive()}
              >
                Refrescar
              </button>
              <button
                className="btn"
                onClick={() => {
                  setQuery('');
                }}
              >
                Limpiar
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Detalle de la consulta</CardTitle>
          </CardHeader>
          <CardContent>
            {!selected && <div className="text-sm text-muted-foreground">Selecciona una consulta para ver detalles.</div>}

            {selected && (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Paciente</div>
                  <div className="font-medium">{selected.patientName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Motivo</div>
                  <div className="font-medium">{selected.reason || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Fecha</div>
                  <div className="font-medium">{selected.date ? new Date(selected.date).toLocaleString() : '—'}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (!selected) return;
                      router.push(`/patients/${selected.patientId}/records`);
                    }}
                  >
                    Ver historia clínica
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      if (!selected) return;
                      router.push(`/appointments/${selected.id}/order`);
                    }}
                  >
                    Crear orden
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

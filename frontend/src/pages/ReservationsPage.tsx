import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Reservation } from '../api/types';
import { Icons } from '../components/Icons';

const statusLabels: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Pendiente', class: 'pill-pending' },
  CONFIRMED: { label: 'Confirmada', class: 'pill-confirmed' },
  CANCELLED: { label: 'Cancelada', class: 'pill-cancelled' },
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState<string>('ALL');

  const load = () => api.get('/reservations/me').then(res => setReservations(res.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      setToast(status === 'CONFIRMED' ? 'Reserva confirmada' : 'Reserva cancelada');
      load();
    } catch (err: any) {
      setToast(err.response?.data?.message || 'Error');
    }
    setTimeout(() => setToast(''), 3000);
  };

  const deleteReservation = async (id: number) => {
    if (!confirm('Eliminar esta reserva?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      setToast('Reserva eliminada');
      load();
    } catch (err: any) {
      setToast(err.response?.data?.message || 'Error');
    }
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = reservations.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <>
      <div className="page-header">
        <h1>Mis reservas</h1>
        <p>Gestiona tus reservaciones de espacios de coworking</p>
      </div>

      <div className="chips">
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(s => (
          <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'ALL' ? 'Todas' : statusLabels[s].label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          {Icons.inbox}
          <h3>No tienes reservas</h3>
          <p>Explora los espacios disponibles y haz tu primera reserva</p>
        </div>
      ) : (
        <div className="res-list">
          {filtered.map(res => (
            <div key={res.id} className="res-row">
              <div className="res-icon">{Icons.space}</div>
              <div className="res-info">
                <div className="res-name">{res.space?.name || `Espacio #${res.spaceId}`}</div>
                <div className="res-detail">{res.space?.location || ''}</div>
              </div>
              <div className="res-time">
                {new Date(res.startTime).toLocaleDateString('es-HN')} {new Date(res.startTime).toTimeString().slice(0, 5)} - {new Date(res.endTime).toTimeString().slice(0, 5)}
              </div>
              <span className={`pill ${statusLabels[res.status]?.class || ''}`}>
                {statusLabels[res.status]?.label || res.status}
              </span>
              <div className="res-actions">
                {res.status === 'PENDING' && (
                  <>
                    <button className="btn-sm confirm" onClick={() => updateStatus(res.id, 'CONFIRMED')}>
                      {Icons.check} Confirmar
                    </button>
                    <button className="btn-sm danger" onClick={() => updateStatus(res.id, 'CANCELLED')}>
                      {Icons.x} Cancelar
                    </button>
                  </>
                )}
                {res.status === 'CONFIRMED' && (
                  <button className="btn-sm danger" onClick={() => updateStatus(res.id, 'CANCELLED')}>
                    {Icons.x} Cancelar
                  </button>
                )}
                <button className="btn-sm danger" onClick={() => deleteReservation(res.id)}>
                  {Icons.trash}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Space, Reservation } from '../api/types';
import { Icons } from '../components/Icons';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

export default function SpaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get(`/spaces/${id}`).then(res => setSpace(res.data)).catch(() => navigate('/'));
    api.get('/reservations/me').then(res => setReservations(res.data)).catch(() => {});
  }, [id, navigate]);

  const takenSlots = new Set(
    reservations
      .filter(r => r.status !== 'CANCELLED' && r.startTime.startsWith(date))
      .map(r => new Date(r.startTime).toTimeString().slice(0, 5))
  );

  const handleReserve = async () => {
    if (!selectedSlot || !space) return;
    setLoading(true);
    try {
      const start = new Date(`${date}T${selectedSlot}:00`);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      await api.post('/reservations', {
        spaceId: space.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        reason: reason || undefined,
      });
      setToast('Reserva creada exitosamente');
      setSelectedSlot('');
      setReason('');
      const res = await api.get('/reservations/me');
      setReservations(res.data);
    } catch (err: any) {
      setToast(err.response?.data?.message || 'Error al crear reserva');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  if (!space) return null;

  return (
    <>
      <button className="back-link" onClick={() => navigate('/')}>
        {Icons.chevronLeft} Volver a explorar
      </button>

      <div className="detail-grid">
        <div>
          <div className="detail-hero">
            {space.imageUrl ? (
              <img src={space.imageUrl} alt={space.name} />
            ) : (
              <div className="detail-hero-placeholder">{Icons.space}</div>
            )}
          </div>
          <h1 className="detail-title">{space.name}</h1>
          <div className="detail-location">
            {Icons.mapPin}
            {space.location}
          </div>
          {space.description && <p className="detail-desc">{space.description}</p>}
          <div className="amenities">
            <span className="amenity-pill">{Icons.users2} {space.capacity} personas</span>
            <span className="amenity-pill">{Icons.monitor} {space.type}</span>
            {space.type === 'SALA' && <span className="amenity-pill">{Icons.wifi} WiFi</span>}
            {space.type === 'SALA' && <span className="amenity-pill">{Icons.coffee} Cafeteria</span>}
          </div>
        </div>

        <div className="booking-card">
          <div className="booking-price">L {space.price} <span>/ hora</span></div>

          <div className="booking-label">Fecha</div>
          <input
            type="date"
            className="booking-input"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <div className="booking-label">Horario disponible</div>
          <div className="time-slots">
            {timeSlots.map(slot => (
              <button
                key={slot}
                className={`slot ${selectedSlot === slot ? 'selected' : ''} ${takenSlots.has(slot) ? 'taken' : ''}`}
                onClick={() => !takenSlots.has(slot) && setSelectedSlot(slot)}
                disabled={takenSlots.has(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <div className="booking-label">Motivo (opcional)</div>
          <input
            className="booking-input"
            placeholder="Reunion de equipo, trabajo individual..."
            value={reason}
            onChange={e => setReason(e.target.value)}
          />

          <button className="btn-reserve" disabled={!selectedSlot || loading} onClick={handleReserve}>
            {loading ? 'Reservando...' : 'Reservar este horario'}
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

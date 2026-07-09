import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Space } from '../api/types';
import { Icons } from '../components/Icons';

interface SpaceForm {
  name: string;
  description: string;
  location: string;
  capacity: number;
  type: string;
  price: number;
  imageUrl: string;
}

const emptySpace: SpaceForm = { name: '', description: '', location: '', capacity: 1, type: 'SALA', price: 0, imageUrl: '' };

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<SpaceForm>(emptySpace);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const load = () => api.get('/spaces').then(res => setSpaces(res.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptySpace); setModal('create'); };
  const openEdit = (s: Space) => { setForm({ name: s.name, description: s.description || '', location: s.location, capacity: s.capacity, type: s.type, price: s.price, imageUrl: s.imageUrl || '' }); setEditId(s.id); setModal('edit'); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (modal === 'create') {
        await api.post('/spaces', { ...form, capacity: Number(form.capacity), price: Number(form.price), imageUrl: form.imageUrl || undefined });
        setToast('Espacio creado');
      } else if (modal === 'edit' && editId) {
        await api.patch(`/spaces/${editId}`, { ...form, capacity: Number(form.capacity), price: Number(form.price), imageUrl: form.imageUrl || undefined });
        setToast('Espacio actualizado');
      }
      setModal(null);
      load();
    } catch (err: any) {
      setToast(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar este espacio?')) return;
    try {
      await api.delete(`/spaces/${id}`);
      setToast('Espacio eliminado');
      load();
    } catch (err: any) {
      setToast(err.response?.data?.message || 'Error');
    }
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Gestionar espacios</h1>
          <p>Administra los espacios de coworking disponibles</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={openCreate}>
          {Icons.plus} Nuevo espacio
        </button>
      </div>

      <div className="card-grid">
        {spaces.map(space => (
          <div key={space.id} className="card">
            <div className="card-img">
              {space.imageUrl ? <img src={space.imageUrl} alt={space.name} /> : <div className="card-img-placeholder">{Icons.space}</div>}
              <span className="card-type">{space.type}</span>
            </div>
            <div className="card-body">
              <div className="card-title">{space.name}</div>
              <div className="card-location">{Icons.mapPin} {space.location}</div>
              <div className="card-meta">
                <div className="card-capacity">{Icons.users2} {space.capacity}</div>
                <div className="card-price">L {space.price}/h</div>
                <div className="res-actions">
                  <button className="btn-sm" onClick={() => openEdit(space)}>{Icons.edit}</button>
                  <button className="btn-sm danger" onClick={() => handleDelete(space.id)}>{Icons.trash}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? 'Nuevo espacio' : 'Editar espacio'}</h2>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Descripcion</label>
              <input className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Ubicacion</label>
              <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Capacidad</label>
                <input className="form-input" type="number" min={1} value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="SALA">Sala</option>
                  <option value="ESCRITORIO">Escritorio</option>
                  <option value="AUDITORIO">Auditorio</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Precio / hora (L)</label>
                <input className="form-input" type="number" min={0} value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">URL de imagen (opcional)</label>
              <input className="form-input" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { User } from '../api/types';
import { Icons } from '../components/Icons';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const load = () => api.get('/users').then(res => setUsers(res.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: '', email: '', password: '', role: 'USER' }); setModal('create'); };
  const openEdit = (u: User) => { setForm({ name: u.name, email: u.email, password: '', role: u.role }); setEditId(u.id); setModal('edit'); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (modal === 'create') {
        await api.post('/users', form);
        setToast('Usuario creado');
      } else if (modal === 'edit' && editId) {
        const data: Record<string, unknown> = { name: form.name, email: form.email, role: form.role };
        if (form.password) data.password = form.password;
        await api.patch(`/users/${editId}`, data);
        setToast('Usuario actualizado');
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
    if (!confirm('Eliminar este usuario?')) return;
    try {
      await api.delete(`/users/${id}`);
      setToast('Usuario eliminado');
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
          <h1>Gestionar usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={openCreate}>
          {Icons.plus} Nuevo usuario
        </button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ fontWeight: 600 }}>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`pill ${user.role === 'ADMIN' ? 'pill-confirmed' : 'pill-pending'}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <span className={`pill ${user.status ? 'pill-confirmed' : 'pill-cancelled'}`}>
                  {user.status ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button className="btn-sm" onClick={() => openEdit(user)}>{Icons.edit}</button>
                  <button className="btn-sm danger" onClick={() => handleDelete(user.id)}>{Icons.trash}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? 'Nuevo usuario' : 'Editar usuario'}</h2>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">{modal === 'edit' ? 'Nueva contrasena (dejar vacio para no cambiar)' : 'Contrasena'}</label>
              <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={modal === 'create'} minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Rol</label>
              <select className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
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

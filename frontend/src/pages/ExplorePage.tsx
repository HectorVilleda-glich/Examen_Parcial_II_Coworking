import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Space } from '../api/types';
import { Icons } from '../components/Icons';

const spaceTypes = ['TODOS', 'SALA', 'ESCRITORIO', 'AUDITORIO'] as const;

export default function ExplorePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filter, setFilter] = useState<string>('TODOS');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/spaces').then(res => setSpaces(res.data)).catch(() => {});
  }, []);

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = spaces.filter(s => {
    if (filter !== 'TODOS' && s.type !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="page-header">
        <h1>Explorar espacios</h1>
        <p>Encuentra el espacio perfecto para tu proxima jornada de trabajo</p>
      </div>

      <div className="chips">
        {spaceTypes.map(t => (
          <button key={t} className={`chip ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'TODOS' ? 'Todos' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <input
        className="form-input"
        placeholder="Buscar por nombre o ubicacion..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 360, marginBottom: 20 }}
      />

      {filtered.length === 0 ? (
        <div className="empty">
          {Icons.inbox}
          <h3>No se encontraron espacios</h3>
          <p>Intenta con otros filtros o terminos de busqueda</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map(space => (
            <div key={space.id} className="card" onClick={() => navigate(`/spaces/${space.id}`)}>
              <div className="card-img">
                {space.imageUrl ? (
                  <img src={space.imageUrl} alt={space.name} />
                ) : (
                  <div className="card-img-placeholder">{Icons.space}</div>
                )}
                <span className="card-type">{space.type}</span>
                <button className={`card-fav ${favorites.has(space.id) ? 'active' : ''}`} onClick={(e) => toggleFav(space.id, e)}>
                  {Icons.heart}
                </button>
              </div>
              <div className="card-body">
                <div className="card-title">{space.name}</div>
                <div className="card-location">
                  {Icons.mapPin}
                  {space.location}
                </div>
                <div className="card-meta">
                  <div className="card-capacity">
                    {Icons.users2}
                    {space.capacity} personas
                  </div>
                  <div className="card-price">L {space.price} / hora</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

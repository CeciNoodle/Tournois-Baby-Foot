import api from './api.js';

export const getTournois = (statut) => {
  const params = statut ? `?statut=${statut}` : '';
  return api.get(`/public/tournois${params}`).then(r => r.data);
};

export const createTournoi = (data) =>
  api.post('/admin/tournois', data).then(r => r.data);

export const updateTournoi = (id, data) =>
  api.put(`/admin/tournois/${id}`, data).then(r => r.data);

export const deleteTournoi = (id) =>
  api.delete(`/admin/tournois/${id}`).then(r => r.data);

export const changeStatut = (id, statut) =>
  api.patch(`/admin/tournois/${id}/statut`, { statut }).then(r => r.data);

export const checkExpired = () =>
  api.post('/admin/tournois/check-expired').then(r => r.data);

import api from './api.js';

export const getEquipesByTournoi = (tournoiId) =>
  api.get(`/admin/tournois/${tournoiId}/equipes`).then(r => r.data.equipes);

export const addEquipeAdmin = (tournoiId, data) =>
  api.post(`/admin/tournois/${tournoiId}/equipes`, data).then(r => r.data);

export const registerEquipe = (tournoiId, data) =>
  api.post(`/public/tournois/${tournoiId}/equipes`, data).then(r => r.data);

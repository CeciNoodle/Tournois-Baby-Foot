import api from './api.js';

export const getMatchesByTournoi = (tournoiId) =>
  api.get(`/public/tournois/${tournoiId}/matches`).then(r => r.data);

export const generateMatches = (tournoiId) =>
  api.post(`/admin/tournois/${tournoiId}/matches/generate`).then(r => r.data);

export const updateScore = (matchId, score_equipe1, score_equipe2) =>
  api.patch(`/admin/matches/${matchId}/score`, { score_equipe1, score_equipe2 }).then(r => r.data);

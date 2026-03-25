const Tournoi  = require('../models/tournoi-model');
const Match    = require('../models/match-model');
const AppError = require('../utils/AppError');

// GET /api/public/tournois?statut=ouvert|complet|termine
async function getTournois(req, res, next) {
  try {
    const { statut } = req.query;
    const allowed = ['ouvert', 'complet', 'termine'];

    if (statut && !allowed.includes(statut)) {
      throw new AppError(`Statut invalide. Valeurs acceptées : ${allowed.join(', ')}.`, 400);
    }

    const tournois = await Tournoi.findByStatut(statut || null);
    return res.json(tournois);
  } catch (err) {
    next(err);
  }
}

// GET /api/public/tournois/:id/matches
async function getTournoiMatches(req, res, next) {
  try {
    const tournoi = await Tournoi.findById(req.params.id);
    if (!tournoi) throw new AppError('Tournoi introuvable.', 404);

    if (!['complet', 'termine'].includes(tournoi.statut)) {
      throw new AppError('Les matchs ne sont visibles que pour les tournois complets ou terminés.', 403);
    }

    const matchs = await Match.findByTournoi(req.params.id);

    if (matchs.length === 0) {
      return res.json({
        tournoi,
        matchs: [],
        message: 'Les matchs ne sont pas encore planifiés.',
      });
    }

    const scoresInseres = matchs.some(
      (m) => m.score_equipe1 > 0 || m.score_equipe2 > 0
    );

    return res.json({
      tournoi,
      matchs,
      ...(!scoresInseres && { message: 'Les scores ne sont pas encore saisis.' }),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTournois, getTournoiMatches };

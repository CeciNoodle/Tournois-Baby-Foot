const Match    = require('../models/match-model');
const Equipe   = require('../models/equipe-model');
const Tournoi  = require('../models/tournoi-model');
const AppError = require('../utils/AppError');

// POST /api/admin/tournois/:id/matches/generate
async function generateMatches(req, res, next) {
  try {
    const tournoi = await Tournoi.findById(req.params.id);
    if (!tournoi) throw new AppError('Tournoi introuvable.', 404);

    if (tournoi.statut !== 'complet') {
      throw new AppError("La génération des matchs n'est possible que pour un tournoi complet.", 409);
    }

    const equipes = await Equipe.findByTournoi(req.params.id);
    if (equipes.length < 2) {
      throw new AppError("Le tournoi doit avoir au moins 2 équipes pour générer des matchs.", 409);
    }

    // Supprime les matchs existants avant de regénérer
    await Match.deleteByTournoi(req.params.id);

    const count = await Match.generateRoundRobin(req.params.id, equipes);

    return res.status(201).json({ message: `${count} match(s) généré(s).` });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/matches/:id/score
async function updateScore(req, res, next) {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) throw new AppError('Match introuvable.', 404);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateDebut = match.date_debut ? new Date(match.date_debut) : null;
    const dateFin   = match.date_fin   ? new Date(match.date_fin)   : null;

    if (dateDebut && today < dateDebut) {
      throw new AppError("Le tournoi n'a pas encore commencé. Impossible de saisir les scores.", 409);
    }
    if (dateFin && today > dateFin) {
      throw new AppError("Le tournoi est terminé. Impossible de modifier les scores.", 409);
    }

    const { score_equipe1, score_equipe2 } = req.body;
    await Match.updateScore(req.params.id, score_equipe1, score_equipe2);

    return res.json({ message: 'Score mis à jour.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateMatches, updateScore };

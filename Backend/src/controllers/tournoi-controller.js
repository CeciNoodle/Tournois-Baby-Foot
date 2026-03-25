const Tournoi  = require('../models/tournoi-model');
const AppError = require('../utils/AppError');

// POST /api/admin/tournois
async function createTournoi(req, res, next) {
  try {
    const { nom, description, date_debut, date_fin } = req.body;

    const id = await Tournoi.create({
      nom,
      description,
      date_debut,
      date_fin,
      utilisateur_id: req.user.id,
    });

    return res.status(201).json({ message: 'Tournoi créé.', id });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/tournois/:id
async function updateTournoi(req, res, next) {
  try {
    const tournoi = await Tournoi.findById(req.params.id);
    if (!tournoi) throw new AppError('Tournoi introuvable.', 404);

    if (['termine', 'annule'].includes(tournoi.statut)) {
      throw new AppError('Impossible de modifier un tournoi terminé ou annulé.', 409);
    }

    const { nom, description, date_debut, date_fin } = req.body;
    await Tournoi.update(req.params.id, { nom, description, date_debut, date_fin });

    return res.json({ message: 'Tournoi mis à jour.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/tournois/:id
async function deleteTournoi(req, res, next) {
  try {
    const tournoi = await Tournoi.findById(req.params.id);
    if (!tournoi) throw new AppError('Tournoi introuvable.', 404);

    if (!['en_cours','termine', 'annule'].includes(tournoi.statut)) {
      throw new AppError("Seuls les tournois terminés ou annulés peuvent être supprimés.", 409);
    }

    await Tournoi.delete(req.params.id);

    return res.json({ message: 'Tournoi supprimé.' });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/tournois/:id/statut
// Transitions autorisées : ouvert → complet | annule  /  complet → annule
async function updateStatut(req, res, next) {
  try {
    const tournoi = await Tournoi.findById(req.params.id);
    if (!tournoi) throw new AppError('Tournoi introuvable.', 404);

    const { statut } = req.body;

    const transitions = {
      ouvert:  ['complet', 'annule'],
      complet: ['annule'],
    };

    const allowed = transitions[tournoi.statut] || [];
    if (!allowed.includes(statut)) {
      throw new AppError(
        `Transition invalide : '${tournoi.statut}' → '${statut}'.`,
        409
      );
    }

    await Tournoi.updateStatut(req.params.id, statut);

    return res.json({ message: `Statut mis à jour : ${statut}.` });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/tournois/check-expired
// Passe à 'termine' tous les tournois dont date_fin est dépassée
async function checkExpired(req, res, next) {
  try {
    const count = await Tournoi.closeExpired();
    return res.json({ message: `${count} tournoi(s) passé(s) à 'terminé'.` });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTournoi, updateTournoi, deleteTournoi, updateStatut, checkExpired };

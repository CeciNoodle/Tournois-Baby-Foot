const Equipe   = require('../models/equipe-model');
const Tournoi  = require('../models/tournoi-model');
const AppError = require('../utils/AppError');

// POST /api/admin/tournois/:id/equipes
async function addEquipeAdmin(req, res, next) {
  try {
    const tournoi = await Tournoi.findById(req.params.id);
    if (!tournoi) throw new AppError('Tournoi introuvable.', 404);

    if (tournoi.statut !== 'ouvert') {
      throw new AppError("Les inscriptions sont fermées pour ce tournoi.", 409);
    }

    const { nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, email, telephone } = req.body;

    const id = await Equipe.create({
      nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2,
      email, telephone,
      tournoi_id: req.params.id,
    });

    return res.status(201).json({ message: 'Équipe ajoutée.', id });
  } catch (err) {
    next(err);
  }
}

// POST /api/public/tournois/:id/equipes
async function registerEquipe(req, res, next) {
  try {
    const tournoi = await Tournoi.findById(req.params.id);
    if (!tournoi) throw new AppError('Tournoi introuvable.', 404);

    if (tournoi.statut !== 'ouvert') {
      throw new AppError("Les inscriptions sont fermées pour ce tournoi.", 409);
    }

    const { nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, email, telephone } = req.body;

    const id = await Equipe.create({
      nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2,
      email, telephone,
      tournoi_id: req.params.id,
    });

    return res.status(201).json({ message: 'Inscription enregistrée.', id });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/tournois/:id/equipes
async function getEquipesByTournoi(req, res, next) {
  try {
    const tournoi = await Tournoi.findById(req.params.id);
    if (!tournoi) throw new AppError('Tournoi introuvable.', 404);

    const equipes = await Equipe.findByTournoi(req.params.id);
    return res.json({ equipes });
  } catch (err) {
    next(err);
  }
}

module.exports = { addEquipeAdmin, registerEquipe, getEquipesByTournoi };

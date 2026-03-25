const express  = require('express');
const router   = express.Router();
const validate = require('../middlewares/validate-middleware');

const { equipeRules }                      = require('../validators/equipe-validator');
const { getTournois, getTournoiMatches }   = require('../controllers/public-controller');
const { registerEquipe }                   = require('../controllers/equipe-controller');

// Tournois publics
router.get('/tournois',              getTournois);
router.get('/tournois/:id/matches',  getTournoiMatches);

// Inscription à un tournoi (utilisateur non inscrit)
router.post('/tournois/:id/equipes', equipeRules, validate, registerEquipe);

module.exports = router;

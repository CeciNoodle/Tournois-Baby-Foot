const express                  = require('express');
const router                   = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth-middleware');
const validate                 = require('../middlewares/validate-middleware');

const { createRules, updateRules, statutRules } = require('../validators/tournoi-validator');
const { equipeRules }                           = require('../validators/equipe-validator');
const { scoreRules }                            = require('../validators/match-validator');

const { createTournoi, updateTournoi, deleteTournoi, updateStatut, checkExpired } = require('../controllers/tournoi-controller');
const { addEquipeAdmin }                                                           = require('../controllers/equipe-controller');
const { generateMatches, updateScore }                                             = require('../controllers/match-controller');

router.use(verifyToken, isAdmin);

// Tournois
router.post('/tournois',                    createRules,  validate, createTournoi);
router.put('/tournois/:id',                 updateRules,  validate, updateTournoi);
router.delete('/tournois/:id',                                      deleteTournoi);
router.patch('/tournois/:id/statut',        statutRules,  validate, updateStatut);
router.post('/tournois/check-expired',                              checkExpired);

// Équipes (admin)
router.post('/tournois/:id/equipes',        equipeRules,  validate, addEquipeAdmin);

// Matchs
router.post('/tournois/:id/matches/generate',                       generateMatches);
router.patch('/matches/:id/score',          scoreRules,   validate, updateScore);

module.exports = router;

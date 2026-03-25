const { body } = require('express-validator');

const createRules = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom du tournoi est requis.')
    .isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères.'),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('date_debut')
    .optional({ nullable: true })
    .isDate().withMessage('Format de date invalide (YYYY-MM-DD).'),

  body('date_fin')
    .optional({ nullable: true })
    .isDate().withMessage('Format de date invalide (YYYY-MM-DD).')
    .custom((date_fin, { req }) => {
      if (req.body.date_debut && date_fin <= req.body.date_debut) {
        throw new Error('La date de fin doit être postérieure à la date de début.');
      }
      return true;
    }),
];

const updateRules = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom du tournoi est requis.')
    .isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères.'),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('date_debut')
    .optional({ nullable: true })
    .isDate().withMessage('Format de date invalide (YYYY-MM-DD).'),

  body('date_fin')
    .optional({ nullable: true })
    .isDate().withMessage('Format de date invalide (YYYY-MM-DD).')
    .custom((date_fin, { req }) => {
      if (req.body.date_debut && date_fin <= req.body.date_debut) {
        throw new Error('La date de fin doit être postérieure à la date de début.');
      }
      return true;
    }),
];

const statutRules = [
  body('statut')
    .notEmpty().withMessage('Le statut est requis.')
    .isIn(['complet', 'annule']).withMessage("Le statut doit être 'complet' ou 'annule'."),
];

module.exports = { createRules, updateRules, statutRules };

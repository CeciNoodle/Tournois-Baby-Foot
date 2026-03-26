const { body } = require('express-validator');

const equipeRules = [
  body('nom')
    .trim()
    .notEmpty().withMessage("Le nom de l'équipe est requis.")
    .isLength({ max: 255 }).withMessage("Le nom ne doit pas dépasser 255 caractères."),

  body('nom_joueur1')
    .trim()
    .notEmpty().withMessage('Le nom du joueur 1 est requis.'),

  body('prenom_joueur1')
    .trim()
    .notEmpty().withMessage('Le prénom du joueur 1 est requis.'),

  body('nom_joueur2')
    .trim()
    .notEmpty().withMessage('Le nom du joueur 2 est requis.'),

  body('prenom_joueur2')
    .trim()
    .notEmpty().withMessage('Le prénom du joueur 2 est requis.'),

  body('email')
    .trim()
    .notEmpty().withMessage("L'email est requis.")
    .isEmail().withMessage("Format d'email invalide."),

  body('telephone')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 }).withMessage('Le numéro de téléphone est trop long.'),
];

module.exports = { equipeRules };

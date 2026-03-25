const { body } = require('express-validator');

const scoreRules = [
  body('score_equipe1')
    .notEmpty().withMessage('Le score de l\'équipe 1 est requis.')
    .isInt({ min: 0 }).withMessage('Le score doit être un entier positif.'),

  body('score_equipe2')
    .notEmpty().withMessage('Le score de l\'équipe 2 est requis.')
    .isInt({ min: 0 }).withMessage('Le score doit être un entier positif.'),
];

module.exports = { scoreRules };

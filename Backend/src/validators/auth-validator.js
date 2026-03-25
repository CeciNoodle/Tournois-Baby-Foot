const { body } = require('express-validator');
 
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Format d\'email invalide.')
    .normalizeEmail(),
 
  body('password')
    .trim()
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 4 }).withMessage('Le mot de passe doit contenir au moins 4 caractères.'),
];
 
module.exports = { loginRules };
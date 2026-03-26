const bcrypt      = require('bcrypt');
const jwt         = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur-model');
const AppError    = require('../utils/AppError');

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const utilisateur = await Utilisateur.findByEmail(email);
    if (!utilisateur) throw new AppError('Identifiants incorrects.', 401);

    const passwordMatch = await bcrypt.compare(password, utilisateur.mot_de_passe);
    if (!passwordMatch) throw new AppError('Identifiants incorrects.', 401);

    const payload = {
      id:    utilisateur.id,
      email: utilisateur.email,
      role:  utilisateur.role,
    };

    const accessToken = generateAccessToken(payload);

    return res.json({ accessToken, user: payload });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
function logout(req, res) {
  return res.json({ message: 'Déconnexion réussie.' });
}

module.exports = { login, logout };
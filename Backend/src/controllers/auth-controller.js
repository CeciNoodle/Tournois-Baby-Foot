const bcrypt      = require('bcrypt');
const jwt         = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur-model');
const AppError    = require('../utils/AppError');

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
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

    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: utilisateur.id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken, user: payload });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/refresh
async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new AppError('Refresh token manquant.', 401);

    const decoded     = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const utilisateur = await Utilisateur.findById(decoded.id);
    if (!utilisateur) throw new AppError('Utilisateur introuvable.', 401);

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
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict' });
  return res.json({ message: 'Déconnexion réussie.' });
}

module.exports = { login, refresh, logout };
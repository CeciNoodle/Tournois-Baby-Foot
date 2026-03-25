const jwt      = require('jsonwebtoken');
const AppError = require('../utils/AppError');


function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token d\'accès manquant.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return next(new AppError('Token invalide ou expiré.', 401));
  }
}


function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Accès réservé aux administrateurs.', 403));
  }
  next();
}

module.exports = { verifyToken, isAdmin };
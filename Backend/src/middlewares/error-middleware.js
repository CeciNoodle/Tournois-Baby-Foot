function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(`[ERROR] ${err.name || 'Error'}: ${err.message}`);
  }
 

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token invalide ou expiré.' })
  }
 

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Cette adresse email est déjà utilisée.' })
  }
 

  if (err.name === 'AppError') {
    return res.status(err.status).json({ message: err.message })
  }
 

  return res.status(500).json({ message: 'Erreur interne du serveur.' })
}
 
module.exports = errorHandler;
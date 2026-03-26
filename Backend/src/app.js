require('dotenv').config();
 
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
 
const authRoutes   = require('./routes/auth-routes');
const adminRoutes  = require('./routes/admin-routes');
const publicRoutes = require('./routes/public-routes');
const errorHandler = require('./middlewares/error-middleware');
 
const app  = express();
const PORT = process.env.PORT || 3000;
 
//Middlewares globaux
app.use(cors({
  origin:      process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
 
//Routes
app.use('/api/auth',   authRoutes);
app.use('/api/admin',  adminRoutes);
app.use('/api/public', publicRoutes);
 

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable.' });
});
 
//Gestionnaire d'erreurs
app.use(errorHandler);
 
//Démarrage 
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
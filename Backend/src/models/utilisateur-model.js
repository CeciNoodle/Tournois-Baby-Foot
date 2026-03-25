const db = require('../config/db');
 
const Utilisateur = {
  async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM utilisateur WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },
 
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, email, role, created_at FROM utilisateur WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },
};
 
module.exports = Utilisateur;
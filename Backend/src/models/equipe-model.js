const db = require('../config/db');

const Equipe = {
  async create({ nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, email, telephone, tournoi_id }) {
    const [result] = await db.query(
      `INSERT INTO equipes (nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, email, telephone, tournoi_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, email || null, telephone || null, tournoi_id]
    );
    return result.insertId;
  },

  async findByTournoi(tournoi_id) {
    const [rows] = await db.query(
      'SELECT * FROM equipes WHERE tournoi_id = ?',
      [tournoi_id]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM equipes WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = Equipe;

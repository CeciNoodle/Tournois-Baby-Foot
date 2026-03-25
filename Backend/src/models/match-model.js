const db = require('../config/db');

const Match = {
  // Génère tous les matchs round-robin pour un tournoi (chaque équipe rencontre toutes les autres)
  async generateRoundRobin(tournoi_id, equipes) {
    const values = [];
    for (let i = 0; i < equipes.length; i++) {
      for (let j = i + 1; j < equipes.length; j++) {
        values.push([tournoi_id, equipes[i].id, equipes[j].id]);
      }
    }
    if (values.length === 0) return 0;

    const [result] = await db.query(
      'INSERT INTO matchs (tournoi_id, equipe1_id, equipe2_id) VALUES ?',
      [values]
    );
    return result.affectedRows;
  },

  async findByTournoi(tournoi_id) {
    const [rows] = await db.query(
      `SELECT
         m.id,
         m.score_equipe1,
         m.score_equipe2,
         e1.id   AS equipe1_id,
         e1.nom  AS equipe1_nom,
         e2.id   AS equipe2_id,
         e2.nom  AS equipe2_nom
       FROM matchs m
       JOIN equipes e1 ON e1.id = m.equipe1_id
       JOIN equipes e2 ON e2.id = m.equipe2_id
       WHERE m.tournoi_id = ?`,
      [tournoi_id]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT m.*, t.date_debut, t.date_fin
       FROM matchs m
       JOIN tournois t ON t.id = m.tournoi_id
       WHERE m.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async deleteByTournoi(tournoi_id) {
    await db.query('DELETE FROM matchs WHERE tournoi_id = ?', [tournoi_id]);
  },

  async updateScore(id, score_equipe1, score_equipe2) {
    const [result] = await db.query(
      'UPDATE matchs SET score_equipe1 = ?, score_equipe2 = ? WHERE id = ?',
      [score_equipe1, score_equipe2, id]
    );
    return result.affectedRows;
  },
};

module.exports = Match;

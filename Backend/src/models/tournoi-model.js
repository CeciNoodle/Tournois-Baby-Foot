const db = require('../config/db');

const Tournoi = {
  async create({ nom, description, date_debut, date_fin, utilisateur_id }) {
    const [result] = await db.query(
      `INSERT INTO tournois (nom, description, date_debut, date_fin, utilisateur_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nom, description || null, date_debut || null, date_fin || null, utilisateur_id]
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM tournois WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async update(id, { nom, description, date_debut, date_fin }) {
    const [result] = await db.query(
      `UPDATE tournois
       SET nom = ?, description = ?, date_debut = ?, date_fin = ?
       WHERE id = ?`,
      [nom, description || null, date_debut || null, date_fin || null, id]
    );
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await db.query(
      'DELETE FROM tournois WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },

  async updateStatut(id, statut) {
    const [result] = await db.query(
      'UPDATE tournois SET statut = ? WHERE id = ?',
      [statut, id]
    );
    return result.affectedRows;
  },

  // Retourne les tournois filtrés par statut (ou tous si statut = null)
  async findByStatut(statut) {
    if (statut) {
      const [rows] = await db.query(
        'SELECT * FROM tournois WHERE statut = ? ORDER BY date_debut DESC',
        [statut]
      );
      return rows;
    }
    const [rows] = await db.query(
      "SELECT * FROM tournois WHERE statut IN ('ouvert', 'complet', 'termine') ORDER BY date_debut DESC"
    );
    return rows;
  },

  // Passe à 'termine' tous les tournois dont date_fin est dépassée
  async closeExpired() {
    const [result] = await db.query(
      `UPDATE tournois
       SET statut = 'termine'
       WHERE statut = 'complet'
         AND date_fin IS NOT NULL
         AND date_fin < CURDATE()`
    );
    return result.affectedRows;
  },
};

module.exports = Tournoi;

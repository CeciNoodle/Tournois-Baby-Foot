-- Base de données
CREATE DATABASE IF NOT EXISTS babyfoot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE babyfoot_db;

-- =====================
-- TABLES
-- =====================

CREATE TABLE IF NOT EXISTS utilisateur (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe    VARCHAR(255) NOT NULL,
    role            ENUM('admin') NOT NULL DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS tournois (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom             VARCHAR(255) NOT NULL,
    description     TEXT,
    date_debut      DATE,
    date_fin        DATE,
    statut          ENUM('ouvert', 'complet', 'termine', 'annule') NOT NULL DEFAULT 'ouvert',
    utilisateur_id  INT UNSIGNED NOT NULL
);

-- Les joueurs n'ont pas besoin de s'inscrire sur le site :
-- leurs coordonnées sont enregistrées directement ici (joueur1 + joueur2)
CREATE TABLE IF NOT EXISTS equipes (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom             VARCHAR(255) NOT NULL,
    nom_joueur1     VARCHAR(100) NOT NULL,
    prenom_joueur1  VARCHAR(100) NOT NULL,
    nom_joueur2     VARCHAR(100) NOT NULL,
    prenom_joueur2  VARCHAR(100) NOT NULL,
    email           VARCHAR(255),
    telephone       VARCHAR(20),
    tournoi_id      INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS matchs (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tournoi_id      INT UNSIGNED NOT NULL,
    equipe1_id      INT UNSIGNED NOT NULL,
    equipe2_id      INT UNSIGNED NOT NULL,
    score_equipe1   INT UNSIGNED DEFAULT 0,
    score_equipe2   INT UNSIGNED DEFAULT 0
);

-- =====================
-- FOREIGN KEYS
-- =====================

ALTER TABLE tournois
    ADD CONSTRAINT fk_tournois_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE RESTRICT;

ALTER TABLE equipes
    ADD CONSTRAINT fk_equipes_tournoi FOREIGN KEY (tournoi_id) REFERENCES tournois(id) ON DELETE CASCADE;

ALTER TABLE matchs
    ADD CONSTRAINT fk_matchs_tournoi  FOREIGN KEY (tournoi_id)  REFERENCES tournois(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_matchs_equipe1  FOREIGN KEY (equipe1_id)  REFERENCES equipes(id)  ON DELETE RESTRICT,
    ADD CONSTRAINT fk_matchs_equipe2  FOREIGN KEY (equipe2_id)  REFERENCES equipes(id)  ON DELETE RESTRICT,
    ADD CONSTRAINT chk_equipes_differentes CHECK (equipe1_id <> equipe2_id);

-- =====================
-- DONNÉES INITIALES
-- =====================

-- Admin mot de passe: qwerty
INSERT INTO utilisateur (email, mot_de_passe, role) VALUES (
    'admin@example.com',
    '$2a$12$z.tLNkB34d3GqN0k5miGgO0caGOmOnWHs0MjQ.Pwf.USiEdNmXKZW',
    'admin'
);

USE babyfoot_db;
-- Données de test
-- id 1 : ouvert
-- id 2 : ouvert
-- id 3 : complet - 6 équipes One Piece (pas de matchs, à générer via le bouton)
-- id 4 : complet - 4 équipes Evangelion (pas de matchs, à générer via le bouton)
-- id 5 : terminé - 4 équipes → 6 matchs combinés (avec scores)

INSERT INTO tournois (nom, description, date_debut, date_fin, statut, utilisateur_id) VALUES
('Tournoi 1', 'Tournoi Akira', '2026-04-05', '2026-04-05', 'ouvert',  1),
('Tournoi 2', 'Tournoi Demon Slayer', '2026-04-10', '2026-04-11', 'ouvert',  1),
('Tournoi 3', 'Tournoi One Piece',     '2026-05-01', '2026-05-02', 'complet', 1),
('Tournoi 4', 'Tournoi Evangelion',    '2026-05-11', '2026-05-11', 'complet', 1),
('Tournoi 5', 'Tournoi JoJo',          '2026-01-10', '2026-02-11', 'termine', 1);

-- Tournoi 3 : One Piece (6 équipes)
INSERT INTO equipes (nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, email, tournoi_id) VALUES
('Straw Hat',    'Monkey D.', 'Luffy',   'Roronoa',    'Zoro',   'strawhat@test.com',    3),
('Alabasta',     'Nefertari', 'Vivi',    'Portgas D.', 'Ace',    'alabasta@test.com',    3),
('Baroque Works','Crocodile', 'Sir',     'Nico',       'Robin',  'baroque@test.com',     3),
('Water Seven',  'Franky',    'Cutty',   'Iceburg',    'Tom',    'waterseven@test.com',  3),
('Thriller Bark','Brook',     'Soul',    'Gecko',      'Moria',  'thriller@test.com',    3),
('Dressrosa',    'Trafalgar', 'Law',     'Donquixote',  'Doffy', 'dressrosa@test.com',   3);

-- Tournoi 4 : Evangelion (4 équipes)
INSERT INTO equipes (nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, email, tournoi_id) VALUES
('Eva Unit-01', 'Ikari',    'Shinji', 'Ayanami',    'Rei',    'eva01@test.com',  4),
('Eva Unit-02', 'Langley',  'Asuka',  'Nagisa',     'Kaworu',  'eva02@test.com',  4),
('NERV',        'Katsuragi','Misato', 'Akagi',      'Ritsuko', 'nerv@test.com',   4),
('SEELE',       'Ikari',    'Gendo',  'Fuyutsuki',  'Kozo',    'seele@test.com',  4);

-- Tournoi 5 : JoJo (4 équipes)
INSERT INTO equipes (nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, email, tournoi_id) VALUES
('Jojo',  'Joestar','Jonathan', 'Joestar','Joseph', 'jojo@test.com',  5),
('Jojo1', 'Kujo', 'Jotaro', 'Higashikata','Josuke', 'jojo1@test.com',  5),
('Jojo2', 'Cesar', 'Zeppeli', 'Kujo', 'Jolyne', 'jojo2@test.com',  5),
('Jojo3', 'Joestar', 'Johnny','Higashikata',  'Josuke', 'jojo3@test.com',  5);

-- Matchs uniquement pour le tournoi 5 (terminé, avec scores)
INSERT INTO matchs (tournoi_id, equipe1_id, equipe2_id, score_equipe1, score_equipe2) VALUES
(5, 11, 12, 10,  7),
(5, 11, 13,  5, 10),
(5, 11, 14,  8,  6),
(5, 12, 13, 10,  3),
(5, 12, 14,  7,  9),
(5, 13, 14,  6, 10);

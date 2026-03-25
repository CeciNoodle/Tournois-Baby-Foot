USE babyfoot_db;
-- Données de test
-- id 1 : ouvert
-- id 2 : ouvert
-- id 3 : complet - 2 équipes → 1 match (sans scores)
-- id 4 : complet 2 équipes → 1 match (sans scores)v
-- id 5 : terminé - 4 équipes → 6 matchs round-robin (avec scores)

INSERT INTO tournois (nom, description, date_debut, date_fin, statut, utilisateur_id) VALUES
('Tournoi 1', 'Tournoi Akira', '2026-04-05', '2026-04-20', 'ouvert',  1),
('Tournoi 2', 'Tournoi Demon Slayer', '2026-04-10', '2026-04-25', 'ouvert',  1),
('Tournoi 3', 'Tournoi One Piece',     '2026-05-01', '2026-05-15', 'complet', 1),
('Tournoi 4', 'Tournoi Evangelion',    '2026-05-10', '2026-05-25', 'complet', 1),
('Tournoi 5', 'Tournoi JoJo',          '2026-01-10', '2026-02-28', 'termine', 1);


INSERT INTO equipes (nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, tournoi_id) VALUES
('Straw Hat', 'Monkey D.', 'Luffy','Roronoa', 'Zoro',  3),
('Alabasta',  'Nefertari', 'Vivi', 'Portgas D.', 'Ace', 3);


INSERT INTO equipes (nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, tournoi_id) VALUES
('Eva01', 'Ikari','Shinji','Ayanami','Rei',    4),
('Eva02', 'Langley','Asuka','Nagisa','Kaworu', 4);


INSERT INTO equipes (nom, nom_joueur1, prenom_joueur1, nom_joueur2, prenom_joueur2, tournoi_id) VALUES
('Jojo',  'Joestar','Jonathan', 'Joestar','Joseph',  5),
('Jojo1', 'Kujo', 'Jotaro', 'Higashikata','Josuke',  5),
('Jojo2', 'Cesar', 'Zeppeli', 'Kujo', 'Jolyne',  5),
('Jojo3', 'Joestar', 'Johnny','Higashikata',  'Josuke',  5);


INSERT INTO matchs (tournoi_id, equipe1_id, equipe2_id) VALUES
(3, 1, 2);

INSERT INTO matchs (tournoi_id, equipe1_id, equipe2_id) VALUES
(4, 3, 4);



INSERT INTO matchs (tournoi_id, equipe1_id, equipe2_id, score_equipe1, score_equipe2) VALUES
(5, 5, 6, 10,  7),
(5, 5, 7,  5, 10),
(5, 5, 8,  8,  6),
(5, 6, 7, 10,  3),
(5, 6, 8,  7,  9),
(5, 7, 8,  6, 10);

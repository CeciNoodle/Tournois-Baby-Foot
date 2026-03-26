# Documentation technique — Tournois Baby-Foot

---

## Table des matières

1. [Base de données](#1-base-de-données)
2. [Qui peut faire quoi](#2-qui-peut-faire-quoi)
3. [API — Authentification](#3-api--authentification)
4. [API — Administration](#4-api--administration)
5. [API — Publique](#5-api--publique)
6. [Fonctionnalités notables](#6-fonctionnalités-notables)
7. [Contraintes métier](#7-contraintes-métier)
8. [Gestion des erreurs](#8-gestion-des-erreurs)
9. [Gestion des validations](#9-gestion-des-validations)

---

## 1. Base de données

### Schéma MCD de la base de données

![Schéma MCD de la base de données](MDC.jpg)

---

### Table `utilisateur`

Représente les administrateurs du site. Un utilisateur ordinaire n'a pas besoin de créer un compte pour participer à un tournoi.

---

### Table `tournois`

Un tournoi est créé par un administrateur. Un tournoi peut avoir 4 statuts : ouvert, complet, terminé, annulé.  
**Ouvert** : Un utilisateur peut s'inscrire.  
**Complet** : Un utilisateur ne peut pas s'inscrire, mais un administrateur authentifié peut générer des matchs.  
**Terminé** : La date_fin du tournoi a dépassé la date d'aujourd'hui.  
**Annulé** : Un administrateur peut annuler un tournoi si celui-ci a le statut ouvert ou complet.



### Table `equipes`

Une équipe appartient à un tournoi. Elle contient directement les coordonnées des deux joueurs — aucune inscription au site n'est requise.



### Table `matchs`

Un match oppose exactement deux équipes appartenant au même tournoi.

**Contrainte SQL :** `equipe1_id <> equipe2_id` — une équipe ne peut pas jouer contre elle-même.

---


## 2. Qui peut faire quoi

### Administrateur (authentifié)

| Action                                        | Condition                                |
|-----------------------------------------------|------------------------------------------|
| Créer un tournoi                              | Toujours                                 |
| Modifier un tournoi                           | Statut ≠ `termine` et ≠ `annule`         |
| Supprimer un tournoi                          | Statut = `termine` ou `annule`           |
| Passer le statut à `complet`                  | Statut actuel = `ouvert`                 |
| Passer le statut à `annule`                   | Statut actuel = `ouvert` ou `complet`    |
| Ajouter une équipe à un tournoi               | Statut = `ouvert`                        |
| Générer les matchs                            | Statut = `complet`, ≥ 2 équipes          |
| Saisir / modifier les scores                  |  date_debut< Aujourd'hui< date_fin       |
| Déclencher la clôture des tournois expirés    | Toujours                                 |

### Utilisateur non inscrit (public)

| Action                                              | Condition                               |
|-----------------------------------------------------|-----------------------------------------|
| Voir la liste des tournois (`ouvert`, `complet`, `termine`) | Toujours                      |
| Voir les matchs d'un tournoi                        | Statut = `complet` ou `termine`         |
| Voir les scores des matchs                          | Statut = `complet` ou `termine`         |
| S'inscrire à un tournoi (soumettre une équipe)      | Statut = `ouvert`                       |

---

## 3. API — Authentification

Base URL : `/api/auth`

| Méthode | Route      | Description                                                  |
|---------|------------|--------------------------------------------------------------|
| POST    | `/login`   | Connexion admin. Retourne un `accessToken` (JWT, durée 1 h). |
| POST    | `/logout`  | Déconnexion (côté client, supprime le token du localStorage). |

**Corps de `/login` :**
```json
{
  "email": "admin@example.com",
  "password": "qwertyqwerty"
}
```

**Réponse de `/login` :**
```json
{
  "accessToken": "<jwt>",
  "user": { "id": 1, "email": "admin@example.com", "role": "admin" }
}
```

Les routes protégées attendent l'`accessToken` dans le header :
```
Authorization: Bearer <accessToken>
```

---

## 4. API — Administration

Base URL : `/api/admin`
Toutes ces routes requièrent un `accessToken` valide avec `role = admin`.

---

### Tournois

| Méthode | Route                          | Description                              |
|---------|--------------------------------|------------------------------------------|
| POST    | `/tournois`                    | Créer un tournoi                         |
| PUT     | `/tournois/:id`                | Modifier un tournoi                      |
| DELETE  | `/tournois/:id`                | Supprimer un tournoi                     |
| PATCH   | `/tournois/:id/statut`         | Changer le statut d'un tournoi           |
| POST    | `/tournois/check-expired`      | Clôturer automatiquement les tournois dont `date_fin` est dépassée |

**Corps de `POST /tournois` et `PUT /tournois/:id` :**
```json
{
  "nom": "Tournoi 1",
  "description": "Tournoi annuel de baby-foot",
  "date_debut": "2026-04-01",
  "date_fin": "2026-04-30"
}
```

**Corps de `PATCH /tournois/:id/statut` :**
```json
{ "statut": "complet" }
```
Valeurs acceptées : `complet`, `annule`.

---

### Équipes

| Méthode | Route                        | Description                              |
|---------|------------------------------|------------------------------------------|
| POST    | `/tournois/:id/equipes`      | Ajouter une équipe à un tournoi          |

**Corps :**
```json
{
  "nom": "pseud equipe",
  "nom_joueur1": "tomassi",
  "prenom_joueur1": "cecilia",
  "nom_joueur2": "jon",
  "prenom_joueur2": "jon",
  "email": "contact@exemple.com",
  "telephone": "0600000000"
}
```

---

### Matchs

| Méthode | Route                                | Description                                      |
|---------|--------------------------------------|--------------------------------------------------|
| POST    | `/tournois/:id/matches/generate`     | Générer tous les matchs (round-robin)            |
| PATCH   | `/matches/:id/score`                 | Saisir ou modifier le score d'un match           |

**Corps de `PATCH /matches/:id/score` :**
```json
{
  "score_equipe1": 5,
  "score_equipe2": 3
}
```

---

## 5. API — Publique

Base URL : `/api/public`
Aucune authentification requise.

| Méthode | Route                        | Description                                                 |
|---------|------------------------------|-------------------------------------------------------------|
| GET     | `/tournois`                  | Liste des tournois (`ouvert`, `complet`, `termine`)         |
| GET     | `/tournois?statut=ouvert`    | Filtrer par statut                                          |
| GET     | `/tournois/:id/matches`      | Matchs et scores d'un tournoi (statut `complet` ou `termine`) |
| POST    | `/tournois/:id/equipes`      | S'inscrire à un tournoi (soumettre une équipe)              |

**Réponse de `GET /tournois/:id/matches` — matchs non encore générés :**
```json
{
  "tournoi": { ... },
  "matchs": [],
  "message": "Les matchs ne sont pas encore planifiés."
}
```

**Réponse — matchs générés, scores non encore saisis :**
```json
{
  "tournoi": { ... },
  "matchs": [
    {
      "id": 1,
      "equipe1_nom": "Evangelion 01",
      "equipe2_nom": "Straw Hat",
      "score_equipe1": 0,
      "score_equipe2": 0
    }
  ],
  "message": "Les scores ne sont pas encore saisis."
}
```

---

## 6. Fonctionnalités

### Génération automatique des matchs (round-robin)

Lorsque l'admin déclenche `POST /api/admin/tournois/:id/matches/generate`, l'algorithme crée un match entre chaque paire d'équipes, de façon à ce que **toutes les équipes se rencontrent au moins une fois**.

Pour N équipes, cela génère **N × (N−1) / 2** matchs.

Exemple avec 4 équipes (A, B, C, D) :
```
A vs B
A vs C
A vs D
B vs C
B vs D
C vs D
→ 6 matchs générés
```

Si des matchs existent déjà pour ce tournoi, ils sont **supprimés et régénérés**.

---

### Clôture automatique des tournois expirés

`POST /api/admin/tournois/check-expired` parcourt tous les tournois dont `date_fin < date du jour` et dont le statut n'est ni `termine` ni `annule`, et les passe automatiquement à `termine`.

Cette route est destinée à être appelée périodiquement (manuellement ou via un scheduler).

---

## 7. Contraintes métier

| # | Contrainte | Où elle est vérifiée |
|---|------------|----------------------|
| 1 | Un tournoi ne peut être modifié que s'il est `ouvert` ou `complet` | Controller `updateTournoi` |
| 2 | Un tournoi ne peut être supprimé que s'il est `termine` ou `annule` | Controller `deleteTournoi` |
| 3 | Les transitions de statut sont strictement définies : `ouvert → complet\|annule`, `complet → annule` | Controller `updateStatut` |
| 4 | Une équipe ne peut être ajoutée qu'à un tournoi `ouvert` | Controllers `addEquipeAdmin` et `registerEquipe` |
| 5 | La génération des matchs n'est possible que si le statut est `complet` | Controller `generateMatches` |
| 6 | La génération des matchs nécessite au minimum 2 équipes | Controller `generateMatches` |
| 7 | Un score ne peut être saisi que si la date du jour est dans l'intervalle [date_debut, date_fin] du tournoi | Controller `updateScore` |
| 8 | Les matchs et scores ne sont visibles publiquement que pour les tournois `complet` ou `termine` | Controller `getTournoiMatches` |
| 9 | Une équipe ne peut pas jouer contre elle-même | Contrainte SQL `CHECK (equipe1_id <> equipe2_id)` |
| 10 | Un admin ne peut pas être supprimé s'il possède des tournois | Clé étrangère `ON DELETE RESTRICT` |
| 11 | Une équipe ne peut pas être supprimée si elle a des matchs associés | Clé étrangère `ON DELETE RESTRICT` |
| 12 | L'inscription à un tournoi requiert obligatoirement les données des deux joueurs | Validation (express-validator) |

---

## 8. Gestion des erreurs

Toutes les erreurs transitent par un middleware centralisé (`error-middleware.js`). Les controllers n'envoient jamais de réponse d'erreur directement : ils passent l'erreur à `next(err)`.

### Classe `AppError`

Pour les erreurs métier prévisibles, on utilise une classe personnalisée.
Elle porte un `message` et un `status` HTTP.
                            |


## 9. Gestion des validations

Les validations sont effectuées avec `express-validator`, avant l'exécution des controllers, via un middleware dédié (`validate-middleware.js`).

### Fonctionnement

1. Des règles de validation sont définies dans des fichiers `validators/`.
2. Ces règles sont passées en tant que middleware dans la définition de la route.
3. Le middleware `validate` vérifie les erreurs : si des erreurs existent, il retourne immédiatement un `422` avec le détail des champs invalides. Le controller n'est jamais appelé.



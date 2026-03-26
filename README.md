# Tournois Baby-Foot

Application de gestion de tournois de baby-foot.

---

## Technologies utilisées

### Backend
- **Node.js** + **Express.js** — serveur REST
- **MySQL** — base de données relationnelle

### Frontend
- **Vue.js** — framework JavaScript
- **Tailwind CSS** — framework CSS utilitaire

### Infrastructure
- **Docker** + **Docker Compose** — containerisation

---

## Déploiement

### Prérequis

- [Docker](https://www.docker.com/) installé et démarré
- Fichier `Backend/.env` configuré (voir `Backend/.env.example`)

---

### Lancer l'application

Les **données de test** (`test-data.sql`) sont automatiquement chargées au démarrage.

```bash
docker compose up --build
```

---

### Arrêter et supprimer les conteneurs

Arrêter les conteneurs sans supprimer les données :
```bash
docker compose down
```

Supprimer les conteneurs et le volume de la base de données :
```bash
docker compose down -v
```

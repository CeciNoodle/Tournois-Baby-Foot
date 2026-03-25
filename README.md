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

### Développement — `docker-compose.dev.yml`

Monte le code source local dans le conteneur : toute modification du code est reflétée **en temps réel** sans reconstruire l'image.
La base de données n'a **pas de volume persistant** — les données sont perdues à l'arrêt des conteneurs.

```bash
docker compose -f docker-compose.dev.yml up --build
```

---

### Production — `docker-compose.yml`

La base de données dispose d'un **volume persistant** (`db_data`) : les données survivent à l'arrêt et au redémarrage des conteneurs.

```bash
docker compose up --build
```

---

### Arrêter et supprimer les conteneurs

Arrêter les conteneurs sans supprimer les données :
```bash
docker compose down
```

Supprimer les conteneurs **et le volume de la base de données** (toutes les données seront perdues) :
```bash
docker compose down -v
```

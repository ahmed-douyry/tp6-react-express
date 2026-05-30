# TP Express — Bonnes pratiques

API REST en **Node.js / Express** connectée à **MySQL**, organisée en couches pour séparer les responsabilités.

---

## Objectif du TP

Construire une API CRUD sur la ressource `users` en appliquant une architecture claire :

- **Routes** → définissent les URLs et les verbes HTTP
- **Controllers** → gèrent la requête HTTP et la réponse
- **Services** → contiennent la logique métier et les requêtes SQL
- **Config** → centralise la connexion à la base de données

---

## Structure du projet

```
expressbonpratique/
├── app.js                  # Point d'entrée, configuration Express
├── config/
│   └── db.js               # Pool de connexion MySQL
├── routes/
│   └── user.routes.js      # Définition des routes /users
├── controllers/
│   └── user.controller.js  # Traitement des requêtes HTTP
├── services/
│   └── user.service.js     # Logique métier + requêtes SQL
└── package.json
```

---

## Points clés à retenir

### 1. Séparation des responsabilités

Chaque couche a un rôle précis :

| Couche | Rôle | Exemple |
|--------|------|---------|
| `routes` | Associe une URL + méthode HTTP à une fonction | `GET /users` → `getUsers` |
| `controllers` | Lit `req`, appelle le service, renvoie `res` | `res.json(users)` |
| `services` | Parle à la base de données, retourne des données | `SELECT * FROM users` |
| `config` | Configuration réutilisable (connexion DB) | Pool MySQL |

> Le controller ne contient **pas** de SQL. Le service ne connaît **pas** Express (`req` / `res`).

### 2. Express — les bases

```js
app.use(express.json());        // Parse le body JSON des requêtes POST/PUT
app.use('/api', userRoutes);     // Préfixe commun pour toutes les routes users
app.listen(4000);                // Serveur sur le port 4000
```

- `express.json()` est indispensable pour lire `{ "name": "...", "email": "..." }` dans le body.
- `app.use('/api', ...)` regroupe les routes sous `/api/users`, `/api/users/:id`, etc.

### 3. Router Express

```js
const router = express.Router();
router.get('/users', userController.getUsers);
module.exports = router;
```

Le router isole les routes d'une ressource. On l'importe dans `app.js` avec un préfixe (`/api`).

### 4. API REST — les 5 opérations CRUD

| Méthode | Route | Action | Code réponse |
|---------|-------|--------|--------------|
| `GET` | `/api/users` | Lister tous les users | `200` |
| `GET` | `/api/users/:id` | Récupérer un user par ID | `200` / `404` |
| `POST` | `/api/users` | Créer un user | `201` |
| `PUT` | `/api/users/:id` | Modifier un user | `200` / `404` |
| `DELETE` | `/api/users/:id` | Supprimer un user | `204` / `404` |

- `:id` est un **paramètre dynamique**, accessible via `req.params.id`.
- `404` est renvoyé quand l'utilisateur n'existe pas.
- `204 No Content` est la réponse standard après une suppression réussie.

### 5. Connexion MySQL avec `mysql2/promise`

```js
const db = mysql.createPool({ host, user, password, database });
```

- **Pool** : réutilise les connexions au lieu d'en ouvrir une nouvelle à chaque requête (meilleures performances).
- **`/promise`** : permet d'utiliser `async/await` au lieu des callbacks.

```js
const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
```

- Les `?` sont des **requêtes préparées** : protection contre les injections SQL.
- `db.query()` retourne un tableau `[rows, fields]` → on destructure avec `[rows]`.

### 6. Async / Await

Toutes les fonctions qui touchent la base sont `async`. On attend le résultat avec `await` :

```js
async function getUsers(req, res) {
    const users = await userService.getAllUsers();
    res.json(users);
}
```

Sans `async/await`, Express ne capturerait pas les erreurs asynchrones correctement.

---

## Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- [XAMPP](https://www.apachefriends.org/) ou MySQL local

### Base de données

Créer la base et la table dans phpMyAdmin ou en SQL :

```sql
CREATE DATABASE projetexpress;

USE projetexpress;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL
);
```

---

## Installation et démarrage

```bash
# Installer les dépendances
npm install

# Lancer en mode développement (rechargement auto avec nodemon)
npm run dev

# Lancer en mode production
npm start
```

Le serveur démarre sur **http://localhost:4000**.

> Utiliser `npm run dev` plutôt que `nodemon app.js` directement : nodemon est installé localement dans le projet.

---

## Tester l'API

### Avec curl

```bash
# Lister tous les utilisateurs
curl http://localhost:4000/api/users

# Récupérer un utilisateur
curl http://localhost:4000/api/users/1

# Créer un utilisateur
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@mail.com"}'

# Modifier un utilisateur
curl -X PUT http://localhost:4000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Martin","email":"alice.martin@mail.com"}'

# Supprimer un utilisateur
curl -X DELETE http://localhost:4000/api/users/1
```

### Avec Postman / Insomnia

Importer les mêmes routes en sélectionnant la bonne méthode HTTP et en ajoutant un body JSON pour `POST` et `PUT`.

---

## Flux d'une requête (exemple : GET /api/users/1)

```
Client
  │
  ▼
app.js          → app.use('/api', userRoutes)
  │
  ▼
user.routes.js  → router.get('/users/:id', getUserById)
  │
  ▼
user.controller → lit req.params.id, appelle le service
  │
  ▼
user.service    → SELECT * FROM users WHERE id = ?
  │
  ▼
config/db.js    → pool MySQL
  │
  ▼
Réponse JSON ← res.json(user) ou res.status(404).json(...)
```

---

## Dépendances

| Package | Rôle |
|---------|------|
| `express` | Framework web, gestion des routes et requêtes HTTP |
| `mysql2` | Driver MySQL avec support des promesses |
| `nodemon` | Redémarre le serveur automatiquement en dev |

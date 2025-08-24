# API Routes Documentation - User Management

Ce document décrit toutes les routes API disponibles pour la gestion des utilisateurs dans le système Car Unloading Management.

## 🔐 Authentification

Toutes les routes de gestion des utilisateurs nécessitent une authentification via Laravel Sanctum. Incluez le token Bearer dans l'en-tête de vos requêtes :

```
Authorization: Bearer {your_token}
```

## 📋 Routes Disponibles

### Base URL

```
/api/users
```

---

## 🔍 Recherche et Liste des Utilisateurs

### `GET /api/users`

**Description :** Récupère une liste paginée d'utilisateurs avec possibilité de filtrage.

**Paramètres de requête (optionnels) :**

-   `matriculation_prefix` : Préfixe du numéro de matriculation
-   `role_id` : ID du rôle pour filtrer
-   `email_verified` : Statut de vérification email (true/false)
-   `is_active` : Statut actif (true/false)
-   `search_term` : Terme de recherche dans nom, email, matriculation
-   `page` : Numéro de page (défaut: 1)
-   `per_page` : Éléments par page (défaut: 15, max: 100)

**Exemple de requête :**

```bash
GET /api/users?search_term=john&role_id=1&page=1&per_page=10
```

**Réponse :**

```json
{
    "data": [
        {
            "id": 1,
            "matriculation_no": "USER001",
            "full_name": "John Doe",
            "email": "john@example.com",
            "role": "User",
            "email_verified_at": "2024-01-15T10:00:00Z"
        }
    ],
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "path": "/api/users",
        "per_page": 10,
        "to": 1,
        "total": 1
    }
}
```

---

## ➕ Création d'Utilisateur

### `POST /api/users`

**Description :** Crée un nouvel utilisateur dans le système.

**Corps de la requête :**

```json
{
    "matriculation_no": "USER002",
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "+1234567890",
    "role_id": 1
}
```

**Validation :**

-   `matriculation_no` : Requis, unique, format alphanumérique
-   `full_name` : Requis, max 50 caractères
-   `email` : Requis, email valide, unique
-   `password` : Requis, min 8 caractères, confirmé
-   `phone` : Optionnel, max 20 caractères
-   `role_id` : Requis, doit exister dans la table roles

**Réponse (201) :**

```json
{
    "message": "User created successfully.",
    "data": {
        "id": 2,
        "matriculation_no": "USER002",
        "full_name": "Jane Smith",
        "email": "jane@example.com",
        "role": "User"
    }
}
```

---

## 👤 Récupération d'Utilisateur par ID

### `GET /api/users/{userId}`

**Description :** Récupère les détails d'un utilisateur par son ID.

**Paramètres :**

-   `userId` : ID numérique de l'utilisateur

**Exemple :**

```bash
GET /api/users/1
```

**Réponse :**

```json
{
    "data": {
        "id": 1,
        "matriculation_no": "USER001",
        "full_name": "John Doe",
        "email": "john@example.com",
        "role": "User",
        "avatar": null,
        "phone": "+1234567890",
        "email_verified_at": "2024-01-15T10:00:00Z",
        "created_at": "2024-01-15T10:00:00Z"
    }
}
```

---

## 🔢 Récupération d'Utilisateur par Matriculation

### `GET /api/users/matriculation/{matriculationNumber}`

**Description :** Récupère les détails d'un utilisateur par son numéro de matriculation.

**Paramètres :**

-   `matriculationNumber` : Numéro de matriculation (ex: USER001)

**Exemple :**

```bash
GET /api/users/matriculation/USER001
```

**Réponse :** Même format que la récupération par ID.

---

## ✏️ Mise à Jour du Profil Utilisateur

### `PUT /api/users/{userId}`

**Description :** Met à jour le profil d'un utilisateur existant.

**Paramètres :**

-   `userId` : ID numérique de l'utilisateur

**Corps de la requête :**

```json
{
    "full_name": "John Doe Updated",
    "phone": "+0987654321",
    "avatar": "/avatars/john.jpg"
}
```

**Validation :**

-   `full_name` : Optionnel, max 50 caractères
-   `phone` : Optionnel, max 20 caractères, format validé
-   `avatar` : Optionnel, max 255 caractères

**Réponse (200) :**

```json
{
    "message": "User updated successfully.",
    "data": {
        "id": 1,
        "matriculation_no": "USER001",
        "full_name": "John Doe Updated",
        "phone": "+0987654321",
        "avatar": "/avatars/john.jpg"
    }
}
```

---

## 🗑️ Suppression d'Utilisateur

### `DELETE /api/users/{userId}`

**Description :** Supprime un utilisateur du système.

**Paramètres :**

-   `userId` : ID numérique de l'utilisateur

**Exemple :**

```bash
DELETE /api/users/1
```

**Réponse (200) :**

```json
{
    "message": "User deleted successfully."
}
```

---

## 📝 Codes de Statut HTTP

-   **200** : Succès (GET, PUT, DELETE)
-   **201** : Créé avec succès (POST)
-   **400** : Erreur de validation ou logique métier
-   **401** : Non authentifié
-   **404** : Utilisateur non trouvé
-   **422** : Erreur de validation des données

---

## 🚨 Gestion des Erreurs

Toutes les routes retournent des erreurs au format JSON :

```json
{
    "error": "Message d'erreur descriptif"
}
```

**Exemples d'erreurs courantes :**

-   `User not found.` : L'utilisateur n'existe pas
-   `Matriculation number is already taken.` : Numéro de matriculation déjà utilisé
-   `Email is already taken.` : Email déjà utilisé
-   `Role does not exist.` : Le rôle spécifié n'existe pas

---

## 🔒 Sécurité

-   **Authentification requise** : Toutes les routes nécessitent un token valide
-   **Validation des données** : Toutes les entrées sont validées et sanitizées
-   **Gestion des permissions** : Les utilisateurs ne peuvent modifier que leur propre profil (à implémenter selon vos besoins)
-   **Rate limiting** : Considérez l'ajout de rate limiting pour les routes sensibles

---

## 🧪 Test des Routes

Vous pouvez tester ces routes avec des outils comme :

-   **Postman**
-   **Insomnia**
-   **cURL**
-   **Laravel Tinker**

**Exemple cURL :**

```bash
# Récupérer la liste des utilisateurs
curl -X GET "http://localhost:8000/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Créer un utilisateur
curl -X POST "http://localhost:8000/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "matriculation_no": "TEST001",
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role_id": 1
  }'
```

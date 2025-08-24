# UserController - Fichiers Créés

Ce document décrit tous les fichiers créés pour résoudre les erreurs de linter dans le `UserController.php`.

## Fichiers de Request (Validation)

### 1. SearchUsersRequest

**Chemin :** `app/Presentation/Http/Requests/SearchUsersRequest.php`

**Description :** Valide les paramètres de recherche d'utilisateurs avec pagination et filtres.

**Champs validés :**

-   `matriculation_prefix` : Préfixe du numéro de matriculation (optionnel)
-   `role_id` : ID du rôle (optionnel, doit exister dans la table roles)
-   `email_verified` : Statut de vérification email (optionnel, booléen)
-   `is_active` : Statut actif (optionnel, booléen)
-   `search_term` : Terme de recherche (optionnel, max 100 caractères)
-   `page` : Numéro de page (optionnel, min 1)
-   `per_page` : Nombre d'éléments par page (optionnel, min 1, max 100)

### 2. UpdateUserRequest

**Chemin :** `app/Presentation/Http/Requests/UpdateUserRequest.php`

**Description :** Valide les données de mise à jour du profil utilisateur.

**Champs validés :**

-   `full_name` : Nom complet (optionnel, max 50 caractères)
-   `avatar` : Chemin de l'avatar (optionnel, max 255 caractères)
-   `phone` : Numéro de téléphone (optionnel, max 20 caractères, format validé)

## Fichiers UseCase

### 3. SearchUsersUseCase

**Chemin :** `app/Application/User/UseCases/SearchUsersUseCase.php`

**Description :** Gère la recherche d'utilisateurs avec filtres et pagination.

**Fonctionnalités :**

-   Filtrage par préfixe de matriculation
-   Filtrage par rôle
-   Filtrage par statut de vérification email
-   Filtrage par statut actif
-   Recherche par terme (nom, email, matriculation)
-   Pagination des résultats

**Retour :** Tableau avec données paginées et métadonnées de pagination

### 4. GetUserUseCase

**Chemin :** `app/Application/User/UseCases/GetUserUseCase.php`

**Description :** Récupère un utilisateur par son ID.

**Fonctionnalités :**

-   Recherche d'utilisateur par ID
-   Gestion d'erreur si l'utilisateur n'existe pas

**Retour :** Entité User ou exception si non trouvé

### 5. DeleteUserUseCase

**Chemin :** `app/Application/User/UseCases/DeleteUserUseCase.php`

**Description :** Supprime un utilisateur du système.

**Fonctionnalités :**

-   Vérification de l'existence de l'utilisateur
-   Suppression de l'utilisateur
-   Gestion d'erreur si l'utilisateur n'existe pas

**Retour :** Booléen indiquant le succès de la suppression

## Modifications du UserController

Le `UserController.php` a été mis à jour pour :

1. **Importer les nouvelles classes :**

    - `SearchUsersRequest`
    - `UpdateUserRequest`
    - `SearchUsersUseCase`
    - `GetUserUseCase`
    - `DeleteUserUseCase`

2. **Ajouter les nouvelles propriétés dans le constructeur :**
    - `$searchUsersUseCase`
    - `$getUserUseCase`
    - `$deleteUserUseCase`

## Architecture

Ces fichiers suivent l'architecture hexagonale (Clean Architecture) :

-   **Requests** : Couche de présentation pour la validation des données
-   **UseCases** : Couche d'application pour la logique métier
-   **DTOs** : Transfert de données entre les couches
-   **Repositories** : Interface avec la couche d'infrastructure

## Utilisation

### Recherche d'utilisateurs

```php
GET /api/users?search_term=john&role_id=1&page=1&per_page=10
```

### Mise à jour d'utilisateur

```php
PUT /api/users/{id}
{
    "full_name": "John Doe Updated",
    "phone": "+1234567890"
}
```

### Suppression d'utilisateur

```php
DELETE /api/users/{id}
```

## Tests

Les fichiers sont prêts pour l'écriture de tests unitaires et d'intégration. Chaque UseCase peut être testé indépendamment en mockant les dépendances.

## Sécurité

-   Toutes les requests valident les données d'entrée
-   Les UseCases vérifient l'existence des entités avant manipulation
-   Gestion appropriée des erreurs avec messages d'erreur clairs

# Documentation des Tests - APIs Utilisateur

Ce document décrit tous les tests créés pour valider le bon fonctionnement des APIs de gestion des utilisateurs.

## 📋 Vue d'ensemble des Tests

### Tests Feature (Intégration)

-   **UserControllerTest** : Tests complets de toutes les APIs avec base de données réelle

### Tests Unitaires

-   **CreateUserUseCaseTest** : Logique de création d'utilisateur
-   **GetUserUseCaseTest** : Logique de récupération d'utilisateur
-   **DeleteUserUseCaseTest** : Logique de suppression d'utilisateur
-   **UpdateUserProfileUseCaseTest** : Logique de mise à jour de profil
-   **UserDTOsTest** : Validation des objets de transfert de données

## 🧪 Tests Feature (Intégration)

### UserControllerTest

**Fichier :** `tests/Feature/UserControllerTest.php`

Ce test couvre toutes les APIs du `UserController` avec une base de données réelle et l'authentification Sanctum.

#### Configuration

-   Utilise `RefreshDatabase` pour une base de données propre à chaque test
-   Crée un rôle et un utilisateur de test avant chaque test
-   Authentifie l'utilisateur avec Sanctum

#### Endpoints Testés

##### 1. GET /api/users - Liste des Utilisateurs

-   ✅ Retourne une liste paginée avec métadonnées
-   ✅ Filtre par terme de recherche
-   ✅ Filtre par rôle
-   ✅ Filtre par préfixe de matriculation
-   ✅ Gère la pagination correctement

##### 2. POST /api/users - Création d'Utilisateur

-   ✅ Crée un nouvel utilisateur avec succès
-   ✅ Valide les champs requis
-   ✅ Valide l'unicité du numéro de matriculation
-   ✅ Valide l'unicité de l'email
-   ✅ Valide la confirmation du mot de passe
-   ✅ Valide l'existence du rôle

##### 3. GET /api/users/{userId} - Affichage d'Utilisateur

-   ✅ Retourne les détails d'un utilisateur par ID
-   ✅ Retourne 404 pour un utilisateur inexistant

##### 4. GET /api/users/matriculation/{matriculationNumber}

-   ✅ Retourne les détails d'un utilisateur par matriculation
-   ✅ Retourne 404 pour une matriculation inexistante

##### 5. PUT /api/users/{userId} - Mise à Jour

-   ✅ Met à jour le profil avec succès
-   ✅ Met à jour seulement les champs fournis
-   ✅ Valide le format du numéro de téléphone
-   ✅ Retourne 404 pour un utilisateur inexistant

##### 6. DELETE /api/users/{userId} - Suppression

-   ✅ Supprime un utilisateur avec succès
-   ✅ Retourne 404 pour un utilisateur inexistant

##### 7. Authentification et Autorisation

-   ✅ Vérifie que l'authentification est requise pour tous les endpoints

## 🔬 Tests Unitaires

### CreateUserUseCaseTest

**Fichier :** `tests/Unit/CreateUserUseCaseTest.php`

Teste la logique métier de création d'utilisateur en isolant les dépendances.

#### Scénarios Testés

-   ✅ Création réussie d'un utilisateur
-   ✅ Gestion d'erreur pour un rôle invalide
-   ✅ Gestion d'erreur pour un email déjà existant

#### Mocks Utilisés

-   `UserRepositoryInterface` : Pour les opérations de base de données
-   `RoleRepositoryInterface` : Pour la validation du rôle

### GetUserUseCaseTest

**Fichier :** `tests/Unit/GetUserUseCaseTest.php`

Teste la logique de récupération d'utilisateur par ID.

#### Scénarios Testés

-   ✅ Récupération réussie d'un utilisateur existant
-   ✅ Gestion d'erreur pour un utilisateur inexistant

### DeleteUserUseCaseTest

**Fichier :** `tests/Unit/DeleteUserUseCaseTest.php`

Teste la logique de suppression d'utilisateur.

#### Scénarios Testés

-   ✅ Suppression réussie d'un utilisateur existant
-   ✅ Gestion d'erreur pour un utilisateur inexistant

### UpdateUserProfileUseCaseTest

**Fichier :** `tests/Unit/UpdateUserProfileUseCaseTest.php`

Teste la logique de mise à jour de profil utilisateur.

#### Scénarios Testés

-   ✅ Mise à jour réussie du profil
-   ✅ Gestion d'erreur pour un utilisateur inexistant
-   ✅ Mise à jour partielle (seulement les champs fournis)

### UserDTOsTest

**Fichier :** `tests/Unit/UserDTOsTest.php`

Teste la validation et le comportement des objets de transfert de données.

#### DTOs Testés

##### CreateUserDTO

-   ✅ Création avec valeurs correctes
-   ✅ Création à partir d'un tableau
-   ✅ Gestion des champs optionnels manquants
-   ✅ Conversion vers tableau
-   ✅ Création des value objects
-   ✅ Gestion des valeurs nulles

##### UpdateUsersProfileDTO

-   ✅ Création avec valeurs correctes
-   ✅ Création à partir d'un tableau
-   ✅ Gestion des champs optionnels manquants
-   ✅ Création du value object téléphone
-   ✅ Gestion des valeurs nulles

##### UserSearchCriteriaDTO

-   ✅ Valeurs par défaut
-   ✅ Création avec valeurs personnalisées
-   ✅ Création à partir d'un tableau
-   ✅ Gestion des champs optionnels manquants
-   ✅ Cast des valeurs numériques
-   ✅ Cast des valeurs booléennes

## 🚀 Exécution des Tests

### Exécuter tous les tests

```bash
php artisan test
```

### Exécuter les tests Feature uniquement

```bash
php artisan test --testsuite=Feature
```

### Exécuter les tests Unit uniquement

```bash
php artisan test --testsuite=Unit
```

### Exécuter un test spécifique

```bash
php artisan test tests/Feature/UserControllerTest.php
php artisan test tests/Unit/CreateUserUseCaseTest.php
```

### Exécuter avec couverture de code

```bash
php artisan test --coverage
```

## 📊 Couverture des Tests

### APIs Testées

-   ✅ **GET /api/users** - Liste avec filtres et pagination
-   ✅ **POST /api/users** - Création avec validation
-   ✅ **GET /api/users/{id}** - Récupération par ID
-   ✅ **GET /api/users/matriculation/{matriculation}** - Récupération par matriculation
-   ✅ **PUT /api/users/{id}** - Mise à jour de profil
-   ✅ **DELETE /api/users/{id}** - Suppression

### UseCases Testés

-   ✅ **CreateUserUseCase** - Logique de création
-   ✅ **GetUserUseCase** - Logique de récupération
-   ✅ **DeleteUserUseCase** - Logique de suppression
-   ✅ **UpdateUserProfileUseCase** - Logique de mise à jour
-   ✅ **SearchUsersUseCase** - Logique de recherche (via tests Feature)

### DTOs Testés

-   ✅ **CreateUserDTO** - Validation et conversion
-   ✅ **UpdateUsersProfileDTO** - Validation et conversion
-   ✅ **UserSearchCriteriaDTO** - Validation et conversion

### Validation Testée

-   ✅ **Champs requis** - Tous les champs obligatoires
-   ✅ **Unicité** - Email et matriculation uniques
-   ✅ **Format** - Validation des formats (téléphone, etc.)
-   ✅ **Relations** - Vérification de l'existence des rôles
-   ✅ **Authentification** - Protection de tous les endpoints

## 🔧 Configuration des Tests

### Base de données de test

-   Utilise `RefreshDatabase` pour une base propre à chaque test
-   Crée des données de test via les factories Laravel
-   Isole chaque test des autres

### Authentification

-   Utilise Laravel Sanctum pour l'authentification
-   Crée un utilisateur de test authentifié avant chaque test
-   Teste la protection des endpoints

### Mocks et Stubs

-   Utilise Mockery pour les tests unitaires
-   Isole les UseCases de leurs dépendances
-   Permet de tester la logique métier en isolation

## 📝 Bonnes Pratiques Appliquées

### Tests Feature

-   Teste l'API complète avec base de données réelle
-   Vérifie les réponses HTTP et codes de statut
-   Valide la structure des réponses JSON
-   Teste l'authentification et l'autorisation

### Tests Unitaires

-   Teste la logique métier en isolation
-   Utilise des mocks pour les dépendances
-   Couvre les cas d'erreur et d'exception
-   Teste les transformations de données

### Organisation

-   Tests organisés par fonctionnalité
-   Noms de tests descriptifs et clairs
-   Structure AAA (Arrange, Act, Assert)
-   Documentation complète des scénarios

## 🎯 Prochaines Étapes

### Tests à Ajouter

-   **Tests de performance** pour la pagination avec de gros volumes
-   **Tests de sécurité** pour les injections SQL et XSS
-   **Tests de rate limiting** si implémenté
-   **Tests d'intégration** avec d'autres services

### Améliorations

-   **Factories personnalisées** pour des scénarios de test spécifiques
-   **Data providers** pour tester différents cas de validation
-   **Tests de mutation** pour vérifier la robustesse du code
-   **Tests de régression** automatisés

## 📚 Ressources

### Documentation Laravel

-   [Testing Laravel](https://laravel.com/docs/testing)
-   [Database Testing](https://laravel.com/docs/testing#database-testing)
-   [HTTP Tests](https://laravel.com/docs/testing#http-tests)

### Documentation Pest

-   [Pest PHP](https://pestphp.com/)
-   [Writing Tests](https://pestphp.com/docs/writing-tests)
-   [Expectations](https://pestphp.com/docs/expectations)

### Bonnes Pratiques

-   [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)
-   [Testing Best Practices](https://laravel.com/docs/testing#best-practices)
-   [Mocking in Tests](https://laravel.com/docs/testing#mocking)

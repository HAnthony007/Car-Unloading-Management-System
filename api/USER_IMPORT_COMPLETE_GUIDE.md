# Guide complet d'importation des utilisateurs

## Vue d'ensemble

Cette fonctionnalité permet d'importer des utilisateurs en masse depuis un fichier Excel (.xlsx, .xls) ou CSV (.csv) dans le système de gestion des utilisateurs.

## Méthodes d'importation

### 1. Via l'API REST

#### Endpoint
```
POST /api/users/import
```

#### Authentification
L'authentification est requise via Sanctum token :
```
Authorization: Bearer {your_token}
```

#### Paramètres
- `file` : Fichier Excel ou CSV (max 2MB)

#### Exemple avec cURL
```bash
curl -X POST \
  http://localhost:8000/api/users/import \
  -H 'Authorization: Bearer your_token_here' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/users.xlsx'
```

#### Réponse de succès
```json
{
    "message": "Importation terminée avec succès.",
    "data": {
        "imported_users": 25,
        "skipped_users": 3,
        "total_processed": 28,
        "errors": [
            "Ligne 5: Utilisateur déjà existant (email: user@example.com)",
            "Ligne 12: Rôle non trouvé (role_name: invalid_role)"
        ]
    }
}
```

#### Réponse d'erreur
```json
{
    "error": "Le fichier doit être de type Excel (.xlsx, .xls) ou CSV (.csv)"
}
```

### 2. Via la commande Artisan

```bash
php artisan users:import /path/to/your/file.xlsx
```

#### Exemple d'utilisation
```bash
# Importation d'un fichier Excel
php artisan users:import storage/app/users_import.xlsx

# Importation d'un fichier CSV
php artisan users:import /home/user/documents/users.csv
```

## Format du fichier

### Colonnes requises et optionnelles

| Colonne | Type | Requis | Description | Exemple |
|---------|------|--------|-------------|---------|
| `matriculation_no` | string | **Oui** | Numéro de matriculation unique | EMP001, USER123 |
| `full_name` | string | **Oui** | Nom complet de l'utilisateur | Jean Dupont |
| `email` | string | **Oui** | Adresse email unique | jean.dupont@company.com |
| `password` | string | Non | Mot de passe (défaut: password123) | motdepasse123 |
| `phone` | string | Non | Numéro de téléphone | +33123456789 |
| `role_name` | string | **Oui*** | Nom du rôle existant | admin, agent |
| `role_id` | integer | **Oui*** | ID du rôle existant | 1, 2 |
| `avatar` | string | Non | URL ou chemin de l'avatar | /images/avatar.jpg |
| `email_verified` | boolean | Non | Si l'email est vérifié | true, false |

***Note :** Vous devez fournir soit `role_name` soit `role_id`

### Exemple de fichier CSV

```csv
matriculation_no,full_name,email,password,phone,role_name,avatar,email_verified
EMP001,Jean Dupont,jean.dupont@company.com,motdepasse123,+33123456789,admin,,true
EMP002,Marie Martin,marie.martin@company.com,password456,+33987654321,agent,,false
EMP003,Pierre Durand,pierre.durand@company.com,,+33555666777,agent,/avatars/pierre.jpg,true
EMP004,Sophie Moreau,sophie.moreau@company.com,secure123,,admin,,false
```

### Exemple de fichier Excel

Créez un fichier Excel avec les mêmes colonnes que l'exemple CSV ci-dessus. La première ligne doit contenir les en-têtes des colonnes.

## Règles de validation et comportement

### Validation des données
- **Fichier** : Maximum 2MB, formats acceptés (.xlsx, .xls, .csv)
- **Email** : Format email valide et unique dans le système
- **Matriculation** : Chaîne unique dans le système
- **Rôle** : Doit exister dans la base de données

### Gestion des doublons
- Si un utilisateur avec le même email ou matriculation existe déjà, il sera **ignoré**
- L'importation continue pour les autres utilisateurs
- Les erreurs sont rapportées dans la réponse

### Mots de passe
- Si aucun mot de passe n'est fourni, `password123` sera utilisé par défaut
- Les mots de passe sont automatiquement hachés avec bcrypt

### Rôles
Les rôles disponibles dans le système :
- `admin` (ID: 1) - Administrateur
- `agent` (ID: 2) - Agent

## Gestion des erreurs

### Types d'erreurs possibles
1. **Fichier invalide** : Type de fichier non supporté
2. **Utilisateur existant** : Email ou matriculation déjà utilisé
3. **Rôle introuvable** : Le rôle spécifié n'existe pas
4. **Données manquantes** : Champs obligatoires vides
5. **Erreur de format** : Données incorrectes

### Exemple de réponse avec erreurs
```json
{
    "message": "Importation terminée avec succès.",
    "data": {
        "imported_users": 2,
        "skipped_users": 3,
        "total_processed": 5,
        "errors": [
            "Ligne 2: Utilisateur déjà existant (email: john@example.com ou matriculation: EMP001)",
            "Ligne 4: Rôle non trouvé (role_name: invalid_role)",
            "Ligne 6: Données manquantes (matriculation_no, full_name ou email requis)"
        ]
    }
}
```

## Tests et développement

### Exécution des tests
```bash
# Tests spécifiques à l'importation
php artisan test --filter=UsersImportTest

# Tous les tests
php artisan test
```

### Fichier de test
Un fichier CSV de test est disponible à `storage/app/test_users_import.csv` pour vos tests.

## Logs et surveillance

### Logs d'activité
- Les importations réussies sont loggées dans `storage/logs/laravel.log`
- Les erreurs sont également loggées avec les détails complets
- Chaque utilisateur importé génère une entrée de log

### Exemple d'entrée de log
```
[2025-08-24 21:45:30] local.INFO: Utilisateur importé: john.doe@example.com
```

## Bonnes pratiques

### Préparation du fichier
1. Vérifiez que tous les rôles mentionnés existent dans le système
2. Assurez-vous que les emails sont uniques et valides
3. Utilisez des matriculations uniques et cohérentes
4. Testez avec un petit échantillon avant l'importation complète

### Sécurité
- L'authentification est obligatoire pour l'API
- Les mots de passe sont automatiquement hachés
- Les fichiers sont validés avant traitement
- Taille de fichier limitée à 2MB

### Performance
- Pour de gros volumes (>1000 utilisateurs), utilisez la commande Artisan
- Surveillez les logs pour détecter les erreurs
- Effectuez des sauvegardes avant les grosses importations

## Dépannage

### Problèmes courants

**Erreur : "Rôle non trouvé"**
- Vérifiez que le nom du rôle existe dans la base de données
- Utilisez `admin` ou `agent` (sensible à la casse)

**Erreur : "Utilisateur déjà existant"**
- Vérifiez les doublons dans votre fichier
- Consultez la base de données pour les conflits existants

**Erreur : "Fichier trop volumineux"**
- Réduisez la taille du fichier ou divisez-le en plusieurs parties
- Maximum autorisé : 2MB

**Erreur d'authentification**
- Vérifiez que votre token Sanctum est valide
- Assurez-vous d'avoir les permissions nécessaires

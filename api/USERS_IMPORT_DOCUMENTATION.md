# Documentation de l'importation des utilisateurs

## Format du fichier Excel/CSV

Le fichier Excel ou CSV doit contenir les colonnes suivantes dans la première ligne (en-têtes) :

| Colonne | Type | Requis | Description |
|---------|------|--------|-------------|
| matriculation_no | string | Oui | Numéro de matriculation unique |
| full_name | string | Oui | Nom complet de l'utilisateur |
| email | string | Oui | Adresse email unique |
| password | string | Non | Mot de passe (par défaut: password123) |
| phone | string | Non | Numéro de téléphone |
| role_name | string | Oui* | Nom du rôle (ex: Admin, User, etc.) |
| role_id | integer | Oui* | ID du rôle (alternatif à role_name) |
| avatar | string | Non | URL ou chemin de l'avatar |
| email_verified | boolean | Non | Si l'email est vérifié (true/false) |

*Vous devez fournir soit `role_name` soit `role_id`

## Exemple de fichier CSV

```csv
matriculation_no,full_name,email,password,phone,role_name,avatar,email_verified
EMP001,Jean Dupont,jean.dupont@example.com,motdepasse123,+33123456789,Admin,,true
EMP002,Marie Martin,marie.martin@example.com,password456,+33987654321,User,,false
EMP003,Pierre Durand,pierre.durand@example.com,,+33555666777,User,,true
```

## Utilisation de l'API

### Endpoint
```
POST /api/users/import
```

### Headers
```
Authorization: Bearer {your_token}
Content-Type: multipart/form-data
```

### Paramètres
- `file`: Fichier Excel (.xlsx, .xls) ou CSV (.csv) - Maximum 2MB

### Exemple de réponse réussie
```json
{
    "message": "Importation terminée avec succès.",
    "data": {
        "imported_users": 2,
        "skipped_users": 1,
        "total_processed": 3,
        "errors": [
            "Ligne 3: Utilisateur déjà existant (email: pierre.durand@example.com)"
        ]
    }
}
```

### Exemple de réponse d'erreur
```json
{
    "error": "Le fichier doit être de type Excel (.xlsx, .xls) ou CSV (.csv)"
}
```

## Règles de validation
- Le fichier ne doit pas dépasser 2MB
- Les formats acceptés sont : .xlsx, .xls, .csv
- Les emails et numéros de matriculation doivent être uniques
- Si un utilisateur existe déjà, il sera ignoré
- Les rôles doivent exister dans la base de données

## Logs
Les importations sont loggées dans les fichiers de log Laravel pour un suivi détaillé.

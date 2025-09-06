## Parking Vehicles Endpoint

- GET /api/parkings/{id}/vehicles — (DEPRECATED) ancienne vue véhicules basée sur le dernier mouvement
- GET /api/parkings/{id}/discharges — nouvelle vue basée sur les discharges (mouvements désormais liés aux discharges)

# Guide d'utilisation de l'API

Ce document présente clairement comment utiliser les routes de l'API exposées dans `routes/api.php`.

## Base URL

Toutes les routes ci‑dessous sont préfixées par:

```text
http://localhost/api
```

## Authentification

L'API utilise Laravel Sanctum. Pour les routes protégées, ajoutez le header:

```http
Authorization: Bearer {VOTRE_TOKEN}
```

Headers recommandés pour toutes les requêtes JSON:

-   `Accept: application/json`
-   `Content-Type: application/json`

Obtention rapide d'un token (exemple):

```http
POST /api/auth/login
```

```json
{
    "email": "user@example.com",
    "password": "secret"
}
```

Le corps exact des endpoints d'auth peut varier selon votre implémentation. Utilisez ensuite le token renvoyé comme Bearer.

## Conventions & Pagination

-   La plupart des listes supportent `page` et `per_page`.
-   Les détails complets pour la gestion des utilisateurs sont dans `API_ROUTES_DOCUMENTATION.md`.

---

## Endpoints par ressource

Chaque groupe ci‑dessous inclut les routes disponibles et un exemple minimal.

### Auth (`/auth`)

-   POST `/auth/register` — créer un compte
-   POST `/auth/login` — se connecter et obtenir un token
-   POST `/auth/logout` — se déconnecter (protégé)

Exemple (login):

```bash
curl -X POST "http://localhost/api/auth/login" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

Réponses typiques:

```json
{
    "message": "User logged in successfully.",
    "data": {
        "user": {
            "user_id": 1,
            "matriculation_number": "USR-2025-0001",
            "full_name": "Admin User",
            "email": "user@example.com",
            "role_id": 1,
            "is_active": true,
            "created_at": "2025-01-01T10:00:00Z"
        },
        "token": "<SANCTUM_TOKEN>"
    }
}
```

### Utilisateurs (`/users`) [protégé]

-   GET `/users` — lister/rechercher
-   POST `/users` — créer
-   POST `/users/import` — importer via fichier Excel
-   GET `/users/{userId}` — afficher par ID
-   GET `/users/matriculation/{matriculationNumber}` — afficher par matricule
-   PUT `/users/{userId}` — mettre à jour
-   DELETE `/users/{userId}` — supprimer

Référence détaillée: voir `API_ROUTES_DOCUMENTATION.md`.

Exemple (liste):

```bash
curl -X GET "http://localhost/api/users?page=1&per_page=15" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

Création:

```http
POST /api/users
```

```json
{
    "matriculation_no": "USR-2025-0002",
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "avatar": "/avatars/jane.jpg",
    "phone": "+33123456789",
    "role_id": 1
}
```

Réponse (201):

```json
{
    "message": "User created successfully.",
    "data": {
        "user_id": 2,
        "matriculation_number": "USR-2025-0002",
        "matriculation_info": { "prefix": "USR", "year": 2025, "sequence": 2 },
        "full_name": "Jane Smith",
        "email": "jane@example.com",
        "role_id": 1,
        "is_active": true,
        "created_at": "2025-08-28T10:00:00Z"
    }
}
```

Mise à jour:

```http
PUT /api/users/{userId}
```

```json
{
    "full_name": "Jane S.",
    "phone": "+33999999999",
    "avatar": "/avatars/jane-new.jpg"
}
```

Import (Excel/CSV):

```bash
curl -X POST "http://localhost/api/users/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
  -F "file=@/path/to/users.xlsx"
```

Réponse d'import:

```json
{
    "message": "Importation terminée avec succès.",
    "data": {
        "imported_users": 50,
        "skipped_users": 2,
        "total_processed": 52,
        "errors": [{ "row": 10, "message": "Email is already taken." }]
    }
}
```

### Surveys (`/surveys`) [protégé]

-   GET `/surveys`
-   POST `/surveys`
-   GET `/surveys/{id}`
-   PUT `/surveys/{id}`
-   DELETE `/surveys/{id}`

Exemple (création):

```bash
curl -X POST "http://localhost/api/surveys" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"title":"Contrôle quai","description":"…"}'
```

Payload exact (selon règles):

```json
{
    "date": "2025-08-28",
    "result": "PENDING", // PASSED | FAILED | PENDING
    "user_id": 1,
    "follow_up_file_id": 10
}
```

Réponse (201):

```json
{
    "message": "Survey created successfully.",
    "data": {
        "survey_id": 123,
        "date": "2025-08-28",
        "result": "PENDING",
        "user_id": 1,
        "follow_up_file_id": 10,
        "created_at": "2025-08-28T10:00:00Z"
    }
}
```

### Rôles (`/roles`) [protégé]

Création:

```http
POST /api/roles
```

```json
{
    "role_name": "Manager",
    "role_description": "Peut gérer les ressources"
}
```

Réponse (201):

```json
{
    "data": {
        "role_id": 3,
        "role_name": "Manager",
        "display_name": "Manager",
        "role_description": "Peut gérer les ressources",
        "permissions": {
            "is_administrator": false,
            "can_manage_users": true,
            "can_vew_reports": true
        }
    }
}
```

-   GET `/roles`
-   POST `/roles`
-   GET `/roles/{id}`
-   PUT `/roles/{id}`
-   DELETE `/roles/{id}`

### Véhicules (`/vehicles`) [protégé]

Création:

```json
{
    "vin": "WVWZZZ1JZXW000001",
    "make": "Toyota",
    "model": "Corolla",
    "color": "Blue",
    "type": "Sedan",
    "weight": "1300kg",
    "vehicle_condition": "NEW",
    "vehicle_observation": "RAS",
    "origin_country": "JP",
    "ship_location": "Hold-3",
    "is_primed": false,
    "discharge_id": 55
}
```

Réponse (201):

```json
{
    "message": "Vehicle created successfully.",
    "data": {
        "vin": "WVWZZZ1JZXW000001",
        "make": "Toyota",
        "model": "Corolla",
        "color": "Blue",
        "type": "Sedan",
        "weight": "1300kg",
        "vehicle_condition": "NEW",
        "vehicle_observation": "RAS",
        "origin_country": "JP",
        "ship_location": "Hold-3",
        "is_primed": false,
        "discharge_id": 55,
        "created_at": "2025-08-28T10:00:00Z"
    }
}
```

-   GET `/vehicles`
-   POST `/vehicles`
-   GET `/vehicles/{id}`
-   PUT `/vehicles/{id}`
-   DELETE `/vehicles/{id}`
-   GET `/vehicles/{id}/movements` — mouvements d'un véhicule

### Parkings (`/parkings`) [protégé]

Création:

```json
{
    "parking_name": "Mahasarika",
    "location": "Zone A",
    "capacity": 250,
    "parking_number": "MSK-01"
}
```

Réponse (201):

```json
{
    "message": "Parking created successfully.",
    "data": {
        "parking_id": 7,
        "parking_name": "Mahasarika",
        "location": "Zone A",
        "capacity": 250,
        "created_at": "2025-08-28T10:00:00Z"
    }
}
```

-   GET `/parkings`
-   POST `/parkings`
-   GET `/parkings/{id}`
-   PUT `/parkings/{id}`
-   DELETE `/parkings/{id}`

### Docks (`/docks`) [protégé]

Création:

```json
{
    "dock_name": "Quai 1",
    "location": "Terminal Ouest"
}
```

Réponse (201):

```json
{
    "message": "Dock created successfully.",
    "data": {
        "dock_id": 5,
        "dock_name": "Quai 1",
        "location": "Terminal Ouest",
        "created_at": "2025-08-28T10:00:00Z"
    }
}
```

-   GET `/docks`
-   POST `/docks`
-   GET `/docks/{id}`
-   PUT `/docks/{id}`
-   DELETE `/docks/{id}`

### Navires (`/vessels`) [protégé]

Création:

```json
{
    "imo_no": "IMO 9387421",
    "vessel_name": "MV Neptune",
    "flag": "PA"
}
```

Réponse (201):

```json
{
    "message": "Vessel created successfully.",
    "data": {
        "vessel_id": 22,
        "imo_no": "IMO 9387421",
        "vessel_name": "MV Neptune",
        "flag": "PA",
        "created_at": "2025-08-28T10:00:00Z"
    }
}
```

-   GET `/vessels`
-   POST `/vessels`
-   GET `/vessels/{id}`
-   PUT `/vessels/{id}`
-   DELETE `/vessels/{id}`

### Escales (`/port-calls`) [protégé]

Création:

```json
{
    "vessel_agent": "ACME Shipping",
    "origin_port": "Singapore",
    "estimated_arrival": "2025-09-01T08:00:00Z",
    "arrival_date": "2025-09-01T10:00:00Z",
    "estimated_departure": "2025-09-03T16:00:00Z",
    "departure_date": "2025-09-03T18:00:00Z",
    "vessel_id": 22,
    "dock_id": 5
}
```

Réponse (201):

```json
{
    "message": "Port call created successfully.",
    "data": {
        "port_call_id": 30,
        "vessel_agent": "ACME Shipping",
        "origin_port": "Singapore",
        "arrival_date": "2025-09-01T10:00:00Z",
        "vessel_id": 22,
        "dock_id": 5,
        "created_at": "2025-08-28T10:00:00Z"
    }
}
```

-   GET `/port-calls`
-   POST `/port-calls`
-   GET `/port-calls/{id}`
-   PUT `/port-calls/{id}`
-   DELETE `/port-calls/{id}`
-   GET `/port-calls/{id}/discharges` — déchargements d'une escale

### Déchargements (`/discharges`) [protégé]

Création:

```json
{
    "discharge_date": "2025-09-02T12:00:00Z",
    "port_call_id": 30
}
```

Réponse (201):

```json
{
    "message": "Discharge created successfully.",
    "data": {
        "discharge_id": 55,
        "discharge_date": "2025-09-02T12:00:00Z",
        "port_call_id": 30,
        "created_at": "2025-08-28T10:00:00Z"
    }
}
```

-   GET `/discharges`
-   POST `/discharges`
-   GET `/discharges/{id}`
-   PUT `/discharges/{id}`
-   DELETE `/discharges/{id}`

### Dossiers de suivi (`/follow-up-files`) [protégé]

Création:

```json
{
    "bill_of_lading": "BL-2025-0001",
    "status": "OPEN", // OPEN | IN_PROGRESS | CLOSED | PENDING
    "port_call_id": 30
}
```

Réponse (201):

```json
{
    "message": "FollowUpFile created successfully.",
    "data": {
        "follow_up_file_id": 10,
        "bill_of_lading": "BL-2025-0001",
    "status": "OPEN",
        "port_call_id": 30
    }
}
```

-   GET `/follow-up-files`
-   POST `/follow-up-files`
-   GET `/follow-up-files/{id}`
-   PUT `/follow-up-files/{id}`
-   DELETE `/follow-up-files/{id}`

### Points de contrôle de survey (`/survey-checkpoints`) [protégé]

Création:

```json
{
    "title": "Inspection carrosserie",
    "comment": "Aucune rayure",
    "survey_id": 123
}
```

Réponse (201):

```json
{
    "message": "SurveyCheckpoint created successfully.",
    "data": {
        "checkpoint_id": 77,
        "title": "Inspection carrosserie",
        "comment": "Aucune rayure",
        "survey_id": 123
    }
}
```

-   GET `/survey-checkpoints`
-   POST `/survey-checkpoints`
-   GET `/survey-checkpoints/{id}`
-   PUT `/survey-checkpoints/{id}`
-   DELETE `/survey-checkpoints/{id}`

### Photos (`/photos`) [protégé]

Création:

```json
{
    "photo_path": "/uploads/vehicules/100/front.jpg",
    "taken_at": "2025-08-28T09:30:00Z",
    "photo_description": "Vue avant",
    "follow_up_file_id": 10,
    "checkpoint_id": 77
}
```

Réponse (201):

```json
{
    "message": "Photo created successfully.",
    "data": {
        "photo_id": 501,
        "photo_path": "/uploads/vehicules/100/front.jpg",
        "photo_description": "Vue avant",
        "checkpoint_id": 77,
        "taken_at": "2025-08-28T09:30:00Z"
    }
}
```

-   GET `/photos`
-   POST `/photos`
-   GET `/photos/{id}`
-   PUT `/photos/{id}`
-   DELETE `/photos/{id}`

### Documents (`/documents`) [protégé]

Création (multipart ou chemin existant):

Option A — upload de fichier:

```bash
curl -X POST "http://localhost/api/documents" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
  -F "file=@/path/to/invoice.pdf" \
  -F "type=INVOICE" \
  -F "uploaded_at=2025-08-28T09:00:00Z" \
  -F "follow_up_file_id=10"
```

Option B — chemin déjà stocké:

```json
{
    "document_path": "docs/2025/invoice-10.pdf",
    "type": "INVOICE",
    "uploaded_at": "2025-08-28T09:00:00Z",
    "follow_up_file_id": 10
}
```

Réponse (201):

```json
{
    "message": "Document created successfully.",
    "data": {
        "document_id": 900,
        "document_path": "docs/2025/invoice-10.pdf",
        "document_url": "http://localhost/storage/docs/2025/invoice-10.pdf",
        "type": "INVOICE",
        "uploaded_at": "2025-08-28T09:00:00Z",
        "follow_up_file_id": 10
    }
}
```

-   GET `/documents`
-   POST `/documents`
-   GET `/documents/{id}`
-   PUT `/documents/{id}`
-   DELETE `/documents/{id}`

### Mouvements (`/movements`) [protégé]

Création:

```json
{
    "note": "Déplacé vers parking B",
    "timestamp": "2025-08-28T11:00:00Z",
    "from": "Dock-5",
    "to": "Parking-B",
    "user_id": 1
}
```

Réponse (201):

```json
{
    "message": "Movement created successfully.",
    "data": {
        "movement_id": 301,
        "note": "Déplacé vers parking B",
        "timestamp": "2025-08-28T11:00:00Z",
        "from": "Dock-5",
        "to": "Parking-B",
        "user_id": 1
    }
}
```

-   GET `/movements`
-   POST `/movements`
-   GET `/movements/{id}`
-   PUT `/movements/{id}`
-   DELETE `/movements/{id}`

---

## Gestion des erreurs

Format standard des erreurs JSON:

```json
{
    "error": "Message d'erreur descriptif"
}
```

Codes fréquents:

-   200: OK, 201: Créé
-   401: Non authentifié (ou token invalide/absent)
-   403: Interdit
-   404: Non trouvé
-   422: Validation échouée

## Essais rapides

```bash
# 1) Login pour obtenir un token
curl -X POST "http://localhost/api/auth/login" \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

# 2) Lister les utilisateurs (remplacez YOUR_TOKEN)
curl -X GET "http://localhost/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN" -H "Accept: application/json"
```

---

Besoin du détail complet pour les utilisateurs (filtres, schémas, exemples) ? Consultez `API_ROUTES_DOCUMENTATION.md`.

# API Routes Documentation - Discharge Photos

Toutes les routes nécessitent `auth:sanctum`.

## 1. Uploader une photo pour un discharge

`POST /api/discharges/{id}/photos`

Content-Type: multipart/form-data

Champs:

- file (requis): image jpeg/png/gif/webp/svg (max 10MB)
- taken_at (optionnel): datetime ISO
- photo_description (optionnel): string
- checkpoint_id (optionnel): integer existant dans survey_checkpoints
- visibility (optionnel): public|private (défaut public)

Réponse 201:

{
  "message": "Photo created and uploaded successfully.",
  "data": {
    "photo_id": 123,
    "photo_path": "photos/discharges/45/uuid.jpg",
  "url": "<https://r2.example.com/photos/discharges/45/uuid.jpg>",
    "discharge_id": 45,
    "checkpoint_id": null
  }
}

Notes:

- Les fichiers sont stockés sur Cloudflare R2 sous `photos/discharges/{discharge_id}/`
- Le contrôleur délègue à un UseCase d’application pour respecter l’architecture.

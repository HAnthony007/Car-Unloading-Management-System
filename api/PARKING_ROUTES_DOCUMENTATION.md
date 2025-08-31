# API Routes Documentation - Parking & Vehicles in Parking

Toutes les routes nécessitent l'authentification Sanctum (Authorization: Bearer TOKEN).

Base: /api/parkings

- GET /api/parkings — liste des parkings
- POST /api/parkings — créer un parking
- GET /api/parkings/{id} — détails d'un parking
- PUT /api/parkings/{id} — mettre à jour
- DELETE /api/parkings/{id} — supprimer

Nouveau:

- GET /api/parkings/{id}/vehicles — véhicules actuellement dans ce parking (basé sur la dernière destination de mouvement)

Réponse:

```json
{
  "parking_id": 1,
  "parking_name": "Mahasarika",
  "total": 12,
  "vehicles": [
    {
      "vehicle_id": 10,
      "vin": "...",
      "make": "...",
      "model": "...",
      // ... mêmes champs que VehicleResource
    }
  ]
}
```

Remarques:

- La présence d'un véhicule est déterminée par le dernier mouvement dont la destination (to) égale le nom du parking.
- Si aucun mouvement n'existe pour un véhicule, il n'est pas comptabilisé.

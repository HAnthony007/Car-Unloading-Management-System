# Quick Start: Vehicles in a Parking

Endpoint: GET /api/parkings/{id}/vehicles

Headers:

- Authorization: Bearer `YOUR_TOKEN`
- Accept: application/json

Response example:

```json
{
  "parking_id": 1,
  "parking_name": "Mahasarika",
  "total": 3,
  "vehicles": [
    { "vehicle_id": 101, "vin": "...", "make": "...", "model": "..." }
  ]
}
```

Notes:

- A vehicle is considered in the parking if its latest movement has `to` equal to the parking name.

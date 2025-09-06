# Quick Start: Vehicles in a Parking

Endpoint (DEPRECATED): GET /api/parkings/{id}/vehicles

Remplacé par: GET /api/parkings/{id}/discharges

Réponse discharges (exemple):
{
  "parking_id": 1,
  "parking_name": "Mahasarika",
  "total": 3,
  "discharges": [
    {"discharge_id": 10, "discharge_date": "2025-09-06T10:10:00Z", "port_call_id": 5, "parking_number": "P001"}
  ]
}

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

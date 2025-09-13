# API Routes Documentation - Inspections

## Contexte

Les inspections sont initialisées pour un discharge via des surveys générés à partir de templates actifs. Chaque survey contient des checkpoints.

## Authentification

Toutes les routes nécessitent `auth:sanctum`.

## Routes

### 1. Initialiser une inspection

`POST /api/inspections/start`

Body JSON:

```json
{
  "discharge_id": 123,
  "force": false
}
```

`force` (optionnel) : true pour réinitialiser (créera de nouveaux surveys si déjà existants).

Réponses:

- 201 (créé) : inspection initialisée
- 200 (déjà initialisée) : retourne la liste des surveys existants
- 400 : discharge introuvable / aucun template actif

Exemple (déjà initialisée):

```json
{
  "message": "Inspection déjà initialisée pour ce discharge.",
  "data": [
    {"survey_id": 10, "survey_name": "Entrée"},
    {"survey_id": 11, "survey_name": "Carrosserie"}
  ]
}
```

### 2. Récupérer l'inspection d'un discharge

`GET /api/discharges/{id}/inspection`

Retourne tous les surveys + leurs checkpoints associés dans l'ordre.

Réponses:

- 200 : succès
- 404 : discharge introuvable OU inspection pas encore initialisée

Exemple succès:

```json
{
  "data": [
    {
      "survey_id": 10,
      "survey_name": "Entrée",
      "overall_status": "PENDING",
      "survey_description": null,
      "survey_date": "2025-09-13T12:30:00Z",
      "checkpoints": [
        {
          "checkpoint_id": 501,
          "title_checkpoint": "Etat carrosserie avant",
          "description_checkpoint": "Inspection visuelle",
          "comment_checkpoint": null,
          "result_checkpoint": null,
          "order_checkpoint": 1
        }
      ]
    }
  ]
}
```

Erreur (inspection non initialisée):

```json
{
  "error": "Inspection not initialized for this discharge."
}
```

### Codes d'erreur communs

- 401 Non authentifié
- 404 Ressource introuvable
- 400 Erreur logique (ex: aucun template)

## Prochaines Extensions Possibles

- PATCH pour mettre à jour un checkpoint (résultat / commentaire)
- Endpoint pour calculer un statut global de l'inspection
- Historisation des ré-initialisations (mode force)

---

Dernière mise à jour: 2025-09-13

# Import du Manifeste (Navire + Véhicules)

Ce document décrit le format attendu du fichier Excel et l’API/CLI pour importer un manifeste contenant les informations suivantes:

- Navire: Vessel + PortCall (dock_id null)
- Véhicules: Vehicle + FollowUpFile
- Douanes: ignorée

## Fichier Excel

- Format: `.xlsx` ou `.xls`
- Feuilles:
  - Navire (obligatoire)
  - Véhicules (obligatoire)
  - Douanes (ignorée)

### Feuille « Navire »

Deux formats supportés:

1) Clé/Valeur par ligne (ex.: colonnes `Champ` et `Valeur` ou `4`)
   - Nom du navire → `MV ASIA EXPRESS`
   - Numéro IMO → `9334567`
   - Pavillon → `Panama`
   - Agent maritime → `SMMC` (exemple)
   - Port de provenance → `Japon` (exemple)
   - ETA → `2025-08-25 10:30` (ou valeur date Excel)

2) En-têtes sur une ligne (colonnes): `nom_du_navire`, `numero_imo`, `pavillon`, `agent_maritime`, `port_de_provenance`, `eta`

Création:

- Vessel: trouvé/créé par `imo_no` (unique)
- PortCall: créé avec `vessel_agent`, `origin_port`, `estimated_arrival` (ETA), `dock_id = null`, lié au Vessel

### Feuille « Véhicules »

Colonnes supportées (variantes FR/EN prises en charge):

- VIN / Châssis: `vin`, `vin___chassis`, `vin/chassis`, `chassis`
- Marque: `marque`, `make`
- Modèle: `modele`, `modèle`, `model`
- Type: `type`
- Couleur: `couleur`, `color`
- Année: `annee`, `année`, `year`
- Pays origine: `pays_origine`, `pays_origin`, `pays`, `origin_country`
- Propriétaire/Destinataire: `proprietaire_destinataire`, `propriétaire_destinataire`, `owner`, `proprietaire`, `owner_name`
- Connaissement B/L: `connaissement_b_l`, `connaissement`, `bill_of_lading`
- Emplacement navire: `emplacement_navire`, `ship_location`
- Statut: `statut`, `status`
- Observations: `observations`, `observation`, `vehicle_observation`
- Amorce (booléen): `amorce`, `is_primed` (`oui/non`, `true/false`, `1/0`)
- Poids brut (kg): `poids_brut__kg_`, `poids_brut_kg`, `poids`, `weight`

Règles:

- Vehicle: unique par `vin`. Si le VIN existe déjà, la ligne est ignorée.
- FollowUpFile: `bill_of_lading` unique (obligatoire) par contrainte DB. Un dossier est créé pour chaque véhicule, lié au `port_call_id` du PortCall créé à partir de la feuille Navire.
- `discharge_id` est nul pour les véhicules importés.

## API

- Endpoint: `POST /api/imports/manifest` (auth Sanctum)
- Form-data: `file` (xlsx/xls)

Réponse (200):

```json
{
  "message": "Importation du manifeste terminée.",
  "data": {
    "vessels_created": 1,
    "port_calls_created": 1,
    "vehicles_created": 120,
    "follow_up_files_created": 120,
    "vehicles_skipped": 2,
    "errors": ["Véhicules ligne 10: VIN déjà existant (JTM...)"]
  }
}
```

Exemple (curl):

```bash
curl -sS -X POST http://localhost:8000/api/imports/manifest \
  -H "Authorization: Bearer <TOKEN>" \
  -F file=@public/Manifeste_Vehicules_SMMC(1).xlsx
```

## CLI

- Commande: `php artisan manifest:import /chemin/Manifeste.xlsx`

Sortie: affiche les métriques et éventuelles erreurs.

## Erreurs fréquentes

- « Aucun PortCall créé en amont »: la feuille Navire est manquante ou incomplète.
- « VIN déjà existant »: le véhicule est ignoré.
- « Conflit B/L »: `bill_of_lading` vide ou déjà utilisé.

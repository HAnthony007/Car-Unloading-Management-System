import type { VehicleRow, VesselInfo } from "../types/manifest";

export const VESSEL_FIELD_ALIASES: Record<keyof VesselInfo, string[]> = {
  nom_du_navire: ["nom_du_navire", "nom navire", "nom_navire", "navire", "vessel", "vessel_name", "ship_name", "name"],
  numero_imo: ["numero_imo", "imo", "imo_no", "imo_number", "numeroimo"],
  pavillon: ["pavillon", "flag"],
  agent_maritime: ["agent_maritime", "agent", "vessel_agent", "agent_maritime_navire"],
  port_de_provenance: [
    "port_de_provenance",
    "provenance",
    "origin_port",
    "port_origine",
    "port_d_origine",
    "port_origin",
    "port_from",
  ],
  eta: ["eta", "estimated_arrival", "date_arrivee_prevue", "arrival_eta"],
};

export const VEHICLE_FIELD_ALIASES: Partial<Record<keyof VehicleRow, string[]>> = {
  vin: ["vin", "vin___chassis", "vin/chassis", "chassis"],
  bill_of_lading: ["connaissement_b_l", "connaissement", "bill_of_lading"],
  marque: ["marque", "make"],
  modele: ["modele", "modèle", "model"],
  type: ["type"],
  couleur: ["couleur", "color"],
  annee: ["annee", "année", "year"],
  pays_origine: ["pays_origine", "pays_origin", "pays", "origin_country"],
  proprietaire_destinataire: ["proprietaire_destinataire", "propriétaire_destinataire", "owner", "proprietaire", "owner_name"],
  emplacement_navire: ["emplacement_navire", "ship_location"],
  statut: ["statut", "status"],
  observations: ["observations", "observation", "vehicle_observation"],
  amorce: ["amorce", "is_primed"],
  poids_brut_kg: ["poids_brut__kg_", "poids_brut_kg", "poids", "weight"],
};

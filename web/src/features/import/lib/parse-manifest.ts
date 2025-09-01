import * as XLSX from "xlsx";
import { VEHICLE_FIELD_ALIASES, VESSEL_FIELD_ALIASES } from "../data/manifest-alias";
import type { VehicleRow, VesselInfo } from "../types/manifest";

export function parseManifestFile(file: File): Promise<{ vessel: VesselInfo | null; vehicles: VehicleRow[] }>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire le fichier"));
    reader.onload = () => {
      try {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });

        const vessel = parseVesselSheet(wb);
        const vehicles = parseVehiclesSheet(wb);
        resolve({ vessel, vehicles });
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function parseVesselSheet(wb: XLSX.WorkBook): VesselInfo | null {
  const sheetName = wb.SheetNames.find((n: string) => n.toLowerCase().includes("navire"));
  if (!sheetName) return null;
  const ws = wb.Sheets[sheetName];
  if (!ws) return null;

  // Try key/value format (2 columns)
  const rows = XLSX.utils.sheet_to_json<{ [k: string]: any }>(ws, { header: 1, raw: true }) as any[];
  if (rows && rows.length && Array.isArray(rows[0])) {
    const obj: VesselInfo = {};
    const map: Record<keyof VesselInfo, string[]> = VESSEL_FIELD_ALIASES;
    for (const r of rows as any[]) {
      if (!r || r.length < 2) continue;
      const key = normalizeKey(String(r[0] ?? ""));
      const val = r[1];
      if (!key) continue;
      if (matchKey(key, map.nom_du_navire)) obj.nom_du_navire = String(val ?? "");
      else if (matchKey(key, map.numero_imo)) obj.numero_imo = val;
      else if (matchKey(key, map.pavillon)) obj.pavillon = String(val ?? "");
      else if (matchKey(key, map.agent_maritime)) obj.agent_maritime = String(val ?? "");
      else if (matchKey(key, map.port_de_provenance)) obj.port_de_provenance = String(val ?? "");
      else if (matchKey(key, map.eta)) obj.eta = normalizeDate(val);
    }
    if (Object.values(obj).some(Boolean)) return obj;
  }

  // Try row with headers
  const json = XLSX.utils.sheet_to_json<{ [k: string]: any }>(ws, { raw: true });
  if (json && json.length) {
    const r = json[0];
    const mapv = (keys: string[]) => firstValue(r, keys);
    const v: VesselInfo = {
      nom_du_navire: mapv(VESSEL_FIELD_ALIASES.nom_du_navire) as string,
      numero_imo: mapv(VESSEL_FIELD_ALIASES.numero_imo) as string,
      pavillon: mapv(VESSEL_FIELD_ALIASES.pavillon) as string,
      agent_maritime: mapv(VESSEL_FIELD_ALIASES.agent_maritime) as string,
      port_de_provenance: mapv(VESSEL_FIELD_ALIASES.port_de_provenance) as string,
      eta: normalizeDate(mapv(VESSEL_FIELD_ALIASES.eta)) as string,
    };
    if (Object.values(v).some(Boolean)) return v;
  }
  return null;
}

function parseVehiclesSheet(wb: XLSX.WorkBook): VehicleRow[] {
  const sheetName = wb.SheetNames.find((n: string) => n.toLowerCase().includes("véhicules") || n.toLowerCase().includes("vehicules") || n.toLowerCase().includes("vehicles"));
  if (!sheetName) return [];
  const ws = wb.Sheets[sheetName];
  if (!ws) return [];
  const json = XLSX.utils.sheet_to_json<{ [k: string]: any }>(ws, { raw: true });
  return json.map((r: Record<string, any>) => normalizeVehicleRow(r));
}

function normalizeVehicleRow(r: Record<string, any>): VehicleRow {
  const get = (keys: string[]) => firstValue(r, keys);
  const row: VehicleRow = { ...r };
  row.vin = (get(VEHICLE_FIELD_ALIASES.vin || []) as string | undefined)?.toString().trim();
  row.bill_of_lading = (get(VEHICLE_FIELD_ALIASES.bill_of_lading || []) as string | undefined)?.toString().trim();
  row.marque = (get(VEHICLE_FIELD_ALIASES.marque || []) as string | undefined)?.toString().trim();
  row.modele = (get(VEHICLE_FIELD_ALIASES.modele || []) as string | undefined)?.toString().trim();
  row.type = (get(VEHICLE_FIELD_ALIASES.type || []) as string | undefined)?.toString().trim();
  row.couleur = (get(VEHICLE_FIELD_ALIASES.couleur || []) as string | undefined)?.toString().trim();
  const yr = get(VEHICLE_FIELD_ALIASES.annee || []);
  row.annee = typeof yr === "number" ? yr : (yr ? String(yr).trim() : undefined);
  row.pays_origine = (get(VEHICLE_FIELD_ALIASES.pays_origine || []) as string | undefined)?.toString().trim();
  row.proprietaire_destinataire = (get(VEHICLE_FIELD_ALIASES.proprietaire_destinataire || []) as string | undefined)?.toString().trim();
  row.emplacement_navire = (get(VEHICLE_FIELD_ALIASES.emplacement_navire || []) as string | undefined)?.toString().trim();
  row.statut = (get(VEHICLE_FIELD_ALIASES.statut || []) as string | undefined)?.toString().trim();
  row.observations = (get(VEHICLE_FIELD_ALIASES.observations || []) as string | undefined)?.toString().trim();
  const amorce = get(VEHICLE_FIELD_ALIASES.amorce || []);
  if (typeof amorce === "string") {
    const s = amorce.toString().toLowerCase().trim();
    row.amorce = ["oui", "true", "1", "yes"].includes(s)
      ? true
      : ["non", "false", "0", "no"].includes(s)
      ? false
      : s; // keep as-is if not clearly boolean
  } else if (typeof amorce === "number" || typeof amorce === "boolean") {
    row.amorce = Boolean(amorce);
  }
  const poids = get(VEHICLE_FIELD_ALIASES.poids_brut_kg || []);
  if (poids !== undefined) {
    const n = typeof poids === "number" ? poids : Number(String(poids).replace(/[^0-9.,-]/g, "").replace(",", "."));
    row.poids_brut_kg = Number.isFinite(n) ? n : String(poids);
  }
  // Keep original fields as is for preview
  return row;
}

function firstValue(obj: Record<string, any>, keys: string[]) {
  for (const k of keys) {
  if (k in obj) return obj[k];
  const found = Object.keys(obj).find((kk) => normalizeKey(kk) === normalizeKey(k));
    if (found) return obj[found];
  }
  return undefined;
}

function normalizeDate(v: any): string | undefined {
  if (!v && v !== 0) return undefined;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "number") {
    // Excel date serial
    const date = XLSX.SSF.parse_date_code(v as number);
    if (date) {
      const d = new Date(Date.UTC(date.y, (date.m || 1) - 1, date.d || 1, date.H || 0, date.M || 0, date.S || 0));
      return d.toISOString();
    }
  }
  const s = String(v).trim();
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  return s;
}

function normalizeKey(k: string): string {
  return k
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function matchKey(input: string, candidates: string[]): boolean {
  const nk = normalizeKey(input);
  return candidates.some((c) => nk === normalizeKey(c));
}

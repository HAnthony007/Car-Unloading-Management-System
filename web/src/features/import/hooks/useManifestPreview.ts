"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { parseManifestFile } from "../lib/parse-manifest";
import type { ManifestData, VehicleRow, VesselInfo } from "../types/manifest";

export function useManifestPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [vesselInfo, setVesselInfo] = useState<VesselInfo | null>(null);
  const [vehiclesRaw, setVehiclesRaw] = useState<VehicleRow[]>([]);
  const [previewData, setPreviewData] = useState<ManifestData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const clear = useCallback(() => {
    setFile(null);
    setVesselInfo(null);
    setVehiclesRaw([]);
    setPreviewData([]);
    setErrors([]);
  }, []);

  const readExcelForPreview = useCallback(async (selectedFile: File) => {
    try {
      const { vessel, vehicles } = await parseManifestFile(selectedFile);
      setVesselInfo(vessel || null);
      setVehiclesRaw(vehicles || []);

      const normalized: ManifestData[] = (vehicles || []).slice(0, 200).map((r: any) => ({
        navire: (vessel?.nom_du_navire || "") as string,
        vehicule: (r.vin || "") as string,
        chauffeur: (r.proprietaire_destinataire || r.owner || r.owner_name || r.proprietaire || "") as string,
        dateArrivee: (vessel?.eta as string) || "",
        dateDepart: "",
        status: (r.statut || "") as string,
        cargaison: (r.type || "") as string,
        poids: Number(r.poids_brut_kg || 0) || 0,
      }));
      setPreviewData(normalized);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lecture du fichier Excel impossible";
      toast.error(msg);
      setErrors([msg]);
    }
  }, []);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setErrors([]);
    readExcelForPreview(selectedFile);
  }, [readExcelForPreview]);

  return {
    // state
    file,
    vesselInfo,
    vehiclesRaw,
    previewData,
    errors,
    // actions
    handleFileSelect,
    readExcelForPreview,
    clear,
    setErrors,
    setFile,
  } as const;
}

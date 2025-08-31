"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useVehiclesStore } from "../store/vehicles-store";

export const VehiclesDetailsDialog = () => {
  const open = useVehiclesStore((s) => s.open === "view");
  const setOpen = useVehiclesStore((s) => s.setOpen);
  const current = useVehiclesStore((s) => s.currentRow);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) setOpen(null);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            {current?.make} {current?.model}
            {current?.condition ? (
              <Badge variant="secondary" className="ml-2 capitalize">{current?.condition}</Badge>
            ) : null}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            VIN: {current?.vin} • {current?.type} • {current?.color}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Propriétaire" value={current?.ownerName} />
          <Field label="Année" value={current?.year} />
          <Field label="Poids" value={current?.weight} />
          <Field label="Pays d'origine" value={current?.originCountry} />
          <Field label="Lieu d'embarquement" value={current?.shipLocation} />
          <Field label="Apprêté" value={current?.isPrimed ? "Oui" : "Non"} />
          <Field label="Discharge ID" value={current?.dischargeId != null ? String(current?.dischargeId) : ""} />
          <Field label="Créé le" value={current?.createdAt} />
          <Field label="Mis à jour le" value={current?.updatedAt} />
        </div>

        {current?.observation ? (
          <div className="mt-4">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Observation</div>
            <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">{current.observation}</div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

function Field({ label, value }: { label: string; value?: string | boolean | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
      <div className="text-sm">{String(value)}</div>
    </div>
  );
}

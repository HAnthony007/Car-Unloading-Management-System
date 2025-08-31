"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useVehiclesStore } from "../store/vehicles-store";

export const VehiclesDetailsSheet = () => {
  const isOpen = useVehiclesStore((s) => s.open === "view");
  const setOpen = useVehiclesStore((s) => s.setOpen);
  const current = useVehiclesStore((s) => s.currentRow);

  const title = [current?.make, current?.model].filter(Boolean).join(" ") || "Véhicule";

  return (
    <Sheet open={isOpen} onOpenChange={(o) => setOpen(o ? "view" : null)}>
      <SheetContent side="right" className="sm:max-w-lg p-0">
        <SheetHeader className="border-b bg-muted/30">
          <div className="flex items-start justify-between">
            <div className="min-w-0 p-1">
              <SheetTitle className="truncate">{title}</SheetTitle>
              <SheetDescription className="truncate">
                VIN: {current?.vin} {current?.type ? `• ${current?.type}` : ""} {current?.color ? `• ${current?.color}` : ""}
              </SheetDescription>
              <div className="mt-2 flex flex-wrap gap-2">
                {current?.condition ? (
                  <Badge variant="secondary" className="capitalize">{current.condition}</Badge>
                ) : null}
                {current?.isPrimed ? (
                  <Badge className="bg-primary/10 text-primary border-none">Apprêté</Badge>
                ) : (
                  <Badge className="bg-muted text-foreground border-none">Non apprêté</Badge>
                )}
              </div>
            </div>
            <div className="p-1 text-xs text-muted-foreground">
              {current?.createdAt ? (
                <div className="text-right">Créé: {fmtDate(current.createdAt)}</div>
              ) : null}
              {current?.updatedAt ? (
                <div className="text-right">MAJ: {fmtDate(current.updatedAt)}</div>
              ) : null}
            </div>
          </div>
        </SheetHeader>

        <div className="divide-y">
          <Section title="Détails">
            <Grid>
              <Field label="Propriétaire" value={current?.ownerName} />
              <Field label="Année" value={current?.year} />
              <Field label="Poids" value={current?.weight} />
              <Field label="Pays d'origine" value={current?.originCountry} />
              <Field label="Lieu d'embarquement" value={current?.shipLocation} />
              <Field label="Discharge ID" value={numOrEmpty(current?.dischargeId)} />
            </Grid>
          </Section>
          {current?.observation ? (
            <Section title="Observation">
              <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">{current.observation}</div>
            </Section>
          ) : null}
        </div>

        <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground flex items-center gap-2">
          <Icons.vehicle className="h-4 w-4" />
          ID: {current?.id}
        </div>
      </SheetContent>
    </Sheet>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-4 py-3">
      <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className={cn("grid gap-3", "sm:grid-cols-2")}>{children}</div>;
}

function Field({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
      <div className="text-sm">{String(value)}</div>
    </div>
  );
}

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function numOrEmpty(v?: number | null) {
  return v != null ? String(v) : "";
}

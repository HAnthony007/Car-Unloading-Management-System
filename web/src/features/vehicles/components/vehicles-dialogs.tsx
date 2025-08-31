import { Icons } from "@/components/icons/icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DialogConfirm } from "@/components/ui/dialog-confirm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import type { Vehicle } from "../data/schema";
import { useCreateVehicle, useDeleteVehicle, useUpdateVehicle } from "../hooks/useVehicleMutations";
import { useVehiclesStore } from "../store/vehicles-store";

function VehiclesDeleteDialog({ open, onOpenChange, currentRow }: { open: boolean; onOpenChange: (open: boolean) => void; currentRow: Vehicle }) {
  const [value, setValue] = useState("");
  const { mutateAsync: deleteMutate, isPending } = useDeleteVehicle();
  const handleDelete = () => {
    if (value.trim() !== currentRow.vin) return;
    deleteMutate({ id: currentRow.id })
      .then(() => {
        toast.success("Véhicule supprimé");
        onOpenChange(false);
      })
  .catch((e: unknown) => toast.error(e instanceof Error ? e.message : String(e)));
  };
  return (
    <DialogConfirm
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.vin || isPending}
      title={
        <span className="text-destructive">
          <Icons.alertTriangle size={18} className="stroke-destructive mr-1 inline-block" /> Delete Vehicle
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete vehicle VIN <span className="font-bold">{currentRow.vin}</span>?
            <br />This action is permanent.
          </p>
          <Label className="my-2">
            VIN:
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter VIN to confirm deletion." />
          </Label>
          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>Cette action est irréversible.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}

export const VehiclesDialogs = () => {
  const open = useVehiclesStore((s) => s.open);
  const setOpen = useVehiclesStore((s) => s.setOpen);
  const currentRow = useVehiclesStore((s) => s.currentRow);
  const setCurrentRow = useVehiclesStore((s) => s.setCurrentRow);

  return (
    <>
  <VehiclesDetailsDialog />
      {/* Add/Edit dialog */}
      <VehiclesUpsertDialog
        key={currentRow ? `vehicle-edit-${currentRow.id}` : `vehicle-add`}
        open={open === "add" || open === "edit"}
        currentRow={open === "edit" ? currentRow ?? undefined : undefined}
        onOpenChange={(state) => {
          if (!state) {
            setOpen(null);
            setTimeout(() => setCurrentRow(null), 500);
          } else {
            setOpen(currentRow ? "edit" : "add");
          }
        }}
      />

      {currentRow && (
        <VehiclesDeleteDialog
          key={`vehicle-delete-${currentRow.id}`}
          open={open === "delete"}
          onOpenChange={(state) => {
            if (!state) {
              setOpen(null);
              setTimeout(() => setCurrentRow(null), 500);
            } else setOpen("delete");
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
};

// Minimal add/edit dialog (form fields kept small for now)
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { VehiclesDetailsDialog } from "./vehicles-details-dialog";

const vehicleFormSchema = z.object({
  vin: z.string().min(1, "VIN requis"),
  make: z.string().min(1, "Marque requise"),
  model: z.string().min(1, "Modèle requis"),
  year: z
    .string()
    .regex(/^\d{4}$/u, { message: "Année invalide (ex: 2024)" })
    .optional()
    .or(z.literal("")),
  ownerName: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
  type: z.string().optional().or(z.literal("")),
  weight: z.string().optional().or(z.literal("")),
  condition: z.string().optional().or(z.literal("")),
  observation: z.string().optional().or(z.literal("")),
  originCountry: z.string().optional().or(z.literal("")),
  shipLocation: z.string().optional().or(z.literal("")),
  isPrimed: z.boolean().optional(),
  dischargeId: z
    .string()
    .regex(/^\d*$/u, { message: "Doit être un nombre" })
    .optional()
    .or(z.literal("")),
});
type VehicleForm = z.infer<typeof vehicleFormSchema>;

function VehiclesUpsertDialog({
  currentRow,
  open,
  onOpenChange,
}: { currentRow?: Vehicle; open: boolean; onOpenChange: (open: boolean) => void }) {
  const isEdit = !!currentRow;
  const form = useForm<VehicleForm>({
    defaultValues: {
      vin: currentRow?.vin ?? "",
      make: currentRow?.make ?? "",
      model: currentRow?.model ?? "",
  year: currentRow?.year ?? "",
  ownerName: currentRow?.ownerName ?? "",
  color: currentRow?.color ?? "",
  type: currentRow?.type ?? "",
  weight: currentRow?.weight ?? "",
  condition: currentRow?.condition ?? "",
  observation: currentRow?.observation ?? "",
  originCountry: currentRow?.originCountry ?? "",
  shipLocation: currentRow?.shipLocation ?? "",
  isPrimed: currentRow?.isPrimed ?? false,
  dischargeId: currentRow?.dischargeId != null ? String(currentRow.dischargeId) : "",
    },
    resolver: zodResolver(vehicleFormSchema),
    mode: "onChange",
  });

  const { mutateAsync: createMutate, isPending: isCreating } = useCreateVehicle();
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateVehicle();

  const onSubmit = async (data: VehicleForm) => {
    try {
      if (isEdit && currentRow?.id) {
        await updateMutate({ id: currentRow.id, payload: {
          vin: data.vin,
          make: data.make,
          model: data.model,
          year: data.year || null,
          ownerName: data.ownerName || null,
          color: data.color || null,
          type: data.type || null,
          weight: data.weight || null,
          condition: data.condition || null,
          observation: data.observation || null,
          originCountry: data.originCountry || null,
          shipLocation: data.shipLocation || null,
          isPrimed: data.isPrimed ?? null,
          dischargeId: data.dischargeId ? Number(data.dischargeId) : null,
        }});
        toast.success("Véhicule mis à jour");
      } else {
        await createMutate({
          vin: data.vin,
          make: data.make,
          model: data.model,
          year: data.year || null,
          ownerName: data.ownerName || null,
          color: data.color || null,
          type: data.type || null,
          weight: data.weight || null,
          condition: data.condition || null,
          observation: data.observation || null,
          originCountry: data.originCountry || null,
          shipLocation: data.shipLocation || null,
          isPrimed: data.isPrimed ?? null,
          dischargeId: data.dischargeId ? Number(data.dischargeId) : null,
        });
        toast.success("Véhicule créé");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? "Modifier le véhicule" : "Ajouter un véhicule"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit ? "Mettez à jour les informations du véhicule." : "Créez un nouveau véhicule."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="vehicle-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: CK80212774794289" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Toyota" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Corolla" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 2024" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propriétaire</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Jean Dupont" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: bleu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Sélectionnez un type"
                      className="w-full"
                      items={[
                        { label: "Car", value: "Car" },
                        { label: "Truck", value: "Truck" },
                        { label: "SUV", value: "SUV" },
                        { label: "Van", value: "Van" },
                      ]}
                      isControlled
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poids</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 2742kg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>État</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Sélectionnez un état"
                      className="w-full"
                      items={[
                        { label: "Neuf", value: "Neuf" },
                        { label: "Occasion", value: "Occasion" },
                        { label: "Endommagé", value: "Endommagé" },
                      ]}
                      isControlled
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observation</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Notes supplémentaires..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="originCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays d'origine</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Latvia" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu d'embarquement</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Abidjan" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="isPrimed"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <input
                      id="is-primed"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <FormLabel htmlFor="is-primed">Apprêté (isPrimed)</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dischargeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discharge ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 6" inputMode="numeric" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit" form="vehicle-form" disabled={!form.formState.isValid || isCreating || isUpdating}>
            {isCreating || isUpdating ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


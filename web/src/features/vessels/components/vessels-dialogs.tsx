import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Vessel } from "../data/schema";
import { useCreateVessel, useUpdateVessel } from "../hooks/useVesselMutations";
import { useVesselsStore } from "../store/vessels-store";

const vesselFormSchema = z.object({
  imoNo: z.string().min(1, "IMO requis"),
  name: z.string().min(1, "Nom requis"),
  flag: z.string().optional().or(z.literal("")),
});
type VesselForm = z.infer<typeof vesselFormSchema>;

function VesselsUpsertDialog({ currentRow, open, onOpenChange }: { currentRow?: Vessel; open: boolean; onOpenChange: (open: boolean) => void }) {
  const isEdit = !!currentRow;
  const form = useForm<VesselForm>({
    defaultValues: {
      imoNo: currentRow?.imoNo ?? "",
      name: currentRow?.name ?? "",
      flag: currentRow?.flag ?? "",
    },
    resolver: zodResolver(vesselFormSchema),
    mode: "onChange",
  });

  const { mutateAsync: createMutate, isPending: isCreating } = useCreateVessel();
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateVessel();

  const onSubmit = async (data: VesselForm) => {
    try {
      if (isEdit && currentRow?.id) {
        await updateMutate({ id: currentRow.id, payload: { imoNo: data.imoNo, name: data.name, flag: data.flag || null } });
        toast.success("Navire mis à jour");
      } else {
        await createMutate({ imoNo: data.imoNo, name: data.name, flag: data.flag || null });
        toast.success("Navire créé");
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
          <DialogTitle>{isEdit ? "Modifier le navire" : "Ajouter un navire"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit ? "Mettez à jour les informations du navire." : "Créez un nouveau navire."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="vessel-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="imoNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMO</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 5871236" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: White LLC Vessel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pavillon</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Cyprus" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="vessel-form" disabled={isCreating || isUpdating}>
            {isEdit ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const VesselsDialogs = () => {
  const open = useVesselsStore((s) => s.open);
  const setOpen = useVesselsStore((s) => s.setOpen);
  const currentRow = useVesselsStore((s) => s.currentRow);
  const setCurrentRow = useVesselsStore((s) => s.setCurrentRow);

  return (
    <>
      <VesselsUpsertDialog
        key={currentRow ? `vessel-edit-${currentRow.id}` : `vessel-add`}
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
    </>
  );
};

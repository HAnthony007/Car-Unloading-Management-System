import { Icons } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { useVehiclesStore } from "../store/vehicles-store";

export const VehiclesAddButtons = () => {
  const setOpen = useVehiclesStore((s) => s.setOpen);
  return (
    <Button
      className="space-x-1 cursor-pointer"
      onClick={() => {
        setOpen("add");
      }}
    >
      <span>Ajouter un véhicule</span>
      <Icons.plusCircled size={18} />
    </Button>
  );
};

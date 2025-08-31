import { Icons } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { useVesselsStore } from "../store/vessels-store";

export const VesselsAddButtons = () => {
  const setOpen = useVesselsStore((s) => s.setOpen);
  return (
    <Button
      className="space-x-1 cursor-pointer"
      onClick={() => {
        setOpen("add");
      }}
    >
      <span>Ajouter un navire</span>
      <Icons.plusCircled size={18} />
    </Button>
  );
};

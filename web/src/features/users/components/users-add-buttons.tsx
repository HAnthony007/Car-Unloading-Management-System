import { Icons } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUsersStore } from "../store/users-store";

export const UsersAddButtons = () => {
  const setOpen = useUsersStore((s) => s.setOpen);
  return (
    <Button
      className="space-x-1 cursor-pointer"
      onClick={() => {
        setOpen("add");
        toast.success("Coming Soon");
      }}
    >
      <span>Add User</span>
      <Icons.addUser size={18} />
    </Button>
  );
};

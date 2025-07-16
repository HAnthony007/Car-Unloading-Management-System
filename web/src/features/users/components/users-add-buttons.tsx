import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUsers } from "../context/users-context";

export const UsersAddButtons = () => {
    const { setOpen } = useUsers();
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

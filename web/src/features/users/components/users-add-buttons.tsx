"use client";
import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const UsersAddButtons = () => {
    return (
        <Button
            className="space-x-1 cursor-pointer"
            onClick={() => toast.success("Coming Soon")}
        >
            <span>Add User</span>
            <Icons.addUser size={18} />
        </Button>
    );
};

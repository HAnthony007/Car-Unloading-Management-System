"use client";

import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ParkingsAddButtons = () => {
    // const { setOpen } = useParkings();
    return (
        <Button
            className="space-x-1 cursor-pointer"
            onClick={() => {
                // setOpen("add");
                toast.success("Coming Soon");
            }}
        >
            <span>Add Parking</span>
            <Icons.addParking size={18} />
        </Button>
    );
};

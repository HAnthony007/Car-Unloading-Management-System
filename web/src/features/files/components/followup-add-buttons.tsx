"use client";

import { Button } from "@/components/ui/button";
import { useFollowupOpenAddDialog } from "../store/followup-store";
import { Icons } from "@/components/icons/icon";

export const FollowupAddButtons = () => {
    const openAddDialog = useFollowupOpenAddDialog();

    return (
        <Button className="space-x-1 cursor-pointer" onClick={openAddDialog}>
            <span>Créer un dossier</span>
            <Icons.plus className="h-4 w-4" />
        </Button>
    );
};

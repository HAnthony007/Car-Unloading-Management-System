"use client";

import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import { useFollowupOpenAddDialog } from "../store/followup-store";

export const FollowupAddButtons = () => {
    const openAddDialog = useFollowupOpenAddDialog();

    return (
        <Button className="space-x-1 cursor-pointer" onClick={openAddDialog}>
            <span>Créer un dossier</span>
            <Icons.plus className="h-4 w-4" />
        </Button>
    );
};

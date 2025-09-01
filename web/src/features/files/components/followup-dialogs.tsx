"use client";

import { useFollowupOpen } from "../store/followup-store";
import { FollowupAddDialog } from "./followup-add-dialog";
import { FollowupEditDialog } from "./followup-edit-dialog";
import { FollowupViewDialog } from "./followup-view-dialog";

export const FollowupDialogs = () => {
    const open = useFollowupOpen();

    return (
        <>
            {open === "add" && <FollowupAddDialog />}
            {open === "edit" && <FollowupEditDialog />}
            {open === "view" && <FollowupViewDialog />}
        </>
    );
};

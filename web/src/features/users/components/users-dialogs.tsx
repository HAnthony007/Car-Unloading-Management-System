import { useUsers } from "../context/users-context";
import { UsersActionDialog } from "./users-action-dialog";
import { UsersDeleteDialog } from "./users-delete-dialog";

export const UsersDialogs = () => {
    const { open, setOpen, currentRow, setCurrentRow } = useUsers();

    return (
        <>
            <UsersActionDialog
                key="user-add"
                open={open === "add"}
                onOpenChange={(state) => setOpen(state ? "add" : null)}
            />

            {currentRow && (
                <>
                    <UsersActionDialog
                        key={`user-edit-${currentRow.id}`}
                        open={open === "edit"}
                        onOpenChange={(state) => {
                            if (!state) {
                                setOpen(null);
                                setTimeout(() => {
                                    setCurrentRow(null);
                                }, 500);
                            } else {
                                setOpen("edit");
                            }
                        }}
                        currentRow={currentRow}
                    />
                    <UsersDeleteDialog
                        key={`user-delete-${currentRow.id}`}
                        open={open === "delete"}
                        onOpenChange={() => {
                            setOpen("delete");
                            setTimeout(() => {
                                setCurrentRow(null);
                            }, 500);
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    );
};

import { Icons } from "@/components/icons/icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DialogConfirm } from "@/components/ui/dialog-confirm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import type { User } from "../data/schema";
import { useDeleteUser } from "../hooks/useUserMutations";
import { useUsersStore } from "../store/users-store";

interface UsersDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
}

export const UsersDeleteDialog = ({
  open,
  onOpenChange,
  currentRow,
}: UsersDeleteDialogProps) => {
  const [value, setValue] = useState("");

  const handleDelete = () => {
    // Compare with matriculationNumber if present, otherwise fallback to id
    const expected = currentRow.matriculationNumber || String(currentRow.id);
    if (value.trim() !== expected) return;
    // trigger deletion with callbacks
    deleteUserMutate(
      { id: currentRow.id },
      {
        onSuccess: () => {
          toast.success("Utilisateur supprimé");
          onOpenChange(false);
          setCurrentRow(null);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : String(err);
          toast.error("Suppression échouée: " + msg);
        },
      },
    );
  };

  const setCurrentRow = useUsersStore((s) => s.setCurrentRow);
  const { mutate: deleteUserMutate, isPending: isDeleting } = useDeleteUser();
  return (
    <DialogConfirm
      open={open}
      onOpenChange={onOpenChange}
  handleConfirm={handleDelete}
  disabled={value.trim() !== (currentRow.matriculationNumber || String(currentRow.id)) || isDeleting}
      title={
        <span className="text-destructive">
          <Icons.alertTriangle
            size={18}
            className="stroke-destructive mr-1 inline-block"
          />{" "}
          Delete User
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.email}</span> white
            registration number{" "}
            <span className="font-bold">{currentRow.id}</span>
            ?
            <br />
            This action will permanently delete the user with the role of{" "}
            <span className="font-bold">{currentRow.role.toUpperCase()}</span>{" "}
            from the system. This cannot be undone.
          </p>
          <Label className="my-2">
            Registration number:
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={`Enter ${currentRow.matriculationNumber ? 'matriculation number' : 'id'} to confirm deletion.`}
            />
          </Label>
          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
};

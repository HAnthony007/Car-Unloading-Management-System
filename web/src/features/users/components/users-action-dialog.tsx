"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { userRoles } from "../data/data";
import type { User } from "../data/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MAX_AVATAR_MB, ACCEPTED_IMAGE_TYPES } from "../lib/constants";
import {
  uploadUserAvatarAction,
  createUserAction,
  updateUserAction,
  deleteUserAvatarAction,
} from "../lib/server-actions";
import { useInvalidateUsers } from "../hooks/useInvalidateUsers";

interface UsersActionDialogProps {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// constants moved to shared lib

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Le nom complet est requis" })
    .max(120, { message: "Le nom est trop long" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, "Email is required"),
  matriculationNumber: z
    .string()
    .min(1, { message: "Le matricule est requis" })
    .max(30, { message: "Le matricule est trop long" }),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 6, {
      message: "Numéro invalide",
    }),
  avatar: z
    .any()
    .refine(
      (file) => file == null || file instanceof File,
      "Fichier invalide",
    )
    .refine(
      (file) => !file || file.size <= MAX_AVATAR_MB * 1024 * 1024,
      `L'image doit être ≤ ${MAX_AVATAR_MB}MB`,
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Formats acceptés: JPEG, PNG, WEBP, GIF",
    )
    .optional()
    .nullable(),
  role: z.enum(["admin", "user"], { message: "Role is required" }),
  isEdit: z.boolean(),
});

type UserForm = z.infer<typeof formSchema>;

export const UsersActionDialog = ({
  currentRow,
  open,
  onOpenChange,
}: UsersActionDialogProps) => {
  const isEdit = !!currentRow;
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const invalidateUsers = useInvalidateUsers();

  const form = useForm<UserForm>({
  defaultValues: isEdit
      ? {
          fullName: currentRow?.fullName ?? "",
          email: currentRow?.email ?? "",
          matriculationNumber: currentRow?.matriculationNumber ?? "",
          phone: currentRow?.phone ?? "",
    avatar: null,
          role: (currentRow?.role as UserForm["role"]) ?? "user",
          isEdit,
        }
      : {
          fullName: "",
          email: "",
          matriculationNumber: "",
          phone: "",
    avatar: null,
          role: "user",
          isEdit,
        },
    resolver: zodResolver(formSchema),
    mode: "onChange", // validation en temps réel
  });

  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open]);

  // Avatar preview lifecycle
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handlePickAvatar = () => fileInputRef.current?.click();
  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    form.setValue("avatar", file ?? null, { shouldValidate: true });
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    if (file) setAvatarPreview(URL.createObjectURL(file));
    else setAvatarPreview(null);
  };
  const handleClearAvatar = () => {
    form.setValue("avatar", null, { shouldValidate: true });
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteAvatarFromServer = async () => {
    if (!isEdit || !currentRow?.id) return;
    try {
      await deleteUserAvatarAction(process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL, currentRow.id);
      handleClearAvatar();
      toast.success("Avatar supprimé");
      invalidateUsers();
    } catch (e) {
      toast.error("Suppression avatar échouée: " + e);
    }
  };

  async function uploadAvatar(userId: string | number, file: File) {
    return uploadUserAvatarAction(
      process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
      userId,
      file,
    );
  }

  const onSubmit = async (data: UserForm) => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  if (isEdit && currentRow?.id) {
        await updateUserAction(baseUrl, currentRow.id, {
          fullName: data.fullName,
          email: data.email,
          matriculationNumber: data.matriculationNumber,
          phone: data.phone || null,
          role: data.role,
        });
        if (data.avatar instanceof File) {
          await uploadAvatar(currentRow.id, data.avatar);
        }
      } else {
        const created = await createUserAction(baseUrl, {
          fullName: data.fullName,
          email: data.email,
          matriculationNumber: data.matriculationNumber,
          phone: data.phone || null,
          role: data.role,
        });
        const newId = created?.data?.user_id ?? created?.data?.id ?? created?.user_id ?? created?.id;
        if (newId && data.avatar instanceof File) {
          await uploadAvatar(newId, data.avatar);
        }
      }
  invalidateUsers();
      form.reset();
      if (isEdit) {
        toast.success(data.avatar ? "User and avatar updated successfully" : "User updated successfully");
      } else {
        toast.success("User added successfully");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error("An error occurred. Please try again., " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <DialogTitle className="flex items-center gap-2">
                {isEdit ? (
                  <Icons.edit className="h-4 w-4 text-primary" />
                ) : (
                  <Icons.addUser className="h-4 w-4 text-primary" />
                )}
                {isEdit ? "Modifier l’utilisateur" : "Ajouter un utilisateur"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {isEdit
                  ? "Mettez à jour les informations de l’utilisateur."
                  : "Créez un nouvel utilisateur et assignez-lui un rôle."}
              </DialogDescription>
            </div>
            {isEdit && (
              <div className="shrink-0">
                <Avatar className="h-10 w-10 ring-1 ring-border">
                  <AvatarImage src={currentRow?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {(currentRow?.fullName || currentRow?.email || "?")
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </DialogHeader>

        {(isEdit || true) && (
          <div className="mb-2 -mt-2 flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {currentRow?.fullName || currentRow?.email}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentRow?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentRow?.role && (
                <Badge
                  className={
                    (currentRow?.role === "admin"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary") + " border-none capitalize"
                  }
                >
                  {currentRow?.role}
                </Badge>
              )}
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 ring-1 ring-border">
                  <AvatarImage src={avatarPreview || currentRow?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {(currentRow?.fullName || currentRow?.email || "?")
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button type="button" variant="outline" size="sm" onClick={handlePickAvatar}>
                  Importer
                </Button>
                {avatarPreview ? (
                  <Button type="button" variant="ghost" size="sm" onClick={handleClearAvatar}>
                    Supprimer
                  </Button>
                ) : isEdit && currentRow?.avatarUrl ? (
                  <Button type="button" variant="ghost" size="sm" onClick={handleDeleteAvatarFromServer}>
                    Supprimer
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
        <div className="-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
          <div className="mb-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Informations du compte
            </p>
          </div>
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="text-right col-span-2" htmlFor="user-fullname">
                      Nom complet <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="user-fullname"
                        ref={firstInputRef}
                        placeholder="ex: Jean Dupont"
                        className="col-span-4"
                        autoComplete="off"
                        aria-invalid={!!form.formState.errors.fullName}
                        aria-describedby="user-fullname-error"
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" id="user-fullname-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                    <FormLabel
                      className="text-right col-span-2"
                      htmlFor="user-email"
                    >
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="user-email"
                        // focus is managed on full name
                        placeholder="ex: jean.dupont@email.com"
                        className="col-span-4"
                        autoComplete="off"
                        aria-invalid={!!form.formState.errors.email}
                        aria-describedby="user-email-error"
                      />
                    </FormControl>
                    <div className="col-span-4 col-start-3 text-xs text-muted-foreground">
                      Une invitation sera envoyée à cette adresse.
                    </div>
                    <FormMessage
                      className="col-span-4 col-start-3"
                      id="user-email-error"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matriculationNumber"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="text-right col-span-2" htmlFor="user-matricule">
                      Matricule <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="user-matricule"
                        placeholder="ex: ADM001"
                        className="col-span-4"
                        autoComplete="off"
                        aria-invalid={!!form.formState.errors.matriculationNumber}
                        aria-describedby="user-matricule-error"
                      />
                    </FormControl>
                    <div className="col-span-4 col-start-3 text-xs text-muted-foreground">
                      Utilisez votre schéma (ex: ADM001, AGT123…).
                    </div>
                    <FormMessage className="col-span-4 col-start-3" id="user-matricule-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="text-right col-span-2" htmlFor="user-phone">
                      Téléphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="user-phone"
                        placeholder="ex: 034 12 345 67"
                        className="col-span-4"
                        autoComplete="tel"
                        inputMode="tel"
                        aria-invalid={!!form.formState.errors.phone}
                        aria-describedby="user-phone-error"
                      />
                    </FormControl>
                    <div className="col-span-4 col-start-3 text-xs text-muted-foreground">
                      Optionnel. Format libre.
                    </div>
                    <FormMessage className="col-span-4 col-start-3" id="user-phone-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                    <FormLabel
                      className="text-right col-span-2"
                      htmlFor="user-role"
                    >
                      Rôle <span className="text-destructive">*</span>
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Sélectionnez un rôle"
                      className="col-span-4"
                      items={userRoles.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                      aria-describedby="user-role-error"
                    />
                    <div className="col-span-4 col-start-3 text-xs text-muted-foreground">
                      Détermine les permissions et l’accès de l’utilisateur.
                    </div>
                    <FormMessage
                      className="col-span-4 col-start-3"
                      id="user-role-error"
                    />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            form="user-form"
            disabled={loading || !form.formState.isValid}
            aria-busy={loading}
          >
            {loading ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

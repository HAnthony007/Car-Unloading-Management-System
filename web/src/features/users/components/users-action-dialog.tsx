"use client";

import { Icons } from "@/components/icons/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { userRoles } from "../data/data";
import type { User } from "../data/schema";
import { userFormSchema, type UserForm } from "../data/user-form-schema";
import { useInvalidateUsers } from "../hooks/useInvalidateUsers";
import { useTemporaryAvatar } from "../hooks/useTemporaryAvatar";
import {
  useCreateUser,
  useDeleteUserAvatar,
  useUpdateUser,
  useUploadUserAvatar,
} from "../hooks/useUserMutations";

interface UsersActionDialogProps {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = userFormSchema;

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
  const { mutateAsync: createUserMutate, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUserMutate, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: uploadAvatarMutate, isPending: isUploading } = useUploadUserAvatar();
  const { mutateAsync: deleteAvatarMutate } = useDeleteUserAvatar();

  // Helpers
  const getInitials = (name?: string | null, email?: string | null) => {
    const source = (name && name.trim().length > 0 ? name : email) || "?";
    return source
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const makeDefaultValues = (row?: User | null): UserForm => ({
    fullName: row?.fullName ?? "",
    email: row?.email ?? "",
    matriculationNumber: row?.matriculationNumber ?? "",
    phone: row?.phone ?? "",
    avatar: null,
    role: (row?.role as UserForm["role"]) ?? "agent",
  });

  const form = useForm<UserForm>({
    defaultValues: makeDefaultValues(currentRow),
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Temporary signed avatar URL served by backend (returns JSON with data.url)
  const { data: tempAvatarUrl } = useTemporaryAvatar(currentRow?.id, open && isEdit);

  useEffect(() => {
    if (!open) return;
    form.reset(makeDefaultValues(currentRow));
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (firstInputRef.current) firstInputRef.current.focus();
  }, [open, currentRow, form]);

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
      await deleteAvatarMutate({ id: currentRow.id });
      handleClearAvatar();
      toast.success("Avatar supprimé");
      invalidateUsers();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error("Suppression avatar échouée: " + msg);
    }
  };

  async function uploadAvatar(userId: string | number, file: File) {
    await uploadAvatarMutate({ id: userId, file });
  }

  const onSubmit = async (data: UserForm) => {
    setLoading(true);
    try {
      if (isEdit && currentRow?.id) {
        await updateUserMutate({
          id: currentRow.id,
          payload: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || null,
            role: data.role ?? "agent",
          },
        });
        if (data.avatar instanceof File) {
          await uploadAvatar(currentRow.id, data.avatar);
        }
      } else {
        const payload: Record<string, any> = {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || null,
          role: data.role ?? "agent",
        };
        if (data.matriculationNumber && data.matriculationNumber.trim().length > 0) {
          payload.matriculationNumber = data.matriculationNumber;
        }

        const created = await createUserMutate(payload as any);
        const newId = created?.data?.user_id ?? created?.data?.id ?? created?.user_id ?? created?.id;
        const generatedMatriculation =
          created?.data?.matriculation_number ?? created?.matriculation_number ?? null;
        if (newId && data.avatar instanceof File) {
          await uploadAvatar(newId, data.avatar);
        }
        if (generatedMatriculation) {
          toast.success(`Utilisateur créé — Matricule: ${generatedMatriculation}`);
        }
      }

      invalidateUsers();
      form.reset(makeDefaultValues());
      handleClearAvatar();
      if (isEdit) {
        toast.success(data.avatar ? "Utilisateur et avatar mis à jour" : "Utilisateur mis à jour");
      } else {
        toast.success("Utilisateur créé");
      }
      onOpenChange(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const anyErr = e as any;

      if (anyErr?.response?.errors && typeof anyErr.response.errors === "object") {
        const errors = anyErr.response.errors as Record<string, string[]>;
        const keyMap: Record<string, { field: string; id: string }> = {
          matriculation_no: { field: "matriculationNumber", id: "user-matricule" },
          full_name: { field: "fullName", id: "user-fullname" },
          email: { field: "email", id: "user-email" },
          phone: { field: "phone", id: "user-phone" },
          role_id: { field: "role", id: "user-role" },
        };

        let firstField: string | null = null;
        let firstMessage: string | null = null;
        let focusId: string | null = null;

        // Clear previous server errors
        // (keeps client-side validation messages intact)
        // We only clear fields we are about to set to avoid stomping unrelated errors.
        const keysToSet: string[] = [];
        Object.entries(errors).forEach(([k]) => keysToSet.push(k));
        // fallback helper: convert snake_case -> camelCase
        const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

        Object.entries(errors).forEach(([key, msgs]) => {
          // handle cases like "email[0]" or "email.0"
          const base = String(key).split(/[.\[]/)[0];
          const mapping = keyMap[key] ?? keyMap[base] ?? null;
          const fallbackField = (() => {
            // try direct base
            if (base in form.getValues()) return base;
            // try snake->camel
            const camel = snakeToCamel(base);
            if (camel in form.getValues()) return camel;
            // as last resort, return base
            return base;
          })();
          const fieldName = mapping ? mapping.field : fallbackField;
          const id = mapping ? mapping.id : `user-${fieldName}`;
          const message = Array.isArray(msgs) ? msgs.join(" ") : String(msgs);
          if (!firstField) {
            firstField = fieldName;
            firstMessage = message;
            focusId = id;
          }
          form.setError(fieldName as any, { type: "server", message });
        });

        if (focusId) {
          setTimeout(() => {
            const id = focusId as string;
            const input = document.getElementById(id);
            input?.focus();
          }, 50);
        }

        // Prefer the exact first server validation message if available
  let serverMessage: string | null = firstMessage ?? null;
        if (!serverMessage) {
          for (const val of Object.values(errors)) {
            if (Array.isArray(val) && val.length > 0 && val[0]) {
              serverMessage = String(val[0]);
              break;
            }
            if (typeof val === "string" && val) {
              serverMessage = val;
              break;
            }
          }
        }

        toast.error(serverMessage ?? anyErr.response?.message ?? msg ?? "Validation failed");
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer. " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset(makeDefaultValues());
          handleClearAvatar();
        }
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
            <div className="shrink-0">
              <Avatar className="h-10 w-10 ring-1 ring-border">
                <AvatarImage src={avatarPreview || tempAvatarUrl || currentRow?.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(currentRow?.fullName ?? form.watch("fullName"), currentRow?.email ?? form.watch("email"))}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </DialogHeader>

        <div className="mb-2 -mt-2 flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {form.watch("fullName") || currentRow?.fullName || form.watch("email") || currentRow?.email || "Nouvel utilisateur"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {form.watch("email") || currentRow?.email || ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {(() => {
              const role = form.watch("role") || (currentRow?.role as UserForm["role"] | undefined);
              return role ? (
                <Badge
                  className={
                    (role === "admin"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary") + " border-none capitalize"
                  }
                >
                  {role}
                </Badge>
              ) : null;
            })()}
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 ring-1 ring-border">
                <AvatarImage src={avatarPreview || tempAvatarUrl || currentRow?.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(currentRow?.fullName ?? form.watch("fullName"), currentRow?.email ?? form.watch("email"))}
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
                        ref={(el) => {
                          field.ref(el);
                          firstInputRef.current = el as HTMLInputElement | null;
                        }}
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
              {isEdit ? (
                <FormField
                  control={form.control}
                  name="matriculationNumber"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2" htmlFor="user-matricule">
                        Matricule
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
                          disabled
                        />
                      </FormControl>
                      <div className="col-span-4 col-start-3 text-xs text-muted-foreground">
                        Matricule géré automatiquement. Non modifiable.
                      </div>
                      <FormMessage className="col-span-4 col-start-3" id="user-matricule-error" />
                    </FormItem>
                  )}
                />
              ) : null}
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
            disabled={loading || isCreating || isUpdating || isUploading || !form.formState.isValid}
            aria-busy={loading}
          >
            {loading || isCreating || isUpdating || isUploading ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

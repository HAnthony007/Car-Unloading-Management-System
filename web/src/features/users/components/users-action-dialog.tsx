"use client";

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
import { z } from "zod";
import { userRoles } from "../data/data";
import type { User } from "../data/schema";

interface UsersActionDialogProps {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, "Email is required"),
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

  const form = useForm<UserForm>({
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          email: "",
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

  const onSubmit = async (data: UserForm) => {
    setLoading(true);
    try {
      console.log(data);
      await new Promise((res) => setTimeout(res, 1000)); // Simule un appel API
      form.reset();
      if (isEdit) {
        toast.success("User updated successfully");
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
          <DialogTitle>{isEdit ? "Edit User" : "Add new User"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the user here." : "Create new user here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                    <FormLabel
                      className="text-right col-span-2"
                      htmlFor="user-email"
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="user-email"
                        ref={firstInputRef}
                        placeholder="ex: jean.dupont@email.com"
                        className="col-span-4"
                        autoComplete="off"
                        aria-invalid={!!form.formState.errors.email}
                        aria-describedby="user-email-error"
                      />
                    </FormControl>
                    <FormMessage
                      className="col-span-4 col-start-3"
                      id="user-email-error"
                    />
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
                      Role
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
        <DialogFooter>
          <Button
            type="submit"
            form="user-form"
            disabled={loading || !form.formState.isValid}
            aria-busy={loading}
          >
            {loading ? "Enregistrement..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

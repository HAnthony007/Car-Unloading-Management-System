"use client";

import { Icons } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, type loginSchemaType } from "../data/login-schema";
import { useLogin } from "../hooks/useAuth";

export const LoginForm = ({ className }: ComponentProps<"div">) => {
  const router = useRouter();
  const { mutate, isPending, error } = useLogin();
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: loginSchemaType) => {
    mutate(data, {
      onSuccess: () => router.push("/dashboard"),
    });
  };

  useEffect(() => {
    if (error) {
      toast.error((error as Error).message);
    }
  }, [error]);

  return (
    <Form {...form}>
      <form
        id="login-form"
        className={cn(className, "grid gap-4")}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="m@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="********"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isPending ? (
          <Button className="w-full gap-4 cursor-wait" disabled>
            <Icons.spinner className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full gap-4 cursor-pointer"
            disabled={isPending}
          >
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

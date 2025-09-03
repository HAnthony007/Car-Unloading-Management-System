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
import { useRouter, useSearchParams } from "next/navigation";
import { type ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, type loginSchemaType } from "../data/login-schema";
import { useLogin } from "../hooks/useAuth";

export const LoginForm = ({ className }: ComponentProps<"div">) => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      onSuccess: () => {
        // show a welcome toast using the submitted email
        try {
          toast.success(`Bienvenue${data.email ? `, ${data.email}` : ""}`);
        } catch {}
        // Compute safe redirect target from query param
        const rawFrom = searchParams.get("from");
        let target = "/dashboard";
        if (rawFrom) {
          try {
            const decoded = decodeURIComponent(rawFrom);
            const isPath = decoded.startsWith("/") && !decoded.startsWith("//");
            const notLogin = !decoded.startsWith("/login");
            if (isPath && notLogin) target = decoded;
          } catch {
            // ignore malformed
          }
        }
        if (typeof window !== "undefined") {
          window.location.assign(target);
        } else {
          // Fallback (shouldn't happen in client component)
          router.push("/dashboard");
        }
      },
      onError: (e: any) => {
        // Map server validation errors (422) to form fields and toast
        const resp = e?.response;
        const errors = resp?.errors as Record<string, string[] | string> | undefined;
        // Attach field errors if present
        if (errors && typeof errors === "object") {
          const keyMap: Record<string, keyof loginSchemaType> = {
            email: "email",
            password: "password",
          };
          const seen = new Set<string>();
          Object.entries(errors).forEach(([rawKey, msgs]) => {
            const normKey = rawKey.replace(/\[\d+\]|\.\d+/g, "");
            const field = (keyMap[normKey] ?? (normKey as keyof loginSchemaType));
            if (!seen.has(String(field))) {
              const message = Array.isArray(msgs) ? msgs[0] : String(msgs);
              form.setError(field, { type: "server", message });
              seen.add(String(field));
            }
          });
        }
        // Show the exact server message in a toast
        let serverMessage: string | null = null;
        if (errors && typeof errors === "object") {
          const firstField = Object.keys(errors)[0];
          const firstMsg = firstField ? (Array.isArray((errors as any)[firstField]) ? (errors as any)[firstField][0] : (errors as any)[firstField]) : null;
          if (firstMsg) serverMessage = String(firstMsg);
        }
        if (!serverMessage) serverMessage = resp?.message || (e instanceof Error ? e.message : "Login failed");
        if (serverMessage) toast.error(serverMessage);
      },
    });
  };

  useEffect(() => {
    // Fallback toast only if there is no structured server response (onError already handled 422)
    if (error) {
      const err: any = error;
      if (!err?.response) {
        const message = (error as Error).message;
        if (message) toast.error(message);
      }
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

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps, Suspense } from "react";
import { RegisterForm } from "./components/register-form";
import { RegisterFormSkeleton } from "./components/register-form-skeleton";
export const Register = ({ className, ...props }: ComponentProps<"div">) => {
    return (
        <div
            className={cn(className, "min-h-full px-6 grid place-items-center")}
            {...props}
        >
            <div className="grid gap-10">
                <div className="text-center">
                    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                        <span className="text-primary-100">Join</span> X
                    </h3>
                    <p className="text-xl text-muted-foreground">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit
                        Explicabo
                    </p>
                </div>
                <div className="grid gap-4">
                    <Suspense fallback={<RegisterFormSkeleton />}>
                        <RegisterForm />
                    </Suspense>

                    <div className="text-sm font-medium leading-none">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            prefetch={true}
                            className="underline"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

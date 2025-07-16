"use client";

import { Main } from "@/components/layout/main";
import { useEffect, useState } from "react";
import { UsersAddButtons } from "./components/users-add-buttons";
import { UsersColumns } from "./components/users-columns";
import { UsersDataTable } from "./components/users-data-table";
import { UsersDialogs } from "./components/users-dialogs";
import UsersContextProvider from "./context/users-context";
import { User } from "./data/schema";
import { FetchUsers } from "./data/users";

export default function Users() {
    const [data, setData] = useState<User[]>([]);

    useEffect(() => {
        FetchUsers().then(setData);
    }, []);

    return (
        <UsersContextProvider>
            <Main>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Users list{" "}
                        </h2>
                        <p className="text-muted-foreground">
                            Manage your users and their roles here.
                        </p>
                    </div>
                    <UsersAddButtons />
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <UsersDataTable columns={UsersColumns} data={data} />
                </div>
            </Main>
            <UsersDialogs />
        </UsersContextProvider>
    );
}

"use client";

import { User } from "./schema";

export const FetchUsers = async (): Promise<User[]> => {
    return [
        {
            id: "1",
            email: "admin@example.com",
            role: "admin",
        },
        {
            id: "2",
            email: "user@example.com",
            role: "user",
        },
        {
            id: "3",
            email: "user2@example.com",
            role: "user",
        },
        {
            id: "4",
            email: "user3@example.com",
            role: "user",
        },
    ];
};

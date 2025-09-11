import { useCallback, useState } from "react";
import { CategoryBlock, ChecklistItem, ItemStatus } from "../types";
import { INITIAL_CATEGORIES } from "../data/categories";

export function useInspection() {
    const [categories, setCategories] =
        useState<CategoryBlock[]>(INITIAL_CATEGORIES);

    const updateItem = useCallback(
        (catKey: string, itemId: string, patch: Partial<ChecklistItem>) => {
            setCategories((prev) =>
                prev.map((c) =>
                    c.key === catKey
                        ? {
                              ...c,
                              items: c.items.map((it) =>
                                  it.id === itemId ? { ...it, ...patch } : it
                              ),
                          }
                        : c
                )
            );
        },
        []
    );

    const addPhoto = useCallback((catKey: string, itemId: string) => {
        setCategories((prev) =>
            prev.map((c) => {
                if (c.key !== catKey) return c;
                return {
                    ...c,
                    items: c.items.map((it) => {
                        if (it.id !== itemId) return it;
                        return {
                            ...it,
                            photos: [
                                ...it.photos,
                                `https://via.placeholder.com/120x90?text=${Math.random().toString(36).slice(2, 5)}`,
                            ].slice(0, 4),
                        };
                    }),
                };
            })
        );
    }, []);

    const setStatus = useCallback(
        (catKey: string, id: string, status: ItemStatus) => {
            updateItem(catKey, id, { status });
        },
        [updateItem]
    );

    const setComment = useCallback(
        (catKey: string, id: string, comment: string) => {
            updateItem(catKey, id, { comment });
        },
        [updateItem]
    );

    return {
        categories,
        setCategories,
        updateItem,
        addPhoto,
        setStatus,
        setComment,
    };
}

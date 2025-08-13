import { create } from "zustand";
import { FollowupFile } from "../data/schema";

interface FollowupState {
    // État des dialogues
    open: string | null;
    selectedFile: FollowupFile | null;
    isEditing: boolean;

    // Actions
    setOpen: (action: string | null) => void;
    setSelectedFile: (file: FollowupFile | null) => void;
    setIsEditing: (editing: boolean) => void;

    // Actions combinées pour les dialogues
    openAddDialog: () => void;
    openEditDialog: (file: FollowupFile) => void;
    openViewDialog: (file: FollowupFile) => void;
    closeDialog: () => void;

    // Reset de l'état
    reset: () => void;
}

const initialState = {
    open: null,
    selectedFile: null,
    isEditing: false,
};

export const useFollowupStore = create<FollowupState>((set) => ({
    ...initialState,

    setOpen: (action) => set({ open: action }),

    setSelectedFile: (file) => set({ selectedFile: file }),

    setIsEditing: (editing) => set({ isEditing: editing }),

    openAddDialog: () =>
        set({
            open: "add",
            selectedFile: null,
            isEditing: false,
        }),

    openEditDialog: (file) =>
        set({
            open: "edit",
            selectedFile: file,
            isEditing: true,
        }),

    openViewDialog: (file) =>
        set({
            open: "view",
            selectedFile: file,
            isEditing: false,
        }),

    closeDialog: () =>
        set({
            open: null,
            selectedFile: null,
            isEditing: false,
        }),

    reset: () => set(initialState),
}));

// Sélecteurs pour optimiser les re-renders
export const useFollowupOpen = () => useFollowupStore((state) => state.open);
export const useFollowupSelectedFile = () =>
    useFollowupStore((state) => state.selectedFile);
export const useFollowupIsEditing = () =>
    useFollowupStore((state) => state.isEditing);

// Actions individuelles pour éviter les re-renders inutiles
export const useFollowupSetOpen = () =>
    useFollowupStore((state) => state.setOpen);
export const useFollowupSetSelectedFile = () =>
    useFollowupStore((state) => state.setSelectedFile);
export const useFollowupSetIsEditing = () =>
    useFollowupStore((state) => state.setIsEditing);

// Actions combinées avec références stables
export const useFollowupOpenAddDialog = () =>
    useFollowupStore((state) => state.openAddDialog);
export const useFollowupOpenEditDialog = () =>
    useFollowupStore((state) => state.openEditDialog);
export const useFollowupOpenViewDialog = () =>
    useFollowupStore((state) => state.openViewDialog);
export const useFollowupCloseDialog = () =>
    useFollowupStore((state) => state.closeDialog);
export const useFollowupReset = () => useFollowupStore((state) => state.reset);

// Hook pour toutes les actions (utiliser avec précaution)
export const useFollowupActions = () => {
    const setOpen = useFollowupSetOpen();
    const setSelectedFile = useFollowupSetSelectedFile();
    const setIsEditing = useFollowupSetIsEditing();
    const openAddDialog = useFollowupOpenAddDialog();
    const openEditDialog = useFollowupOpenEditDialog();
    const openViewDialog = useFollowupOpenViewDialog();
    const closeDialog = useFollowupCloseDialog();
    const reset = useFollowupReset();

    return {
        setOpen,
        setSelectedFile,
        setIsEditing,
        openAddDialog,
        openEditDialog,
        openViewDialog,
        closeDialog,
        reset,
    };
};

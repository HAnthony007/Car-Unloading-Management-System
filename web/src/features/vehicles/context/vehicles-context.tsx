"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Vehicle } from "../data/schema";

interface VehiclesContextType {
    selectedVehicle: Vehicle | null;
    setSelectedVehicle: (vehicle: Vehicle | null) => void;
    viewDialogOpen: boolean;
    setViewDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    addDialogOpen: boolean;
    setAddDialogOpen: (open: boolean) => void;
}

const VehiclesContext = createContext<VehiclesContextType | undefined>(
    undefined
);

export function useVehiclesContext() {
    const context = useContext(VehiclesContext);
    if (context === undefined) {
        throw new Error(
            "useVehiclesContext must be used within a VehiclesContextProvider"
        );
    }
    return context;
}

interface VehiclesContextProviderProps {
    children: ReactNode;
}

export default function VehiclesContextProvider({
    children,
}: VehiclesContextProviderProps) {
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null
    );
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const value: VehiclesContextType = {
        selectedVehicle,
        setSelectedVehicle,
        viewDialogOpen,
        setViewDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        addDialogOpen,
        setAddDialogOpen,
    };

    return (
        <VehiclesContext.Provider value={value}>
            {children}
        </VehiclesContext.Provider>
    );
}

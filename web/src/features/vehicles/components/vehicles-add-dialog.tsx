"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useVehiclesContext } from "../context/vehicles-context";
import { vehicleStatuses, vehicleTypes } from "../data/schema";

export function VehiclesAddDialog() {
    const { addDialogOpen, setAddDialogOpen } = useVehiclesContext();
    const [formData, setFormData] = useState({
        plateNumber: "",
        brand: "",
        model: "",
        year: "",
        type: "",
        status: "available",
        capacity: "",
        driver: "",
        lastMaintenance: "",
        notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ici vous pouvez ajouter la logique pour créer le nouveau véhicule
        console.log("Créer le véhicule:", formData);
        setAddDialogOpen(false);
        // Réinitialiser le formulaire
        setFormData({
            plateNumber: "",
            brand: "",
            model: "",
            year: "",
            type: "",
            status: "available",
            capacity: "",
            driver: "",
            lastMaintenance: "",
            notes: "",
        });
    };

    return (
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations pour ajouter un nouveau
                        véhicule à la flotte
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="plateNumber">
                                Plaque d'immatriculation *
                            </Label>
                            <Input
                                id="plateNumber"
                                value={formData.plateNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        plateNumber: e.target.value,
                                    })
                                }
                                placeholder="AB-123-CD"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand">Marque *</Label>
                            <Input
                                id="brand"
                                value={formData.brand}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        brand: e.target.value,
                                    })
                                }
                                placeholder="Renault"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="model">Modèle *</Label>
                            <Input
                                id="model"
                                value={formData.model}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        model: e.target.value,
                                    })
                                }
                                placeholder="Master"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Année *</Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        year: e.target.value,
                                    })
                                }
                                placeholder="2020"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type de véhicule *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, type: value })
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleTypes.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Statut initial</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, status: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleStatuses.map((status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacité (kg)</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        capacity: e.target.value,
                                    })
                                }
                                placeholder="1200"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="driver">Chauffeur assigné</Label>
                            <Input
                                id="driver"
                                value={formData.driver}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        driver: e.target.value,
                                    })
                                }
                                placeholder="Jean Dupont"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastMaintenance">
                            Date de mise en service
                        </Label>
                        <Input
                            id="lastMaintenance"
                            type="date"
                            value={formData.lastMaintenance}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    lastMaintenance: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                })
                            }
                            placeholder="Informations supplémentaires, équipements spéciaux..."
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setAddDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit">Ajouter le véhicule</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

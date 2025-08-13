"use client";

import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { toast } from "sonner";
import { createFollowupFile } from "../data/followup";
import { FollowupFileFormData } from "../data/schema";
import { useFollowupCloseDialog } from "../store/followup-store";

export const FollowupAddDialog = () => {
    const closeDialog = useFollowupCloseDialog();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FollowupFileFormData>({
        reference_number: "",
        vehicle_id: "",
        port_call_id: "",
        priority: "Moyenne",
        assigned_inspector: "",
        notes: "",
        estimated_completion_date: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createFollowupFile(formData);
            toast.success("Dossier de suivi créé avec succès");
            closeDialog();
            setFormData({
                reference_number: "",
                vehicle_id: "",
                port_call_id: "",
                priority: "Moyenne",
                assigned_inspector: "",
                notes: "",
                estimated_completion_date: "",
            });
        } catch (error) {
            toast.error("Erreur lors de la création du dossier");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        field: keyof FollowupFileFormData,
        value: string
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={true} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Créer un nouveau dossier de suivi
                    </DialogTitle>
                    <DialogDescription>
                        Remplissez les informations pour créer un nouveau
                        dossier de suivi pour un véhicule débarqué.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reference_number">
                                Numéro de référence{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="reference_number"
                                value={formData.reference_number}
                                onChange={(e) =>
                                    handleInputChange(
                                        "reference_number",
                                        e.target.value
                                    )
                                }
                                placeholder="FU-2024-XXX"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">
                                Priorité <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) =>
                                    handleInputChange("priority", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Faible">
                                        Faible
                                    </SelectItem>
                                    <SelectItem value="Moyenne">
                                        Moyenne
                                    </SelectItem>
                                    <SelectItem value="Élevée">
                                        Élevée
                                    </SelectItem>
                                    <SelectItem value="Urgente">
                                        Urgente
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="vehicle_id">
                                ID du véhicule{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="vehicle_id"
                                value={formData.vehicle_id}
                                onChange={(e) =>
                                    handleInputChange(
                                        "vehicle_id",
                                        e.target.value
                                    )
                                }
                                placeholder="V001"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="port_call_id">
                                ID de l&apos;appel d&apos;escale{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="port_call_id"
                                value={formData.port_call_id}
                                onChange={(e) =>
                                    handleInputChange(
                                        "port_call_id",
                                        e.target.value
                                    )
                                }
                                placeholder="PC-2024-XXX"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assigned_inspector">
                            Inspecteur assigné
                        </Label>
                        <Input
                            id="assigned_inspector"
                            value={formData.assigned_inspector}
                            onChange={(e) =>
                                handleInputChange(
                                    "assigned_inspector",
                                    e.target.value
                                )
                            }
                            placeholder="Nom de l'inspecteur"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estimated_completion_date">
                            Date d&apos;échéance estimée
                        </Label>
                        <Input
                            id="estimated_completion_date"
                            type="date"
                            value={formData.estimated_completion_date}
                            onChange={(e) =>
                                handleInputChange(
                                    "estimated_completion_date",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) =>
                                handleInputChange("notes", e.target.value)
                            }
                            placeholder="Informations supplémentaires, observations..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="flex space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDialog}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                <>
                                    <Icons.plus className="mr-2 h-4 w-4" />
                                    Créer le dossier
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

"use client";

import { Icons } from "@/components/icons/icon";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateFollowupFile } from "../data/followup";
import { FollowupFile } from "../data/schema";
import {
    useFollowupCloseDialog,
    useFollowupSelectedFile,
} from "../store/followup-store";

export const FollowupEditDialog = () => {
    const selectedFile = useFollowupSelectedFile();
    const closeDialog = useFollowupCloseDialog();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<FollowupFile>>({});

    useEffect(() => {
        if (selectedFile) {
            setFormData({
                status: selectedFile.status,
                priority: selectedFile.priority,
                assigned_inspector: selectedFile.assigned_inspector || "",
                notes: selectedFile.notes || "",
                estimated_completion_date:
                    selectedFile.estimated_completion_date || "",
                actual_completion_date:
                    selectedFile.actual_completion_date || "",
            });
        }
    }, [selectedFile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setLoading(true);

        try {
            await updateFollowupFile(selectedFile.id, formData);
            toast.success("Dossier de suivi mis à jour avec succès");
            closeDialog();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du dossier");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof FollowupFile, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (!selectedFile) return null;

    return (
        <Dialog open={true} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Modifier le dossier de suivi
                    </DialogTitle>
                    <DialogDescription>
                        Modifiez les informations du dossier{" "}
                        {selectedFile.reference_number}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Statut <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.status || selectedFile.status}
                                onValueChange={(value) =>
                                    handleInputChange("status", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ouvert">
                                        Ouvert
                                    </SelectItem>
                                    <SelectItem value="En attente">
                                        En attente
                                    </SelectItem>
                                    <SelectItem value="Fermé">Fermé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">
                                Priorité <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={
                                    formData.priority || selectedFile.priority
                                }
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

                    <div className="space-y-2">
                        <Label htmlFor="assigned_inspector">
                            Inspecteur assigné
                        </Label>
                        <Input
                            id="assigned_inspector"
                            value={formData.assigned_inspector || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "assigned_inspector",
                                    e.target.value
                                )
                            }
                            placeholder="Nom de l'inspecteur"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="estimated_completion_date">
                                Date d&apos;échéance estimée
                            </Label>
                            <Input
                                id="estimated_completion_date"
                                type="date"
                                value={formData.estimated_completion_date || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        "estimated_completion_date",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="actual_completion_date">
                                Date de completion réelle
                            </Label>
                            <Input
                                id="actual_completion_date"
                                type="date"
                                value={formData.actual_completion_date || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        "actual_completion_date",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes || ""}
                            onChange={(e) =>
                                handleInputChange("notes", e.target.value)
                            }
                            placeholder="Informations supplémentaires, observations..."
                            rows={3}
                        />
                    </div>

                    {/* Informations en lecture seule */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-sm text-muted-foreground">
                            Informations en lecture seule
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">
                                    Référence:
                                </span>
                                <p className="font-medium">
                                    {selectedFile.reference_number}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Véhicule ID:
                                </span>
                                <p className="font-medium">
                                    {selectedFile.vehicle_id}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Port Call ID:
                                </span>
                                <p className="font-medium">
                                    {selectedFile.port_call_id}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Date de création:
                                </span>
                                <p className="font-medium">
                                    {new Date(
                                        selectedFile.created_at
                                    ).toLocaleDateString("fr-FR")}
                                </p>
                            </div>
                        </div>
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
                                    Mise à jour...
                                </>
                            ) : (
                                <>
                                    <Icons.save className="mr-2 h-4 w-4" />
                                    Sauvegarder
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

"use client";

import { Icons } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDocks } from "@/features/wharves/hooks/useDocks";
import type { Dock } from "@/features/wharves/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { PortCall } from "../data/schema";
import { getPortCallById, updatePortCall } from "../lib/portcalls";

export default function PortCallEditClient({ id }: { id: number }) {
    const router = useRouter();
    const [initial, setInitial] = useState<PortCall | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        data: docksData,
        isLoading: docksLoading,
        isError: docksError,
    } = useDocks();
    const docks: Dock[] = useMemo(() => docksData?.data ?? [], [docksData]);

    // Local form state
    const [form, setForm] = useState({
        vessel_agent: "",
        origin_port: "",
        estimated_arrival: "",
        arrival_date: "",
        estimated_departure: "",
        departure_date: "",
        vessel_id: 0,
        dock_id: 0,
    });

    // Helpers to format date-time values correctly for inputs and API
    function toDateOnly(value?: string | null): string {
        if (!value) return "";
        // Accepts ISO or any date string parseable by Date
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        const pad = (n: number) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        return `${yyyy}-${mm}-${dd}`; // suitable for input[type=date]
    }

    function toApiDate(value?: string | null): string | null {
        if (!value) return null;
        // Keep as YYYY-MM-DD, backend has date rules accepting date-only
        return value;
    }

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getPortCallById(id)
            .then((pc) => {
                if (!mounted) return;
                setInitial(pc);
                setForm({
                    vessel_agent: pc.vessel_agent ?? "",
                    origin_port: pc.origin_port ?? "",
                    estimated_arrival: toDateOnly(pc.estimated_arrival),
                    arrival_date: toDateOnly(pc.arrival_date),
                    estimated_departure: toDateOnly(pc.estimated_departure),
                    departure_date: toDateOnly(pc.departure_date),
                    vessel_id: pc.vessel_id,
                    dock_id: pc.dock_id,
                });
                setError(null);
            })
            .catch((e) => setError(e.message || "Erreur lors du chargement"))
            .finally(() => setLoading(false));
        return () => {
            mounted = false;
        };
    }, [id]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                vessel_agent: form.vessel_agent || undefined,
                origin_port: form.origin_port || undefined,
                estimated_arrival: toApiDate(form.estimated_arrival),
                arrival_date: toApiDate(form.arrival_date),
                estimated_departure: toApiDate(form.estimated_departure),
                departure_date: toApiDate(form.departure_date),
                vessel_id: form.vessel_id || undefined,
                dock_id: form.dock_id || undefined,
            };
            await updatePortCall(id, payload);
            toast.success("Port call mis à jour");
            router.push(`/dashboard/operation/port-call/${id}`);
        } catch (e: any) {
            toast.error(e?.message ?? "Échec de la mise à jour");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <Icons.spinner className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !initial) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <Icons.alertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Erreur</h3>
                        <p className="text-muted-foreground mb-4">
                            {error ?? "Port call introuvable"}
                        </p>
                        <Button
                            onClick={() =>
                                router.push("/dashboard/operation/port-call")
                            }
                        >
                            Retour
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.push(`/dashboard/operation/port-call/${id}`)
                        }
                        className="flex items-center gap-2"
                    >
                        <Icons.arrowLeft className="h-4 w-4" />
                        Retour
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Modifier Port Call #{initial.port_call_id}
                        </h1>
                        <p className="text-muted-foreground">
                            Éditer les informations et le quai d'accostage
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                    <CardDescription>Champs modifiables</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Ligne 1: Agent / Port d'origine */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="vessel_agent">
                                    Agent du navire
                                </Label>
                                <Input
                                    id="vessel_agent"
                                    name="vessel_agent"
                                    value={form.vessel_agent}
                                    onChange={onChange}
                                    placeholder="Agent"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="origin_port">
                                    Port d'origine
                                </Label>
                                <Input
                                    id="origin_port"
                                    name="origin_port"
                                    value={form.origin_port}
                                    onChange={onChange}
                                    placeholder="Origine"
                                />
                            </div>
                        </div>

                        {/* Dock */}
                        <div className="space-y-2">
                            <Label>Quai (dock)</Label>
                            <Select
                                value={String(form.dock_id || "")}
                                onValueChange={(v) =>
                                    setForm((f) => ({
                                        ...f,
                                        dock_id: Number(v),
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            docksLoading
                                                ? "Chargement..."
                                                : "Sélectionner un quai"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {docks.map((d) => (
                                        <SelectItem
                                            key={d.dock_id}
                                            value={String(d.dock_id)}
                                        >
                                            {d.dock_name} (#{d.dock_id})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {docksError && (
                                <p className={cn("text-sm text-red-500")}>
                                    Impossible de charger les quais
                                </p>
                            )}
                        </div>

                        {/* Arrivée row: ETA + Arrivée */}
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <Icons.calendar className="h-4 w-4 text-green-600" />{" "}
                                Arrivée
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="estimated_arrival">
                                        ETA
                                    </Label>
                                    <Input
                                        id="estimated_arrival"
                                        name="estimated_arrival"
                                        type="date"
                                        value={form.estimated_arrival ?? ""}
                                        onChange={onChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="arrival_date">
                                        Arrivée effective
                                    </Label>
                                    <Input
                                        id="arrival_date"
                                        name="arrival_date"
                                        type="date"
                                        value={form.arrival_date ?? ""}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Départ row: ETD + Départ */}
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <Icons.calendar className="h-4 w-4 text-red-600" />{" "}
                                Départ
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="estimated_departure">
                                        ETD
                                    </Label>
                                    <Input
                                        id="estimated_departure"
                                        name="estimated_departure"
                                        type="date"
                                        value={form.estimated_departure ?? ""}
                                        onChange={onChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="departure_date">
                                        Départ effectif
                                    </Label>
                                    <Input
                                        id="departure_date"
                                        name="departure_date"
                                        type="date"
                                        value={form.departure_date ?? ""}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.push(
                                        `/dashboard/operation/port-call/${id}`
                                    )
                                }
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

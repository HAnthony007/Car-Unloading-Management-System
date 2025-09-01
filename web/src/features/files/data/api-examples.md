# Exemples d'utilisation de l'API Follow-Up

Ce document fournit des exemples concrets d'utilisation des fonctions de l'API pour la gestion des dossiers de suivi.

## 📋 Récupération des données

### Récupérer tous les dossiers de suivi

```typescript
import { fetchFollowupFiles } from "./followup";

// Récupération simple
const files = await fetchFollowupFiles();

// Avec gestion d'erreur
try {
    const files = await fetchFollowupFiles();
    console.log(`Récupéré ${files.length} dossiers`);
} catch (error) {
    console.error("Erreur lors de la récupération:", error);
}
```

### Utilisation dans un composant React

```typescript
import { useEffect, useState } from "react";
import { fetchFollowupFiles, FollowupFile } from "./followup";

function FollowupList() {
    const [files, setFiles] = useState<FollowupFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                setLoading(true);
                const data = await fetchFollowupFiles();
                setFiles(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Erreur inconnue"
                );
            } finally {
                setLoading(false);
            }
        };

        loadFiles();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div>
            {files.map((file) => (
                <div key={file.id}>{file.reference_number}</div>
            ))}
        </div>
    );
}
```

## ➕ Création de dossiers

### Créer un nouveau dossier de suivi

```typescript
import { createFollowupFile, FollowupFileFormData } from "./followup";

const newFileData: FollowupFileFormData = {
    reference_number: "FU-2024-004",
    vehicle_id: "V004",
    port_call_id: "PC-2024-004",
    priority: "Élevée",
    assigned_inspector: "Marie Dupont",
    notes: "Véhicule de luxe, traitement prioritaire requis",
    estimated_completion_date: "2024-02-15",
};

try {
    const newFile = await createFollowupFile(newFileData);
    console.log("Dossier créé:", newFile.id);
} catch (error) {
    console.error("Erreur lors de la création:", error);
}
```

### Formulaire de création avec validation

```typescript
import { useState } from "react";
import { createFollowupFile, FollowupFileFormData } from "./followup";

function CreateFollowupForm() {
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

        // Validation basique
        if (
            !formData.reference_number ||
            !formData.vehicle_id ||
            !formData.port_call_id
        ) {
            alert("Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            const newFile = await createFollowupFile(formData);
            alert(`Dossier créé avec succès: ${newFile.reference_number}`);

            // Réinitialiser le formulaire
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
            alert("Erreur lors de la création du dossier");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Numéro de référence"
                value={formData.reference_number}
                onChange={(e) =>
                    setFormData((prev) => ({
                        ...prev,
                        reference_number: e.target.value,
                    }))
                }
                required
            />
            {/* Autres champs... */}
            <button type="submit">Créer le dossier</button>
        </form>
    );
}
```

## ✏️ Modification de dossiers

### Mettre à jour un dossier existant

```typescript
import { updateFollowupFile } from "./followup";

const fileId = "1";
const updates = {
    status: "Fermé",
    actual_completion_date: new Date().toISOString(),
    notes: "Dossier traité avec succès, véhicule sorti du port",
};

try {
    const updatedFile = await updateFollowupFile(fileId, updates);
    console.log("Dossier mis à jour:", updatedFile.status);
} catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
}
```

### Mise à jour conditionnelle

```typescript
import { updateFollowupFile, FollowupFile } from "./followup";

async function updateFileStatus(
    file: FollowupFile,
    newStatus: FollowupFile["status"]
) {
    // Vérifier que le dossier peut être modifié
    if (file.status === "Fermé" && newStatus !== "Fermé") {
        throw new Error("Impossible de modifier un dossier fermé");
    }

    try {
        const updatedFile = await updateFollowupFile(file.id, {
            status: newStatus,
        });
        return updatedFile;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        throw error;
    }
}

// Utilisation
try {
    const updated = await updateFileStatus(existingFile, "En attente");
    console.log("Statut mis à jour:", updated.status);
} catch (error) {
    console.error("Mise à jour échouée:", error);
}
```

## 🗑️ Suppression de dossiers

### Supprimer un dossier

```typescript
import { deleteFollowupFile } from "./followup";

const fileId = "1";

try {
    await deleteFollowupFile(fileId);
    console.log("Dossier supprimé avec succès");
} catch (error) {
    console.error("Erreur lors de la suppression:", error);
}
```

### Suppression avec confirmation

```typescript
import { deleteFollowupFile } from "./followup";

async function deleteFileWithConfirmation(fileId: string, fileName: string) {
    const confirmed = window.confirm(
        `Êtes-vous sûr de vouloir supprimer le dossier "${fileName}" ?\n\nCette action est irréversible.`
    );

    if (!confirmed) {
        return false;
    }

    try {
        await deleteFollowupFile(fileId);
        console.log("Dossier supprimé avec succès");
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        return false;
    }
}

// Utilisation
const success = await deleteFileWithConfirmation("1", "FU-2024-001");
if (success) {
    // Rafraîchir la liste ou naviguer ailleurs
}
```

## 🔍 Filtrage et recherche

### Filtrer par statut

```typescript
import { fetchFollowupFiles, FollowupFile } from "./followup";

async function getFilesByStatus(status: FollowupFile["status"]) {
    const allFiles = await fetchFollowupFiles();
    return allFiles.filter((file) => file.status === status);
}

// Utilisation
const openFiles = await getFilesByStatus("Ouvert");
const closedFiles = await getFilesByStatus("Fermé");
```

### Recherche par référence

```typescript
import { fetchFollowupFiles, FollowupFile } from "./followup";

async function searchFilesByReference(searchTerm: string) {
    const allFiles = await fetchFollowupFiles();
    const term = searchTerm.toLowerCase();

    return allFiles.filter(
        (file) =>
            file.reference_number.toLowerCase().includes(term) ||
            file.vehicle_id.toLowerCase().includes(term) ||
            file.port_call_id.toLowerCase().includes(term)
    );
}

// Utilisation
const searchResults = await searchFilesByReference("FU-2024");
console.log(`Trouvé ${searchResults.length} résultats`);
```

### Filtrage par priorité

```typescript
import { fetchFollowupFiles, FollowupFile } from "./followup";

async function getFilesByPriority(priority: FollowupFile["priority"]) {
    const allFiles = await fetchFollowupFiles();
    return allFiles.filter((file) => file.priority === priority);
}

// Utilisation
const urgentFiles = await getFilesByPriority("Urgente");
const highPriorityFiles = await getFilesByPriority("Élevée");

console.log(`Fichiers urgents: ${urgentFiles.length}`);
console.log(`Fichiers haute priorité: ${highPriorityFiles.length}`);
```

## 📊 Statistiques et rapports

### Compter les dossiers par statut

```typescript
import { fetchFollowupFiles, FollowupFile } from "./followup";

async function getStatusCounts() {
    const allFiles = await fetchFollowupFiles();

    const counts = {
        ouvert: 0,
        enAttente: 0,
        ferme: 0,
    };

    allFiles.forEach((file) => {
        switch (file.status) {
            case "Ouvert":
                counts.ouvert++;
                break;
            case "En attente":
                counts.enAttente++;
                break;
            case "Fermé":
                counts.ferme++;
                break;
        }
    });

    return counts;
}

// Utilisation
const statusCounts = await getStatusCounts();
console.log("Répartition des statuts:", statusCounts);
```

### Calculer la progression moyenne

```typescript
import { fetchFollowupFiles, FollowupFile } from "./followup";

async function getAverageProgress() {
    const allFiles = await fetchFollowupFiles();

    if (allFiles.length === 0) return 0;

    const totalProgress = allFiles.reduce((sum, file) => {
        const completedSteps = file.workflow_steps.filter(
            (step) => step.status === "Terminé"
        ).length;
        const totalSteps = file.workflow_steps.length;
        return sum + (totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0);
    }, 0);

    return Math.round(totalProgress / allFiles.length);
}

// Utilisation
const avgProgress = await getAverageProgress();
console.log(`Progression moyenne: ${avgProgress}%`);
```

## 🚨 Gestion des erreurs

### Wrapper avec gestion d'erreur

```typescript
import {
    fetchFollowupFiles,
    createFollowupFile,
    updateFollowupFile,
    deleteFollowupFile,
} from "./followup";

class FollowupAPI {
    static async safeFetch() {
        try {
            return await fetchFollowupFiles();
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des dossiers:",
                error
            );
            throw new Error("Impossible de récupérer les dossiers de suivi");
        }
    }

    static async safeCreate(data: FollowupFileFormData) {
        try {
            return await createFollowupFile(data);
        } catch (error) {
            console.error("Erreur lors de la création du dossier:", error);
            throw new Error("Impossible de créer le dossier de suivi");
        }
    }

    static async safeUpdate(id: string, updates: Partial<FollowupFile>) {
        try {
            return await updateFollowupFile(id, updates);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du dossier:", error);
            throw new Error("Impossible de mettre à jour le dossier de suivi");
        }
    }

    static async safeDelete(id: string) {
        try {
            await deleteFollowupFile(id);
        } catch (error) {
            console.error("Erreur lors de la suppression du dossier:", error);
            throw new Error("Impossible de supprimer le dossier de suivi");
        }
    }
}

// Utilisation
try {
    const files = await FollowupAPI.safeFetch();
    console.log(`Récupéré ${files.length} dossiers`);
} catch (error) {
    console.error("Erreur API:", error.message);
}
```

## 🔄 Rafraîchissement des données

### Hook personnalisé avec rafraîchissement

```typescript
import { useState, useEffect, useCallback } from "react";
import { fetchFollowupFiles, FollowupFile } from "./followup";

function useFollowupFiles() {
    const [files, setFiles] = useState<FollowupFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchFollowupFiles();
            setFiles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(() => {
        fetchFiles();
    }, [fetchFiles]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return {
        files,
        loading,
        error,
        refresh,
    };
}

// Utilisation dans un composant
function FollowupManager() {
    const { files, loading, error, refresh } = useFollowupFiles();

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div>
            <button onClick={refresh}>Rafraîchir</button>
            <div>
                {files.map((file) => (
                    <div key={file.id}>{file.reference_number}</div>
                ))}
            </div>
        </div>
    );
}
```

## 📱 Optimisations pour mobile

### Chargement progressif

```typescript
import { useState, useEffect } from "react";
import { fetchFollowupFiles, FollowupFile } from "./followup";

function useProgressiveLoading() {
    const [files, setFiles] = useState<FollowupFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const loadMore = async () => {
        try {
            setLoading(true);
            const allFiles = await fetchFollowupFiles();

            // Simulation de pagination
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const newFiles = allFiles.slice(startIndex, endIndex);

            setFiles((prev) => [...prev, ...newFiles]);
            setHasMore(endIndex < allFiles.length);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMore();
    }, []);

    return {
        files,
        loading,
        hasMore,
        loadMore,
    };
}
```

Ces exemples montrent comment utiliser efficacement l'API des dossiers de suivi dans différents contextes. Ils couvrent les cas d'usage les plus courants et fournissent des patterns de gestion d'erreur robustes.

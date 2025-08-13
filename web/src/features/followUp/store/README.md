# Store Zustand - Gestion des Dossiers de Suivi

## 🎯 Vue d'ensemble

Ce store Zustand gère l'état global de l'application de gestion des dossiers de suivi, remplaçant l'ancien Context API pour une meilleure performance et une gestion d'état plus flexible.

## 🚀 Pourquoi Zustand ?

### Avantages par rapport au Context API

-   **Performance** : Re-renders optimisés et sélecteurs intelligents
-   **Simplicité** : API plus simple et moins de boilerplate
-   **Flexibilité** : Actions combinées et gestion d'état avancée
-   **DevTools** : Intégration native avec Redux DevTools
-   **Bundle size** : Plus léger que Redux ou Zustand

### Avantages par rapport à Redux

-   **Setup minimal** : Pas de Provider, actions, reducers complexes
-   **TypeScript** : Support natif et typage automatique
-   **Middleware** : Système de middleware extensible
-   **Immutabilité** : Gestion automatique des mises à jour

## 🏗️ Architecture du Store

### Structure du store

```typescript
interface FollowupState {
    // État des dialogues
    open: string | null;
    selectedFile: FollowupFile | null;
    isEditing: boolean;

    // Actions
    setOpen: (action: string | null) => void;
    setSelectedFile: (file: FollowupFile | null) => void;
    setIsEditing: (editing: boolean) => void;

    // Actions combinées
    openAddDialog: () => void;
    openEditDialog: (file: FollowupFile) => void;
    openViewDialog: (file: FollowupFile) => void;
    closeDialog: () => void;

    // Reset
    reset: () => void;
}
```

### État initial

```typescript
const initialState = {
    open: null, // Dialogue ouvert (add, edit, view)
    selectedFile: null, // Fichier sélectionné
    isEditing: false, // Mode édition
};
```

## 🔧 Utilisation du Store

### Hook principal

```typescript
import { useFollowupStore } from "./followup-store";

function MyComponent() {
    const { open, selectedFile, openAddDialog } = useFollowupStore();

    return <button onClick={openAddDialog}>Ouvrir dialogue d'ajout</button>;
}
```

### Sélecteurs optimisés

```typescript
// Sélecteurs individuels pour éviter les re-renders inutiles
import { useFollowupOpen, useFollowupSelectedFile } from "./followup-store";

function DialogManager() {
    const open = useFollowupOpen(); // Se re-render si open change
    const selectedFile = useFollowupSelectedFile(); // Se re-render si selectedFile change

    return (
        <div>
            {open === "add" && <AddDialog />}
            {open === "edit" && <EditDialog />}
            {open === "view" && <ViewDialog />}
        </div>
    );
}
```

### Actions combinées

```typescript
import { useFollowupActions } from "./followup-store";

function ActionButtons() {
    const { openAddDialog, openEditDialog, openViewDialog, closeDialog } =
        useFollowupActions();

    return (
        <div>
            <button onClick={openAddDialog}>Ajouter</button>
            <button onClick={() => openEditDialog(file)}>Modifier</button>
            <button onClick={() => openViewDialog(file)}>Voir</button>
            <button onClick={closeDialog}>Fermer</button>
        </div>
    );
}
```

## 📊 Actions et Mutations

### Actions simples

```typescript
// Mise à jour directe d'un champ
setOpen: (action) => set({ open: action }),
setSelectedFile: (file) => set({ selectedFile: file }),
setIsEditing: (editing) => set({ isEditing: editing }),
```

### Actions combinées

```typescript
// Actions qui mettent à jour plusieurs champs en une fois
openAddDialog: () => set({
  open: 'add',
  selectedFile: null,
  isEditing: false
}),

openEditDialog: (file) => set({
  open: 'edit',
  selectedFile: file,
  isEditing: true
}),

openViewDialog: (file) => set({
  open: 'view',
  selectedFile: file,
  isEditing: false
}),
```

### Reset complet

```typescript
reset: () => set(initialState),
```

## 🎨 Patterns d'utilisation

### 1. Gestion des dialogues

```typescript
// Ouvrir un dialogue
const { openAddDialog } = useFollowupActions();
openAddDialog(); // Met automatiquement open: 'add', selectedFile: null, isEditing: false

// Fermer un dialogue
const { closeDialog } = useFollowupActions();
closeDialog(); // Reset complet de l'état
```

### 2. Navigation entre dialogues

```typescript
// Passer de la vue à l'édition
const { openEditDialog } = useFollowupActions();
openEditDialog(selectedFile); // Met open: 'edit', selectedFile: file, isEditing: true

// Retourner à la vue
const { openViewDialog } = useFollowupActions();
openViewDialog(selectedFile); // Met open: 'view', selectedFile: file, isEditing: false
```

### 3. Gestion des états de chargement

```typescript
// État local pour le composant
const [loading, setLoading] = useState(false);

// Utilisation avec le store
const { closeDialog } = useFollowupActions();

const handleSubmit = async () => {
    setLoading(true);
    try {
        await apiCall();
        closeDialog(); // Ferme le dialogue après succès
    } finally {
        setLoading(false);
    }
};
```

## 🔄 Flux de données

### Ouverture d'un dialogue

```typescript
// 1. L'utilisateur clique sur "Créer un dossier"
<Button onClick={openAddDialog} />;

// 2. Le store met à jour l'état
openAddDialog: () =>
    set({
        open: "add",
        selectedFile: null,
        isEditing: false,
    });

// 3. Tous les composants utilisant ces sélecteurs sont notifiés
useFollowupOpen(); // Retourne 'add'
useFollowupSelectedFile(); // Retourne null
useFollowupIsEditing(); // Retourne false

// 4. Le composant de dialogue s'affiche
{
    open === "add" && <AddDialog />;
}
```

### Fermeture d'un dialogue

```typescript
// 1. L'utilisateur clique sur "Fermer"
<Button onClick={closeDialog} />;

// 2. Le store reset l'état
closeDialog: () =>
    set({
        open: null,
        selectedFile: null,
        isEditing: false,
    });

// 3. Le dialogue se ferme automatiquement
{
    open === "add" && <AddDialog />;
} // Ne s'affiche plus
```

## 🧪 Tests et Debug

### Redux DevTools

```typescript
// Le store est automatiquement visible dans Redux DevTools
// Vous pouvez voir toutes les actions et mutations en temps réel
```

### Tests unitaires

```typescript
import { renderHook, act } from "@testing-library/react";
import { useFollowupStore } from "./followup-store";

test("should open add dialog", () => {
    const { result } = renderHook(() => useFollowupStore());

    act(() => {
        result.current.openAddDialog();
    });

    expect(result.current.open).toBe("add");
    expect(result.current.selectedFile).toBe(null);
    expect(result.current.isEditing).toBe(false);
});
```

## 🚀 Optimisations

### Sélecteurs granulaires

```typescript
// ✅ Bon : Sélecteur spécifique
const open = useFollowupOpen(); // Se re-render seulement si open change

// ❌ Éviter : Sélecteur trop large
const { open, selectedFile, isEditing } = useFollowupStore(); // Se re-render si n'importe quoi change
```

### Actions combinées

```typescript
// ✅ Bon : Action qui met à jour plusieurs champs en une fois
openAddDialog: () =>
    set({
        open: "add",
        selectedFile: null,
        isEditing: false,
    });

// ❌ Éviter : Actions séparées qui causent plusieurs re-renders
setOpen("add");
setSelectedFile(null);
setIsEditing(false);
```

## 🔮 Évolutions futures

### Middleware

```typescript
// Logging automatique
import { subscribeWithSelector } from "zustand/middleware";

export const useFollowupStore = create(
    subscribeWithSelector<FollowupState>((set, get) => ({
        // ... store implementation
    }))
);

// Log toutes les mutations
useFollowupStore.subscribe((state) => console.log("Store updated:", state));
```

### Persistance

```typescript
// Sauvegarde automatique dans localStorage
import { persist } from "zustand/middleware";

export const useFollowupStore = create(
    persist<FollowupState>(
        (set, get) => ({
            // ... store implementation
        }),
        {
            name: "followup-store",
            partialize: (state) => ({
                // Sauvegarder seulement certains champs
                selectedFile: state.selectedFile,
            }),
        }
    )
);
```

### Actions asynchrones

```typescript
// Actions qui gèrent les appels API
const useFollowupStore = create<FollowupState>((set, get) => ({
    // ... autres actions

    createFollowupFile: async (data: FollowupFileFormData) => {
        set({ loading: true });
        try {
            const result = await api.createFollowupFile(data);
            set({ loading: false, success: true });
            return result;
        } catch (error) {
            set({ loading: false, error: error.message });
            throw error;
        }
    },
}));
```

## 📚 Ressources

-   [Documentation officielle Zustand](https://github.com/pmndrs/zustand)
-   [Guide de migration Context → Zustand](https://docs.pmnd.rs/zustand/guides/migrating-from-context)
-   [Exemples d'utilisation avancée](https://github.com/pmndrs/zustand/tree/main/examples)
-   [Middleware disponibles](https://github.com/pmndrs/zustand/tree/main/src/middleware)

Zustand offre une alternative moderne et performante au Context API, avec une API plus simple et de meilleures performances. Cette implémentation suit les meilleures pratiques et est prête pour la production.

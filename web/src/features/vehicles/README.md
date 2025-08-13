# Gestion des Véhicules

Cette fonctionnalité permet de gérer la flotte de véhicules de l'entreprise avec une interface complète et intuitive.

## Fonctionnalités

### 📋 Affichage de la liste

-   Tableau interactif avec toutes les informations des véhicules
-   Colonnes : Plaque, Marque, Modèle, Année, Type, Statut, Capacité, Chauffeur, Dernière maintenance, Notes
-   Tri et filtrage par colonnes
-   Pagination automatique

### 🔍 Filtres et recherche

-   Recherche par plaque d'immatriculation, marque ou modèle
-   Filtrage par type de véhicule (Camion, Remorque, Fourgon, Voiture)
-   Filtrage par statut (Disponible, En cours d'utilisation, En maintenance, Hors service)
-   Bouton de réinitialisation des filtres

### ➕ Ajout de véhicules

-   Formulaire complet avec validation
-   Champs obligatoires : Plaque, Marque, Modèle, Année, Type
-   Champs optionnels : Capacité, Chauffeur, Date de mise en service, Notes
-   Statut initial configurable

### 👁️ Visualisation des détails

-   Dialogue détaillé avec toutes les informations du véhicule
-   Affichage formaté des dates et capacités
-   Badges colorés pour le statut et le type
-   Mise en page claire et organisée

### ✏️ Modification des véhicules

-   Édition de tous les champs du véhicule
-   Pré-remplissage avec les données existantes
-   Validation des champs obligatoires
-   Sauvegarde des modifications

### 🗑️ Suppression des véhicules

-   Confirmation de suppression avec avertissement
-   Affichage de la plaque du véhicule à supprimer
-   Action irréversible avec message d'avertissement

## Structure des données

### Schéma du véhicule

```typescript
interface Vehicle {
    id: string;
    plateNumber: string; // Plaque d'immatriculation
    brand: string; // Marque
    model: string; // Modèle
    year: number; // Année de fabrication
    type: VehicleType; // Type de véhicule
    status: VehicleStatus; // Statut actuel
    capacity?: number; // Capacité en kg (optionnel)
    driver?: string; // Chauffeur assigné (optionnel)
    lastMaintenance?: string; // Date de dernière maintenance (optionnel)
    notes?: string; // Notes additionnelles (optionnel)
}
```

### Types de véhicules

-   **Camion** : Véhicules lourds de transport
-   **Remorque** : Remorques tractées
-   **Fourgon** : Véhicules utilitaires
-   **Voiture** : Véhicules légers

### Statuts des véhicules

-   **Disponible** : Véhicule prêt à être utilisé
-   **En cours d'utilisation** : Véhicule actuellement en service
-   **En maintenance** : Véhicule en réparation ou révision
-   **Hors service** : Véhicule temporairement indisponible

## Composants

### Composants principaux

-   `VehiclesDataTable` : Tableau principal avec données et pagination
-   `VehiclesColumns` : Définition des colonnes et cellules
-   `VehiclesDataTableToolbar` : Barre d'outils avec filtres et recherche

### Composants d'actions

-   `VehiclesAddButtons` : Boutons d'ajout
-   `DataTableRowActions` : Menu d'actions par ligne (Voir, Modifier, Supprimer)

### Dialogues

-   `VehiclesAddDialog` : Formulaire d'ajout de véhicule
-   `VehiclesViewDialog` : Affichage des détails
-   `VehiclesEditDialog` : Formulaire de modification
-   `VehiclesDeleteDialog` : Confirmation de suppression

### Contexte

-   `VehiclesContextProvider` : Gestion de l'état global des dialogues et du véhicule sélectionné

## Utilisation

### Navigation

1. Accédez à la section "Véhicules" depuis le menu principal
2. La liste des véhicules s'affiche automatiquement
3. Utilisez les filtres pour affiner la recherche
4. Cliquez sur les actions pour gérer chaque véhicule

### Ajout d'un véhicule

1. Cliquez sur "Ajouter un véhicule"
2. Remplissez le formulaire avec les informations requises
3. Validez l'ajout

### Modification d'un véhicule

1. Cliquez sur les actions d'une ligne
2. Sélectionnez "Modifier"
3. Modifiez les champs souhaités
4. Sauvegardez les modifications

### Suppression d'un véhicule

1. Cliquez sur les actions d'une ligne
2. Sélectionnez "Supprimer"
3. Confirmez la suppression

## Données d'exemple

La fonctionnalité inclut des données d'exemple pour démonstration :

-   6 véhicules de différents types et statuts
-   Informations complètes avec chauffeurs et dates de maintenance
-   Variété de marques et modèles

## Personnalisation

### Ajout de nouveaux types de véhicules

Modifiez le fichier `schema.ts` pour ajouter de nouveaux types dans `vehicleTypes`.

### Ajout de nouveaux statuts

Ajoutez de nouveaux statuts dans `vehicleStatuses` avec leurs couleurs associées.

### Modification des colonnes

Adaptez `VehiclesColumns` pour afficher ou masquer des colonnes selon vos besoins.

## Intégration future

Cette fonctionnalité est conçue pour être facilement extensible :

-   Connexion à une API backend
-   Gestion des permissions utilisateur
-   Historique des modifications
-   Notifications de maintenance
-   Géolocalisation des véhicules
-   Gestion des documents (assurance, contrôle technique, etc.)

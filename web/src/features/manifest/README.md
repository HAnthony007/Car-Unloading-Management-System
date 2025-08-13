# Import Manifest Excel

Cette fonctionnalité permet d'importer des données de manifest depuis des fichiers Excel pour gérer les informations des navires, véhicules, chauffeurs et cargaisons.

## Fonctionnalités

### 🚢 Import de fichiers Excel

-   Support des formats `.xlsx` et `.xls`
-   Drag & drop intuitif
-   Validation automatique des données
-   Prévisualisation avant import

### 📊 Validation des données

-   Vérification des champs obligatoires
-   Validation des formats de date
-   Contrôle des types de données
-   Rapport d'erreurs détaillé

### 📈 Suivi de l'import

-   Barre de progression en temps réel
-   Statistiques détaillées
-   Gestion des erreurs et avertissements
-   Historique des imports

## Structure des données attendues

Le fichier Excel doit contenir les colonnes suivantes :

| Colonne          | Description              | Format                      | Obligatoire |
| ---------------- | ------------------------ | --------------------------- | ----------- |
| **Navire**       | Nom du navire            | Texte                       | ✅          |
| **Véhicule**     | Plaque d'immatriculation | Texte                       | ✅          |
| **Chauffeur**    | Nom du chauffeur         | Texte                       | ✅          |
| **Date Arrivée** | Date d'arrivée           | YYYY-MM-DD                  | ❌          |
| **Date Départ**  | Date de départ           | YYYY-MM-DD                  | ❌          |
| **Status**       | Statut de l'opération    | En attente/En cours/Terminé | ❌          |
| **Cargaison**    | Type de cargaison        | Texte                       | ❌          |
| **Poids**        | Poids en kilogrammes     | Nombre                      | ❌          |

## Workflow d'import

### 1. Sélection du fichier

-   Glisser-déposer du fichier Excel
-   Ou clic pour parcourir les fichiers
-   Validation du format et de la taille

### 2. Validation des données

-   Analyse automatique de la structure
-   Vérification des champs obligatoires
-   Détection des erreurs et avertissements

### 3. Import et traitement

-   Traitement progressif des données
-   Mise à jour en temps réel
-   Gestion des erreurs

### 4. Confirmation

-   Rapport de succès
-   Statistiques finales
-   Possibilité de nouvel import

## Composants

### `ManifestImportValidator`

Valide la structure et le contenu des données Excel avant l'import.

### `ManifestImportStats`

Affiche les statistiques et la progression de l'import.

### `useExcelFileHandler`

Hook personnalisé pour gérer le traitement des fichiers Excel.

## Utilisation

```tsx
import { ManifestImportValidator } from "./components/manifest-import-validator";
import { ManifestImportStats } from "./components/manifest-import-stats";

// Dans votre composant
<ManifestImportValidator
    data={manifestData}
    onValidationComplete={handleValidationComplete}
    onProceed={handleProceedToImport}
/>

<ManifestImportStats
    stats={importStats}
    showProgress={true}
/>
```

## Gestion des erreurs

### Erreurs critiques

-   Fichier non supporté
-   Structure de données invalide
-   Champs obligatoires manquants

### Avertissements

-   Formats de date non standard
-   Statuts non reconnus
-   Données potentiellement incorrectes

## Limitations actuelles

-   Simulation des données (pas de vraie lecture Excel)
-   Taille maximale : 10MB
-   Formats supportés : .xlsx, .xls

## Améliorations futures

-   [ ] Intégration de la bibliothèque `xlsx` ou `exceljs`
-   [ ] Support des fichiers CSV
-   [ ] Validation avancée des données
-   [ ] Export des erreurs en Excel
-   [ ] Historique des imports
-   [ ] Templates personnalisables

## Support technique

Pour toute question ou problème :

1. Vérifiez le format du fichier Excel
2. Assurez-vous que les colonnes obligatoires sont présentes
3. Contrôlez la taille du fichier (max 10MB)
4. Vérifiez les formats de date (YYYY-MM-DD)

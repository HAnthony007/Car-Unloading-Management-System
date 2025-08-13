# Gestion des Dossiers de Suivi (Follow-Up Files)

## Vue d'ensemble

Le module de gestion des dossiers de suivi est le cœur du système de traçabilité des véhicules débarqués au port. Il centralise toutes les informations relatives au suivi d'un véhicule depuis son arrivée jusqu'à la fin de son processus logistique.

## 🎯 Rôle dans le flux métier

### Point de rassemblement des données

-   Toutes les informations (véhicule, documents, photos, inspections, mouvements, étapes de workflow) sont attachées à ce dossier
-   Interface unifiée pour accéder à l'ensemble des données d'un véhicule

### Trace complète

-   Historique complet du parcours d'un véhicule au port
-   Traçabilité pour vérification et audit
-   Conformité aux exigences réglementaires

## 🔄 Cycle de vie d'un dossier de suivi

### 1. Création

-   **Déclencheur** : Lorsqu'un véhicule est débarqué (DISCHARGE)
-   **Informations initiales** :
    -   `reference_number` (unique)
    -   `statut` initial (Ouvert ou En attente)
    -   `vehicle_id` (véhicule lié)
    -   `port_call_id` (appel d'escale concerné)
    -   `date de création` (created_at)

### 2. Alimentation

-   **Documents** : Connaissement, bon de sortie, fiche de contrôle, certificats
-   **Photos** : État du véhicule, anomalies, documentation
-   **Workflow steps** : Inspection, placement au parking, autorisation de sortie
-   **Inspections** : SURVEY, contrôle qualité, vérification documentaire

### 3. Suivi en temps réel

-   **État actuel** : Statut et progression des étapes
-   **Inspections** : Résultats et recommandations
-   **Documents** : Statut d'approbation

### 4. Clôture

-   **Condition** : Toutes les étapes terminées et autorisation de sortie donnée
-   **Statut** : Passe à "Fermé"
-   **Mode** : Lecture seule (sauf mises à jour administratives)

## 🚀 Fonctionnalités

### Interface utilisateur

-   **Vue en cartes** : Affichage moderne et intuitif des dossiers
-   **Filtres visuels** : Statut, priorité, progression
-   **Recherche rapide** : Par référence, véhicule ou port call

### Gestion des dossiers

-   **Création** : Formulaire complet avec validation
-   **Modification** : Édition des informations modifiables
-   **Visualisation** : Vue détaillée de tous les éléments
-   **Suppression** : Gestion sécurisée des suppressions

### Suivi des étapes

-   **Workflow** : Progression visuelle des étapes
-   **Assignation** : Gestion des responsables
-   **Statuts** : En attente, En cours, Terminé, Bloqué

### Gestion des documents

-   **Types** : Connaissement, bon de sortie, fiche de contrôle, certificats
-   **Statuts** : En attente, Approuvé, Rejeté
-   **Traçabilité** : Upload, approbation, historique

## 📊 Structure des données

### Dossier de suivi (FollowupFile)

```typescript
interface FollowupFile {
    id: string;
    reference_number: string;
    status: "Ouvert" | "En attente" | "Fermé";
    vehicle_id: string;
    port_call_id: string;
    created_at: string;
    updated_at: string;
    vehicle_info?: VehicleInfo;
    documents: Document[];
    photos: Photo[];
    workflow_steps: WorkflowStep[];
    inspections: Inspection[];
    assigned_inspector?: string;
    notes?: string;
    priority: "Faible" | "Moyenne" | "Élevée" | "Urgente";
    estimated_completion_date?: string;
    actual_completion_date?: string;
}
```

### Composants associés

-   **Document** : Gestion des fichiers et statuts
-   **Photo** : Images avec catégorisation
-   **WorkflowStep** : Étapes du processus
-   **Inspection** : Résultats des vérifications

## 🎨 Design et UX

### Interface moderne

-   **Cartes responsives** : Affichage adaptatif sur tous les écrans
-   **Couleurs sémantiques** : Statuts et priorités visuellement distincts
-   **Animations** : Transitions fluides et feedback utilisateur

### Navigation intuitive

-   **Actions contextuelles** : Boutons adaptés au statut du dossier
-   **Hiérarchie visuelle** : Information organisée par importance
-   **Feedback immédiat** : Notifications et confirmations

### Accessibilité

-   **Contraste élevé** : Lisibilité optimale
-   **Navigation clavier** : Support complet des raccourcis
-   **États visuels** : Indicateurs clairs des actions possibles

## 🔧 Architecture technique

### Composants React

-   **FollowupDataTable** : Affichage principal en cartes
-   **FollowupAddDialog** : Création de nouveaux dossiers
-   **FollowupEditDialog** : Modification des dossiers existants
-   **FollowupViewDialog** : Visualisation détaillée

### Gestion d'état

-   **Context API** : État global des dialogues et sélections
-   **Hooks personnalisés** : Logique métier réutilisable
-   **Gestion des erreurs** : Traitement robuste des cas d'erreur

### Données

-   **Mock data** : Données de démonstration complètes
-   **API simulation** : Appels asynchrones réalistes
-   **Validation** : Schémas TypeScript stricts

## 📱 Responsive Design

### Breakpoints

-   **Mobile** : 1 colonne, cartes empilées
-   **Tablet** : 2 colonnes, navigation optimisée
-   **Desktop** : 3 colonnes, informations complètes

### Adaptations

-   **Navigation tactile** : Boutons et zones de clic optimisés
-   **Contenu adaptatif** : Affichage conditionnel selon l'espace
-   **Performance** : Chargement progressif des données

## 🚀 Utilisation

### Créer un dossier

1. Cliquer sur "Créer un dossier"
2. Remplir le formulaire avec les informations requises
3. Valider la création

### Modifier un dossier

1. Cliquer sur "Modifier" depuis la vue en cartes
2. Ajuster les champs modifiables
3. Sauvegarder les changements

### Consulter un dossier

1. Cliquer sur "Voir" depuis la vue en cartes
2. Naviguer dans les différentes sections
3. Consulter l'historique et les détails

## 🔮 Évolutions futures

### Fonctionnalités prévues

-   **Notifications** : Alertes en temps réel
-   **Workflow avancé** : Automatisation des étapes
-   **Rapports** : Génération de rapports détaillés
-   **Intégration** : Connexion avec d'autres systèmes

### Améliorations techniques

-   **Cache intelligent** : Optimisation des performances
-   **Synchronisation** : Données en temps réel
-   **API REST** : Interface standardisée
-   **Tests automatisés** : Couverture complète

## 📚 Documentation technique

### Dépendances

-   **React 19** : Framework principal
-   **TypeScript** : Typage statique
-   **Tailwind CSS** : Styling utilitaire
-   **Radix UI** : Composants accessibles
-   **date-fns** : Gestion des dates

### Structure des fichiers

```
src/features/followUp/
├── components/
│   ├── followup-add-dialog.tsx
│   ├── followup-edit-dialog.tsx
│   ├── followup-view-dialog.tsx
│   ├── followup-data-table.tsx
│   ├── followup-dialogs.tsx
│   └── followup-add-buttons.tsx
├── context/
│   └── followup-context.tsx
├── data/
│   ├── schema.ts
│   └── followup.ts
└── index.tsx
```

### Conventions de nommage

-   **Composants** : PascalCase (ex: `FollowupDataTable`)
-   **Fonctions** : camelCase (ex: `handleSubmit`)
-   **Types** : PascalCase (ex: `FollowupFile`)
-   **Constantes** : UPPER_SNAKE_CASE (ex: `DEFAULT_STATUS`)

## 🤝 Contribution

### Standards de code

-   **ESLint** : Règles de qualité automatiques
-   **Prettier** : Formatage automatique
-   **TypeScript strict** : Typage rigoureux
-   **Tests unitaires** : Couverture minimale 80%

### Processus de développement

1. **Feature branch** : Création d'une branche dédiée
2. **Code review** : Validation par un pair
3. **Tests** : Vérification des fonctionnalités
4. **Documentation** : Mise à jour de la documentation
5. **Merge** : Intégration dans la branche principale

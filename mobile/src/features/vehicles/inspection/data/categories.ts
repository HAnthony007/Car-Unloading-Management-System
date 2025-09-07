import { CategoryBlock, ChecklistItem } from '../types';

const makeItems = (labels: string[]): ChecklistItem[] =>
  labels.map(l => ({
    id: `${l}-${Math.random().toString(36).slice(2,7)}`,
    label: l,
    status: 'ok',
    comment: '',
    photos: [],
  }));

export const INITIAL_CATEGORIES: CategoryBlock[] = [
  {
    key: 'exterior',
    title: 'Extérieur',
    description: 'Inspection de la carrosserie et des éléments extérieurs',
    items: makeItems([
      'Carrosserie',
      'Portes / Fermetures',
      'Pare-chocs',
      'Vitres & Rétroviseurs',
      'Feux / Éclairage',
      'Pneumatiques',
    ]),
  },
  {
    key: 'interior',
    title: 'Intérieur',
    description: "Inspection de l'habitacle et des équipements intérieurs",
    items: makeItems([
      'Sièges',
      'Ceintures',
      'Tableau de bord',
      'Commandes',
      'Climatisation / Ventilation',
    ]),
  },
  {
    key: 'engine',
    title: 'Moteur',
    description: 'Inspection du compartiment moteur et mécanique',
    items: makeItems([
      'Huile moteur',
      'Liquide de refroidissement',
      'Batterie',
      'Système de freinage',
      'Courroies / Fuites',
    ]),
  },
  {
    key: 'docs',
    title: 'Documentation',
    description: 'Vérification des papiers et documents',
    items: makeItems([
      'Carte grise',
      'Certificat conformité',
      'Carnet entretien',
      'Assurance',
    ]),
  },
  {
    key: 'safety',
    title: 'Équipement de sécurité',
    description: 'Vérification des équipements de sécurité obligatoires',
    items: makeItems([
      'Triangle',
      'Gilet haute visibilité',
      'Extincteur',
      'Trousse de secours',
      'Roue de secours ou kit',
    ]),
  },
];

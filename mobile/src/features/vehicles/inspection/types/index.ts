// Inspection feature types
export type ItemStatus = 'ok' | 'defaut' | 'na';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ItemStatus;
  comment: string;
  photos: string[]; // URIs
}

export interface CategoryBlock {
  key: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

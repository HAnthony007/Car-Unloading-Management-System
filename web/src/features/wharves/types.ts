export type Dock = {
  dock_id: number;
  dock_name: string;
  location: string;
  created_at: string | null;
  updated_at: string | null;
};

export type DocksResponse = {
  data: Dock[];
};

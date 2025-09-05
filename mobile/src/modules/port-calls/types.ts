export type Vessel = {
  vessel_id: number;
  imo_no: string;
  vessel_name: string;
  flag?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PortCall = {
  port_call_id: number;
  vessel_agent: string | null;
  origin_port: string | null;
  estimated_arrival?: string | null;
  arrival_date?: string | null;
  estimated_departure?: string | null;
  departure_date?: string | null;
  vehicles_number?: number | null;
  status?: string | null;
  vessel?: Vessel | null;
  dock?: any | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Vehicle = {
  vehicle_id: number;
  vin: string;
  make: string;
  model: string;
  year?: number | null;
  owner_name?: string | null;
  color?: string | null;
  type: string;
  weight: string;
  vehicle_condition: string;
  vehicle_observation?: string | null;
  origin_country: string;
  ship_location?: string | null;
  is_primed: boolean;
  discharge_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

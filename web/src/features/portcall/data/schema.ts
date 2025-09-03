export interface PortCall {
  port_call_id: number;
  vessel_agent: string;
  origin_port: string;
  estimated_arrival: string;
  arrival_date: string;
  estimated_departure: string;
  departure_date: string;
  vessel_id: number;
  // API may include full vessel object with IMO; prefer vessel?.imo_no when available
  vessel?: {
    vessel_id?: number;
    imo_no?: string;
  } | null;
  vehicles_number?: number | null;
  dock_id: number;
  created_at: string;
  updated_at: string;
}

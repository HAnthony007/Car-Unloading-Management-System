import { apiFetchAuth } from '@/src/modules/auth/services/api';
import type { PortCall, Vehicle } from '../types';

export type GetPortCallsParams = {
  page?: number;
  perPage?: number;
  q?: string;
  status?: string;
};

function buildQuery(params: GetPortCallsParams = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.perPage) search.set('per_page', String(params.perPage));
  if (params.q && params.q.trim() !== '') search.set('search_term', params.q.trim());
  if (params.status && params.status !== 'all') search.set('status', params.status);
  const s = search.toString();
  return s ? `?${s}` : '';
}

export async function getPortCalls(params: GetPortCallsParams = {}) {
  const query = buildQuery(params);
  // apiFetchAuth will build the BASE_URL from EXPO_PUBLIC_API_URL and attach the JWT from the auth store
  const payload = await apiFetchAuth<{ data: PortCall[]; meta?: any }>(`/port-calls${query}`, { method: 'GET' });
  if (payload && Array.isArray((payload as any).data)) return { data: (payload as any).data as PortCall[], meta: (payload as any).meta };
  if (Array.isArray(payload)) return { data: payload as PortCall[] };
  return { data: [] as PortCall[] };
}

export async function getPortCallById(id: number | string): Promise<PortCall> {
  const payload = await apiFetchAuth<{ data: PortCall } | PortCall>(`/port-calls/${id}`, { method: 'GET' });
  return ((payload as any)?.data ?? payload) as PortCall;
}

export type DischargeVehicle = any; // shape can vary; expect at least vehicle info

export async function getPortCallDischarges(id: number | string): Promise<DischargeVehicle[]> {
  const payload = await apiFetchAuth<{ data: DischargeVehicle[] } | DischargeVehicle[]>(`/port-calls/${id}/discharges`, { method: 'GET' });
  if (payload && Array.isArray((payload as any).data)) return (payload as any).data as DischargeVehicle[];
  if (Array.isArray(payload)) return payload as DischargeVehicle[];
  return [] as DischargeVehicle[];
}

export async function getPortCallVehicles(id: number | string): Promise<{ vehicles: Vehicle[]; total: number }> {
  const payload = await apiFetchAuth<{ data: Vehicle[]; total?: number } | { vehicles: Vehicle[]; total?: number } | any>(`/port-calls/${id}/vehicles`, { method: 'GET' });
  // Backend returns { data: Vehicle[], port_call_id, total }
  if (payload && Array.isArray(payload.data)) {
    return { vehicles: payload.data as Vehicle[], total: payload.total ?? (payload.data as Vehicle[]).length };
  }
  // Fallback if array directly
  if (Array.isArray(payload)) return { vehicles: payload as Vehicle[], total: (payload as Vehicle[]).length };
  return { vehicles: [], total: 0 };
}

import { api } from "@/src/lib/axios-instance";
import type { PortCall, PortCallStatus, VehicleInPortCall } from "../types";

export interface PortCallsQueryParams {
    page?: number;
    per_page?: number;
    status?: PortCallStatus | string;
    vessel_agent?: string;
    origin_port?: string;
    search_term?: string;
    arrival_from?: string; // YYYY-MM-DD
    arrival_to?: string; // YYYY-MM-DD
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export async function fetchPortCalls(
    params: PortCallsQueryParams = {}
): Promise<PaginatedResponse<PortCall>> {
    const { data } = await api.get<PaginatedResponse<PortCall>>("/port-calls", {
        params,
    });
    return data;
}

export async function fetchPortCallById(id: number): Promise<PortCall> {
    const { data } = await api.get<{ data: PortCall }>(`/port-calls/${id}`);
    return data.data;
}

export interface PortCallVehiclesQueryParams {
    page?: number;
    per_page?: number;
    vin?: string;
    make?: string;
    model?: string;
    owner_name?: string;
    color?: string;
    type?: string;
    origin_country?: string;
    search_term?: string;
}

export interface PaginatedVehiclesResponse
    extends PaginatedResponse<VehicleInPortCall> {
    port_call_id: number;
}

export async function fetchPortCallVehicles(
    id: number,
    params: PortCallVehiclesQueryParams = {}
): Promise<PaginatedVehiclesResponse> {
    const { data } = await api.get<PaginatedVehiclesResponse>(
        `/port-calls/${id}/vehicles`,
        { params }
    );
    return data;
}

export interface CreatePortCallPayload {
    vessel_agent: string;
    origin_port: string;
    estimated_arrival?: string | null; // ISO
    arrival_date?: string | null;
    estimated_departure?: string | null;
    departure_date?: string | null;
    vessel_id: number;
    dock_id?: number | null;
}

export async function createPortCall(
    payload: CreatePortCallPayload
): Promise<PortCall> {
    const { data } = await api.post<{ data: PortCall }>("/port-calls", payload);
    return data.data;
}

export type UpdatePortCallPayload = Partial<CreatePortCallPayload>;

export async function updatePortCall(
    id: number,
    payload: UpdatePortCallPayload
): Promise<PortCall> {
    const { data } = await api.put<{ data: PortCall }>(
        `/port-calls/${id}`,
        payload
    );
    return data.data;
}

export async function deletePortCall(id: number): Promise<void> {
    await api.delete(`/port-calls/${id}`);
}

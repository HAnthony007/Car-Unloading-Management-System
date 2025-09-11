import { api } from "@/src/lib/axios-instance";
import { Storage } from "@/src/lib/storage";

export interface CreateDischargePayload {
    discharge_date: string; // ISO string
    port_call_id: number;
    vehicle_id: number | string | null; // backend seems permissive
    agent_id: number | string | null;
}

export async function getDischarge(dischargeId: number | string) {
    const { data } = await api.get(`/discharges/${dischargeId}`);
    return data;
}

export async function createDischarge(payload: CreateDischargePayload) {
    const { data } = await api.post(`/discharges`, payload);
    return data;
}

/**
 * Helper to build the payload. Will fetch current user for agent id.
 */
export async function buildDischargePayload(
    portCallId: string | number,
    vehicleId: any
): Promise<CreateDischargePayload> {
    const user = await Storage.getUser();
    const agentId = (user as any)?.user_id ?? null;
    return {
        discharge_date: new Date().toISOString(),
        port_call_id: Number(portCallId),
        vehicle_id: vehicleId,
        agent_id: agentId,
    };
}

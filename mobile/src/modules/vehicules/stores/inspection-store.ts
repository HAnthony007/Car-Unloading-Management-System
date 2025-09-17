import { api } from "@/src/lib/axios-instance";

type StartInspectionResponse = {
    message: string;
    data?: any;
};

export const InspectionStore = {
    async start(
        dischargeId: number,
        force = false
    ): Promise<StartInspectionResponse> {
        const { data } = await api.post<StartInspectionResponse>(
            "/inspections/start",
            { discharge_id: dischargeId, force }
        );
        return data;
    },
};

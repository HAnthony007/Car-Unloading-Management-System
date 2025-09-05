import { useQuery } from '@tanstack/react-query';
import { getPortCallById, getPortCallDischarges, getPortCallVehicles } from '../lib/portcalls';

export function usePortCallDetail(id?: number | string) {
  const portCall = useQuery({
    queryKey: ['port-call', id],
    queryFn: () => getPortCallById(id as number | string),
    enabled: !!id,
    staleTime: 30_000,
  });

  const discharges = useQuery({
    queryKey: ['port-call', id, 'discharges'],
    queryFn: () => getPortCallDischarges(id as number | string),
    enabled: !!id,
    staleTime: 15_000,
  });

  const vehicles = useQuery({
    queryKey: ['port-call', id, 'vehicles'],
    queryFn: () => getPortCallVehicles(id as number | string),
    enabled: !!id,
    staleTime: 15_000,
  });

  return { portCall, discharges, vehicles } as const;
}

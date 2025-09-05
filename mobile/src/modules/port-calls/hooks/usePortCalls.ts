import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { GetPortCallsParams } from '../lib/portcalls';
import { getPortCalls } from '../lib/portcalls';

export const usePortCalls = (params: GetPortCallsParams = {}) => {
  const queryParams: GetPortCallsParams = {
    page: params.page ?? 1,
    perPage: params.perPage ?? 50,
    q: params.q ?? '',
    status: params.status ?? 'all',
  };

  const query = useQuery({
    queryKey: ['port-calls', queryParams],
    queryFn: () => getPortCalls(queryParams),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const refetch = useCallback(() => query.refetch(), [query]);

  return {
    ...query,
    params: queryParams,
    refetch,
  } as const;
};

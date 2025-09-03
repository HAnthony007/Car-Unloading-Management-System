import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { GetPortCallsParams } from "../lib/portcalls";
import { getPortCalls } from "../lib/portcalls";

export const usePortCalls = (params: GetPortCallsParams = {}) => {
  const [q, setQ] = useState(params.q ?? "");
  const [status, setStatus] = useState<string>(params.status ?? "all");
  const [page, setPage] = useState<number>(params.page ?? 1);
  const [perPage, setPerPage] = useState<number>(params.perPage ?? 15);

  const queryParams: GetPortCallsParams = {
    page,
    perPage,
    q,
    status,
  };

  const query = useQuery({
    queryKey: ["port-calls", queryParams],
    queryFn: () => getPortCalls(queryParams),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    params: queryParams,
    setPage,
    setPerPage,
    setQ,
    setStatus,
  } as const;
};

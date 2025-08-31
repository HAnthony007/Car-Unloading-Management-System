import type { UsersMeta } from "@/features/users/data/users";
import type { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Icons } from "../icons/icon";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  serverMeta?: UsersMeta;
  onPageChange?: (page: number) => void; // 1-based
  onPageSizeChange?: (size: number) => void;
}

export const DataTablePagination = <TData,>({
  table,
  serverMeta,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) => {
  const isServer = Boolean(serverMeta);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const currentPage = isServer
    ? serverMeta?.currentPage ?? 1
    : mounted
      ? table.getState().pagination.pageIndex + 1
      : 1;
  const lastPage = isServer
    ? serverMeta?.lastPage ?? 1
    : mounted
      ? table.getPageCount()
      : 1;
  const pageSize = isServer
    ? serverMeta?.perPage ?? 10
    : mounted
      ? table.getState().pagination.pageSize
      : 10;
  const canPrev = isServer ? currentPage > 1 : mounted ? table.getCanPreviousPage() : false;
  const canNext = isServer ? currentPage < (lastPage ?? 1) : mounted ? table.getCanNextPage() : false;

  const handleFirst = () => {
    if (isServer) onPageChange?.(1);
    else table.setPageIndex(0);
  };
  const handlePrev = () => {
    if (isServer) onPageChange?.(Math.max(1, currentPage - 1));
    else table.previousPage();
  };
  const handleNext = () => {
    if (isServer) onPageChange?.(Math.min(lastPage ?? 1, currentPage + 1));
    else table.nextPage();
  };
  const handleLast = () => {
    if (isServer) onPageChange?.(lastPage ?? 1);
    else if (mounted) table.setPageIndex(table.getPageCount() - 1);
  };
  const handlePageSize = (value: string) => {
    const size = Number(value);
    if (isServer) onPageSizeChange?.(size);
    else table.setPageSize(size);
  };
  return (
    <div
      className="flex items-center justify-end overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
    {!isServer && (
        <div className="text-muted-foreground hidden flex-1 text-sm sm:block">
      {(mounted ? table.getSelectedRowModel().rows.length : 0)} sur{" "}
      {(mounted ? table.getFilteredRowModel().rows.length : 0)} sélectionné(s)
        </div>
      )}
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select value={`${pageSize}`} onValueChange={handlePageSize}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium w-[100px]">
          Page {currentPage} of {lastPage}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleFirst}
            disabled={!canPrev}
          >
            <span className="sr-only">Go to first page</span>
            <Icons.doubleArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handlePrev}
            disabled={!canPrev}
          >
            <span className="sr-only">Go to previous page</span>
            <Icons.arrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNext}
            disabled={!canNext}
          >
            <span className="sr-only">Go to next page</span>
            <Icons.arrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleLast}
            disabled={!canNext}
          >
            <span className="sr-only">Go to last page</span>
            <Icons.doubleArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

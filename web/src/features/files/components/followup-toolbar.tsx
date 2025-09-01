"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
// (Select removed in favor of faceted filters to match users toolbar UX)
import { useEffect, useMemo, useState } from "react";
import { FollowupFile } from "../data/schema";

interface FollowupToolbarProps {
  data: FollowupFile[];
  onFilterChange: (filteredData: FollowupFile[]) => void;
}

interface FilterState {
  search: string;
  status: string;
  priority: string;
  assignedInspector: string;
  dateRange: string;
}

export const FollowupToolbar = ({
  data,
  onFilterChange,
}: FollowupToolbarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    priority: "all",
    assignedInspector: "all",
    dateRange: "all",
  });

  // Active filters state (for Reset button)
  const hasQuery = (filters.search ?? "").trim() !== "";
  const hasFilterSelections = [
    filters.status,
    filters.priority,
    filters.assignedInspector,
    filters.dateRange,
  ].some((v) => v !== "all");
  const isFiltered = hasQuery || hasFilterSelections;

  // Filtered data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (file) =>
          file.reference_number.toLowerCase().includes(searchLower) ||
          file.vehicle_id.toLowerCase().includes(searchLower) ||
          file.port_call_id.toLowerCase().includes(searchLower) ||
          file.vehicle_info?.brand?.toLowerCase().includes(searchLower) ||
          file.vehicle_info?.model?.toLowerCase().includes(searchLower) ||
          file.assigned_inspector?.toLowerCase().includes(searchLower) ||
          file.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((file) => file.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== "all") {
      result = result.filter((file) => file.priority === filters.priority);
    }

    // Inspector filter
    if (filters.assignedInspector !== "all") {
      result = result.filter(
        (file) => file.assigned_inspector === filters.assignedInspector
      );
    }

    // Date filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (filters.dateRange) {
        case "today":
          result = result.filter((file) => {
            const fileDate = new Date(file.created_at);
            return fileDate >= today;
          });
          break;
        case "week": {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          result = result.filter((file) => {
            const fileDate = new Date(file.created_at);
            return fileDate >= weekAgo;
          });
          break;
        }
        case "month": {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          result = result.filter((file) => {
            const fileDate = new Date(file.created_at);
            return fileDate >= monthAgo;
          });
          break;
        }
        case "overdue":
          result = result.filter((file) => {
            if (!file.estimated_completion_date) return false;
            const estimatedDate = new Date(file.estimated_completion_date);
            return estimatedDate < today && file.status !== "Fermé";
          });
          break;
      }
    }

    return result;
  }, [data, filters]);

  // Propagate filtered data
  useEffect(() => {
    onFilterChange(filteredData);
  }, [filteredData, onFilterChange]);

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      assignedInspector: "all",
      dateRange: "all",
    });
  };

  // Unique inspectors for select options
  const uniqueInspectors = useMemo(() => {
    const inspectors = data
      .map((file) => file.assigned_inspector)
      .filter(
        (inspector): inspector is string =>
          typeof inspector === "string" && inspector.trim() !== ""
      );
    return [...new Set(inspectors)];
  }, [data]);

  type Option = { label: string; value: string };

  const statusOptions: Option[] = [
    { label: "Tous les statuts", value: "all" },
    { label: "Ouvert", value: "Ouvert" },
    { label: "En attente", value: "En attente" },
    { label: "Fermé", value: "Fermé" },
  ];
  const priorityOptions: Option[] = [
    { label: "Toutes les priorités", value: "all" },
    { label: "Faible", value: "Faible" },
    { label: "Moyenne", value: "Moyenne" },
    { label: "Élevée", value: "Élevée" },
    { label: "Urgente", value: "Urgente" },
  ];
  const inspectorOptions: Option[] = [
    { label: "Tous les inspecteurs", value: "all" },
    ...uniqueInspectors.map((i) => ({ label: i, value: i })),
  ];
  const periodOptions: Option[] = [
    { label: "Toutes les périodes", value: "all" },
    { label: "Aujourd'hui", value: "today" },
    { label: "Cette semaine", value: "week" },
    { label: "Ce mois", value: "month" },
    { label: "En retard", value: "overdue" },
  ];

  // Faceted single-select filter to mirror users DataTableFacetedFilter look & feel
  const FacetedSingleFilter = ({
    title,
    value,
    options,
    onChange,
  }: {
    title: string;
    value: string;
    options: Option[];
    onChange: (v: string) => void;
  }) => {
    const selected = options.find((o) => o.value === value);
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <Icons.plusCircled className="h-4 w-4" />
            {title}
            {value !== "all" && selected && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {selected.label}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="start">
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>Aucun résultat.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => onChange(option.value)}
                    >
                      <div
                        className={
                          "border-primary flex h-4 w-4 items-center justify-center rounded-sm border " +
                          (isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible")
                        }
                      >
                        <Icons.check className="h-4 w-4" />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {value !== "all" && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => onChange("all")}
                      className="justify-center text-center"
                    >
                      Effacer le filtre
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="h-8 w-[150px] lg:w-auto"
        />

        <div className="flex flex-wrap items-center gap-2">
          <FacetedSingleFilter
            title="Statut"
            value={filters.status}
            options={statusOptions}
            onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
          />
          <FacetedSingleFilter
            title="Priorité"
            value={filters.priority}
            options={priorityOptions}
            onChange={(v) => setFilters((p) => ({ ...p, priority: v }))}
          />
          <FacetedSingleFilter
            title="Inspecteur"
            value={filters.assignedInspector}
            options={inspectorOptions}
            onChange={(v) => setFilters((p) => ({ ...p, assignedInspector: v }))}
          />
          <FacetedSingleFilter
            title="Période"
            value={filters.dateRange}
            options={periodOptions}
            onChange={(v) => setFilters((p) => ({ ...p, dateRange: v }))}
          />
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
            title="Réinitialiser"
          >
            Réinitialiser
            <Icons.x className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right-aligned slot for future actions (mirrors users toolbar structure) */}
      <div className="flex items-center gap-2"></div>
    </div>
  );
};

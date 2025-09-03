import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PortCallFilters = ({
  searchTerm,
  onSearch,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: {
  searchTerm: string;
  onSearch: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Rechercher par agent, port ou ID..."
          value={searchTerm}
          onChange={(e: any) => onSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="En attente">En attente</SelectItem>
          <SelectItem value="En cours">En cours</SelectItem>
          <SelectItem value="Terminé">Terminé</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date d'arrivée</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="agent">Agent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

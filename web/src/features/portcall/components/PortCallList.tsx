import type { PortCall } from "../data/schema";
import { PortCallRow } from "./PortCallRow";

export const PortCallList = ({ portCalls, onView, onEdit, onDelete }: { portCalls: PortCall[]; onView: (id: number) => void; onEdit: (id: number) => void; onDelete: (id: number) => void; }) => {
  if (portCalls.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">Aucun Port Call trouvé</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {portCalls.map((pc) => (
        <PortCallRow key={pc.port_call_id} portCall={pc} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

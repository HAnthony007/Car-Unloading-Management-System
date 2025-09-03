import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PortCall } from "../data/schema";
import { getPortCallStatus } from "../lib/utils";

export const PortCallRow = ({
  portCall,
  onView,
  onEdit,
  onDelete,
}: {
  portCall: PortCall;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const status = getPortCallStatus(portCall);
  const imo = portCall.vessel?.imo_no ?? null;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Icons.area className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Port Call #{portCall.port_call_id}</h3>
                <Badge variant={status.variant} className={cn("text-xs", status.color)}>
                  {status.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icons.users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{portCall.vessel_agent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.file className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Port de provenance: {portCall.origin_port}</span>
                </div>
              </div>

              <div className="space-y-2">
                {status.key === "pending" && (
                  <div className="flex items-center gap-2">
                    <Icons.calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Date prévue d'arrivée: {new Date(portCall.estimated_arrival).toLocaleString()}</span>
                  </div>
                )}

                {status.key === "in_progress" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Icons.calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Arrivée: {new Date(portCall.arrival_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.calendar className="h-4 w-4 text-red-600" />
                      <span className="text-sm">ETD: {new Date(portCall.estimated_departure).toLocaleString()}</span>
                    </div>
                  </>
                )}

                {status.key === "completed" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Icons.calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Arrivée: {new Date(portCall.arrival_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.calendar className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Départ: {new Date(portCall.departure_date).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icons.car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Vessel {imo ? `IMO ${imo}` : `#${portCall.vessel_id}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.area className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Dock #{portCall.dock_id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={() => onView(portCall.port_call_id)} className="w-full">
              <Icons.eye className="h-4 w-4 mr-2" />Voir
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(portCall.port_call_id)} className="w-full">
              <Icons.edit className="h-4 w-4 mr-2" />Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(portCall.port_call_id)} className="w-full text-red-600 hover:text-red-700">
              <Icons.trash className="h-4 w-4 mr-2" />Supprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

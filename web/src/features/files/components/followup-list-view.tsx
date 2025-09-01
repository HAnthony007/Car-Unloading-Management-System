"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FollowupFile } from "../data/schema";
import {
    useFollowupOpenEditDialog,
    useFollowupOpenViewDialog,
} from "../store/followup-store";

interface FollowupListViewProps {
  data: FollowupFile[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ouvert":
      return "bg-green-100 text-green-800 border-green-200";
    case "En attente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Fermé":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "bg-red-100 text-red-800 border-red-200";
    case "Élevée":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Moyenne":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Faible":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getProgressPercentage = (
  workflowSteps: FollowupFile["workflow_steps"]
) => {
  if (workflowSteps.length === 0) return 0;
  const completed = workflowSteps.filter((step) => step.status === "Terminé").length;
  return Math.round((completed / workflowSteps.length) * 100);
};

export const FollowupListView = ({ data }: FollowupListViewProps) => {
  const openViewDialog = useFollowupOpenViewDialog();
  const openEditDialog = useFollowupOpenEditDialog();

  if (data.length === 0) {
    return (
      <div className="py-12 text-center">
        <Icons.file className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium text-muted-foreground">
          Aucun dossier de suivi
        </h3>
        <p className="text-muted-foreground">Commencez par créer votre premier dossier de suivi.</p>
      </div>
    );
  }

  const isOverdue = (f: FollowupFile) => {
    if (!f.estimated_completion_date) return false;
    const today = new Date();
    const d = new Date(f.estimated_completion_date);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate()) && f.status !== "Fermé";
  };

  const priorityBorder = (p: string) => {
    switch (p) {
      case "Urgente":
        return "border-l-red-400";
      case "Élevée":
        return "border-l-orange-400";
      case "Moyenne":
        return "border-l-yellow-400";
      case "Faible":
        return "border-l-green-400";
      default:
        return "border-l-muted";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      {/* Header (md+) */}
      <div className="hidden grid-cols-12 gap-3 border-b bg-muted/40 px-4 py-2 text-xs text-muted-foreground md:grid">
        <div className="col-span-2">Référence</div>
        <div className="col-span-3">Véhicule</div>
        <div className="col-span-2">Statut</div>
        <div className="col-span-2">Priorité</div>
        <div className="col-span-2">Échéance</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      <ul className="divide-y max-h-[60vh] overflow-y-auto">
        {data.map((file) => (
          <li
            key={file.id}
            className={`group relative transition-colors hover:bg-muted/40`}
          >
            <div
              className={`flex flex-col gap-3 p-4 md:grid md:grid-cols-12 md:items-center md:gap-3 md:p-3 border-l-4 ${priorityBorder(
                file.priority
              )}`}
            >
              {/* Référence */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {file.reference_number}
                  </span>
                  {isOverdue(file) && (
                    <Badge variant="secondary" className="px-1 py-0 text-[10px] text-red-600">
                      En retard
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground md:hidden">
                  <Icons.calendar className="h-3 w-3" />
                  Créé le {format(new Date(file.created_at), "dd/MM/yyyy", { locale: fr })}
                </div>
              </div>

              {/* Véhicule */}
              <div className="min-w-0 md:col-span-3">
                <p className="truncate text-sm text-muted-foreground">
                  {file.vehicle_info
                    ? `${file.vehicle_info.brand} ${file.vehicle_info.model} (${file.vehicle_info.year}) • ${file.vehicle_info.plate_number}`
                    : `Véhicule ${file.vehicle_id}`}
                </p>
                <div className="mt-1 hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                  {file.assigned_inspector && (
                    <span className="inline-flex items-center gap-1">
                      <Icons.user className="h-3 w-3" />
                      {file.assigned_inspector}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Icons.workflow className="h-3 w-3" />
                    {getProgressPercentage(file.workflow_steps)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div
                  className="mt-2 h-1 w-full rounded bg-muted"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={getProgressPercentage(file.workflow_steps)}
                  aria-label="Progression du workflow"
                >
                  <div
                    className="h-1 rounded bg-gradient-to-r from-gray-300 via-cyan-500 to-emerald-500 transition-all"
                    style={{ width: `${getProgressPercentage(file.workflow_steps)}%` }}
                  />
                </div>
              </div>

              {/* Statut */}
              <div className="md:col-span-2">
                <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
              </div>

              {/* Priorité */}
              <div className="md:col-span-2">
                <Badge className={getPriorityColor(file.priority)} variant="outline">
                  {file.priority}
                </Badge>
              </div>

              {/* Échéance */}
              <div className="md:col-span-2">
                {file.estimated_completion_date ? (
                  <span className={`inline-flex items-center gap-1 text-sm ${
                    isOverdue(file) ? "text-red-600" : "text-foreground"
                  }`}>
                    <Icons.clock className="h-4 w-4" />
                    {format(new Date(file.estimated_completion_date), "dd/MM/yyyy", { locale: fr })}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>

              {/* Actions */}
              <div className="md:col-span-1 md:justify-self-end">
                <div className="flex w-full items-center gap-2 md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-initial"
                    onClick={() => openViewDialog(file)}
                    aria-label={`Voir ${file.reference_number}`}
                  >
                    <Icons.eye className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Voir</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-initial"
                    onClick={() => openEditDialog(file)}
                    disabled={file.status === "Fermé"}
                    aria-label={`Modifier ${file.reference_number}`}
                  >
                    <Icons.edit className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Modifier</span>
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

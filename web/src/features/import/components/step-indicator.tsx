"use client";

import { CheckCircle, Eye, FileSpreadsheet, Upload } from "lucide-react";

type Props = {
  currentStep: "upload" | "validation" | "import" | "complete";
  railPercent: number;
  stepState: (idx: number) => "completed" | "active" | "upcoming";
  onStepClick: (idx: number) => void;
};

export function StepIndicator({ currentStep, railPercent, stepState, onStepClick }: Props) {
  return (
    <div className="mb-8">
      <div className="relative w-full max-w-5xl mx-auto py-3 md:py-4">
        {/* Rail */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-muted" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${railPercent}%` }}
        />

        <div className="relative grid grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="flex flex-col items-start cursor-pointer select-none" onClick={() => onStepClick(0)} role="button" aria-label="Aller à la sélection du fichier">
            <div className={`flex items-center gap-3 ${stepState(0) === "upcoming" ? "text-muted-foreground" : "text-primary"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ring-1 ring-border ${stepState(0) === "completed" ? "bg-primary text-primary-foreground" : stepState(0) === "active" ? "bg-primary/90 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="flex flex-col py-2">
                <span className="text-sm font-semibold leading-none mb-2">Sélection</span>
                <span className="text-xs text-muted-foreground">Choisir le fichier</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center cursor-pointer select-none" onClick={() => onStepClick(1)} role="button" aria-label="Aller à la validation">
            <div className={`flex items-center gap-3 ${stepState(1) === "upcoming" ? "text-muted-foreground" : "text-primary"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ring-1 ring-border ${stepState(1) === "completed" ? "bg-primary text-primary-foreground" : stepState(1) === "active" ? "bg-primary/90 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Eye className="h-5 w-5" />
              </div>
              <div className="flex flex-col py-2">
                <span className="text-sm font-semibold leading-none mb-2">Validation</span>
                <span className="text-xs text-muted-foreground">Contrôle des données</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-end cursor-pointer select-none" onClick={() => onStepClick(2)} role="button" aria-label="Aller à l'import">
            <div className={`flex items-center gap-3 ${stepState(2) === "upcoming" ? "text-muted-foreground" : "text-primary"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ring-1 ring-border ${stepState(2) !== "upcoming" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {currentStep === "complete" ? <CheckCircle className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
              </div>
              <div className="flex flex-col items-end py-2">
                <span className="text-sm font-semibold leading-none mb-2">Import</span>
                <span className="text-xs text-muted-foreground">Envoi et création</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useMemo, useState } from "react";

export type ImportStep = "upload" | "validation" | "import" | "complete";

type UseImportStepsParams = {
  isUploading: boolean;
  uploadProgress: number;
  hasFile: boolean;
  hasPreview: boolean;
  onStartImport: () => Promise<void> | void;
};

export function useImportSteps({
  isUploading,
  uploadProgress,
  hasFile,
  hasPreview,
  onStartImport,
}: UseImportStepsParams) {
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");

  const currentIndex = useMemo(() => {
    return currentStep === "upload" ? 0 : currentStep === "validation" ? 1 : 2;
  }, [currentStep]);

  const railPercent = useMemo(() => {
    if (currentStep === "upload") return 0;
    if (currentStep === "validation") return 50;
    if (currentStep === "import") return Math.min(100, 50 + uploadProgress / 2);
    return 100; // complete
  }, [currentStep, uploadProgress]);

  const stepState = useCallback(
    (idx: number) => (idx < currentIndex ? "completed" : idx === currentIndex ? "active" : "upcoming"),
    [currentIndex]
  );

  const handleStepClick = useCallback(
    async (idx: number) => {
      // Back navigation always allowed
      if (idx < currentIndex) {
        setCurrentStep(idx === 0 ? "upload" : "validation");
        return;
      }
      if (idx === currentIndex) return;

      // Forward navigation with guards
      if (idx === 1) {
        if (hasFile && hasPreview) setCurrentStep("validation");
        return;
      }
      if (idx === 2) {
        if (hasFile && !isUploading) {
          setCurrentStep("import");
          await onStartImport();
        }
      }
    },
    [currentIndex, hasFile, hasPreview, isUploading, onStartImport]
  );

  return {
    currentStep,
    setCurrentStep,
    currentIndex,
    railPercent,
    stepState,
    handleStepClick,
  } as const;
}

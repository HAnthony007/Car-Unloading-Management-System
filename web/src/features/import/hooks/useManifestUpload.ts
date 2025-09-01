"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadManifest, type ManifestApiResponse } from "../lib/api";
import type { ImportStats } from "../types/manifest";

export function useManifestUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");

  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startProgress = useCallback((totalRecords: number) => {
    startTimeRef.current = Date.now();
    setIsUploading(true);
    setUploadProgress(0);
    setImportStats({
      totalRecords,
      processedRecords: 0,
      successCount: 0,
      errorCount: 0,
      warningCount: 0,
      processingTime: 0,
      status: "processing",
    });
    progressTimerRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev < 90 ? Math.min(prev + 5, 90) : prev;
        setImportStats((s) =>
          s
            ? {
                ...s,
                processedRecords: Math.floor((next / 100) * (s.totalRecords || 0)),
                processingTime: Math.floor((Date.now() - startTimeRef.current) / 1000),
                status: "processing",
              }
            : s
        );
        return next;
      });
    }, 250);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = null;
    setIsUploading(false);
  }, []);

  const upload = useCallback(
    async (file: File, previewCount = 0) => {
      setErrors([]);
      setSuccess("");
      startProgress(previewCount);
      try {
        const payload: ManifestApiResponse = await uploadManifest(file);
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
        setUploadProgress(100);

        const data = payload?.data;
        const total = (data?.vehicles_created || 0) + (data?.vehicles_skipped || 0);
        setImportStats((prev) => ({
          totalRecords: total || prev?.totalRecords || 0,
          processedRecords: total,
          successCount: data?.vehicles_created || 0,
          errorCount: data?.errors?.length || 0,
          warningCount: 0,
          processingTime: Math.floor((Date.now() - startTimeRef.current) / 1000),
          status: "completed",
        }));

        if (data?.errors?.length) setErrors(data.errors);
        const successMsg = payload?.message || "Importation du manifeste terminée.";
        setSuccess(successMsg);
        toast.success(successMsg);
        return { ok: true as const };
      } catch (e) {
        const message = e instanceof Error ? e.message : "Echec de l'import";
        setErrors(message.split(/\n+/));
        toast.error(message);
        setImportStats((s) => (s ? { ...s, status: "failed" } : s));
        return { ok: false as const };
      } finally {
        stopProgress();
      }
    },
    [startProgress, stopProgress]
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setImportStats(null);
    setErrors([]);
    setSuccess("");
  }, []);

  return {
    // state
    isUploading,
    uploadProgress,
    importStats,
    errors,
    success,
    // actions
    upload,
    reset,
    setErrors,
    setSuccess,
    setImportStats,
  } as const;
}

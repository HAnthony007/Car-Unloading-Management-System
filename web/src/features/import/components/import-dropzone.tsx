"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Eye, FileSpreadsheet, Upload, X } from "lucide-react";

type Props = {
  isDragOver: boolean;
  file: File | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  onProceed: () => void;
};

export function ImportDropzone({ isDragOver, file, onDragOver, onDragLeave, onDrop, onFileSelect, onRemove, onProceed }: Props) {
  return (
    <Card className={`transition-all duration-200 ${isDragOver ? "ring-2 ring-primary ring-offset-2" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Sélection du fichier Excel
        </CardTitle>
        <CardDescription>
          Glissez-déposez votre fichier Excel ici ou cliquez pour sélectionner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {!file ? (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">Glissez-déposez votre fichier Excel ici</p>
                <p className="text-muted-foreground">ou cliquez pour parcourir</p>
              </div>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) onFileSelect(selectedFile);
                }}
                className="hidden"
                id="file-input"
              />
              <Button variant="outline" onClick={() => document.getElementById("file-input")?.click()} className="gap-2">
                <Upload className="h-4 w-4" />
                Sélectionner un fichier
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <p className="text-lg font-medium text-green-600">Fichier sélectionné</p>
                <p className="text-muted-foreground">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={onRemove} className="gap-2">
                  <X className="h-4 w-4" />
                  Supprimer
                </Button>
                <Button onClick={onProceed} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Valider les données
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

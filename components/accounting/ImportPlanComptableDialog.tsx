"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PlanComptableImportApiService } from "@/src/lib2/services/PlanComptableImportApiService";
import { ImportResult } from "@/src/lib2/models/ImportResult";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImportPlanComptableDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ImportPlanComptableDialog({ isOpen, onClose, onSuccess }: ImportPlanComptableDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            const validTypes = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
                "text/csv", // csv
            ];

            if (!validTypes.includes(selected.type) && !selected.name.endsWith('.csv') && !selected.name.endsWith('.xlsx')) {
                toast.error("Format de fichier non supporté. Veuillez utiliser .xlsx ou .csv");
                return;
            }
            setFile(selected);
            setResult(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setIsUploading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await PlanComptableImportApiService.importPlanComptable(formData);

            if (response.success && response.data) {
                setResult(response.data);
                toast.success(response.message || "Import terminé avec succès");
                onSuccess();
            } else {
                toast.error(response.message || "Erreur lors de l'import");
                if (response.errors && response.errors.length > 0) {
                    setResult({ imported: 0, updated: 0, skipped: 0, errors: response.errors });
                }
            }
        } catch (error: any) {
            console.error("Import error:", error);
            toast.error("Erreur serveur lors de l'import");
            setResult({ imported: 0, updated: 0, skipped: 0, errors: [error.message || "Erreur inattendue"] });
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        setIsUploading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Importer un Plan Comptable</DialogTitle>
                    <DialogDescription>
                        Importez vos comptes depuis un fichier .xlsx ou .csv.
                        Colonnes attendues : <strong>no_compte, libelle, notes</strong> (optionnel).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {!result ? (
                        <>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept=".csv, .xlsx"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center cursor-pointer"
                                >
                                    <FileSpreadsheet className="h-10 w-10 text-gray-400 mb-3" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {file ? file.name : "Cliquez ou glissez pour uploader"}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">
                                        Format XLSX ou CSV (max 5MB)
                                    </span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-2">
                                <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={!file || isUploading}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Importation...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Importer
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                    <div className="text-2xl font-bold text-emerald-600">{result.imported}</div>
                                    <div className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Importés</div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <div className="text-2xl font-bold text-blue-600">{result.updated}</div>
                                    <div className="text-xs text-blue-700 font-medium uppercase tracking-wide">Mis à jour</div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                    <div className="text-2xl font-bold text-amber-600">{result.skipped}</div>
                                    <div className="text-xs text-amber-700 font-medium uppercase tracking-wide">Ignorés</div>
                                </div>
                            </div>

                            {result.errors && result.errors.length > 0 && (
                                <Alert variant="destructive" className="max-h-40 overflow-y-auto">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Erreurs rencontrées ({result.errors.length})</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc pl-4 mt-2 text-xs space-y-1">
                                            {result.errors.slice(0, 10).map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                            {result.errors.length > 10 && (
                                                <li>...et {result.errors.length - 10} autres erreurs.</li>
                                            )}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex justify-end mt-2">
                                <Button onClick={handleClose}>Fermer</Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

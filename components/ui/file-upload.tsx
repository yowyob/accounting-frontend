"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface FileUploadProps {
    onUpload: (files: File[]) => Promise<void>;
    accept?: Record<string, string[]>;
    maxSize?: number;
    maxFiles?: number;
    isUploading?: boolean;
    className?: string;
    uploadedFiles?: { id: string, name: string }[];
    onRemoveFile?: (id: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onUpload,
    accept,
    maxSize = 10 * 1024 * 1024, // 10MB Default
    maxFiles = 5,
    isUploading = false,
    className,
    uploadedFiles = [],
    onRemoveFile
}) => {
    const [localFiles, setLocalFiles] = useState<File[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                setLocalFiles(acceptedFiles);
                onUpload(acceptedFiles).then(() => {
                    setLocalFiles([]);
                });
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles,
        disabled: isUploading,
    });

    return (
        <div className={cn("space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-300",
                    isDragActive && "border-blue-500 bg-blue-50",
                    isDragReject && "border-red-500 bg-red-50",
                    isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
            >
                <input {...getInputProps()} />
                <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100 mb-3">
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    ) : (
                        <UploadCloud className={cn("w-8 h-8 text-gray-400", isDragActive && "text-blue-500", isDragReject && "text-red-500")} />
                    )}
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-gray-700">
                        {isUploading
                            ? "Téléversement en cours..."
                            : isDragActive
                                ? "Déposez les fichiers ici"
                                : "Cliquez ou glissez-déposez vos fichiers"}
                    </p>
                    <p className="text-xs text-gray-500">
                        PNG, JPG, PDF jusqu'à {Math.round(maxSize / 1024 / 1024)}MB
                    </p>
                </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Pièces jointes ({uploadedFiles.length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded">
                                        <File className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 truncate" title={file.name}>{file.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    {onRemoveFile && (
                                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onRemoveFile(file.id); }}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

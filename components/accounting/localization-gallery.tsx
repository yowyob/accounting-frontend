// components/accounting/localization-gallery.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, CheckCircle2, Download, ArrowRight, ShieldCheck, Landmark, Building2, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface LocalizationPack {
    id: string;
    country: string;
    countryCode: string;
    icon: React.ReactNode;
    name: string;
    version: string;
    description: string;
    compatibility: 'full' | 'partial' | 'incompatible';
}

export const AVAILABLE_PACKS: LocalizationPack[] = [
    {
        id: 'ohada',
        country: 'Espace OHADA',
        countryCode: 'OHADA',
        icon: <Globe className="h-5 w-5 text-indigo-500" />,
        name: 'Pack Fiscalité OHADA (SYSCOA)',
        version: '2026.1',
        description: 'Référentiel standardisé pour les 17 pays membres de l\'OHADA.',
        compatibility: 'full'
    },
    {
        id: 'france',
        country: 'France',
        countryCode: 'FR',
        icon: <Landmark className="h-5 w-5 text-blue-500" />,
        name: 'Plan Comptable Général (PCG)',
        version: '2025.4',
        description: 'Conforme aux normes ANC. Inclus export FEC.',
        compatibility: 'incompatible'
    },
    {
        id: 'maroc',
        country: 'Maroc',
        countryCode: 'MA',
        icon: <Building2 className="h-5 w-5 text-red-500" />,
        name: 'Normalisation Comptable (CGNC)',
        version: '2025.1',
        description: 'Adapté à la loi fiscale marocaine.',
        compatibility: 'incompatible'
    },
    {
        id: 'belgique',
        country: 'Belgique',
        countryCode: 'BE',
        icon: <MapPin className="h-5 w-5 text-amber-500" />,
        name: 'Min. Normalisé (PCMN)',
        version: '2024.2',
        description: 'Localisation complète pour les PME belges.',
        compatibility: 'incompatible'
    }
];

interface LocalizationGalleryProps {
    onSelectPack: (packId: string) => void;
    installedPackId?: string | null;
}

export const LocalizationGallery: React.FC<LocalizationGalleryProps> = ({ onSelectPack, installedPackId }) => {
    const [downloadedPacks, setDownloadedPacks] = useState<Set<string>>(new Set(['ohada']));
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('downloaded_packs');
        if (saved) setDownloadedPacks(new Set(JSON.parse(saved)));
    }, []);

    const handleDownload = async (e: React.MouseEvent, packId: string) => {
        e.stopPropagation();
        setDownloading(packId);
        // Simulate download
        await new Promise(resolve => setTimeout(resolve, 2000));

        const next = new Set(downloadedPacks);
        next.add(packId);
        setDownloadedPacks(next);
        localStorage.setItem('downloaded_packs', JSON.stringify(Array.from(next)));
        setDownloading(null);

        toast.success(`Pack ${packId.toUpperCase()} téléchargé`, {
            description: "Le pack est maintenant disponible pour installation."
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_PACKS.map((pack) => {
                const isActive = pack.id === installedPackId;
                const isDownloaded = downloadedPacks.has(pack.id);
                const isDownloading = downloading === pack.id;

                return (
                    <Card
                        key={pack.id}
                        className={`group border transition-all hover:shadow-md cursor-pointer ${isActive ? 'border-green-500 bg-green-50/10' : 'border-gray-100'}`}
                        onClick={() => onSelectPack(pack.id)}
                    >
                        <CardHeader className="pb-2 pt-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                    {pack.icon}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {isActive && (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none text-[10px] px-2 py-0">
                                            Actif
                                        </Badge>
                                    )}
                                    {isDownloaded && !isActive && (
                                        <Badge variant="outline" className="text-blue-600 border-blue-200 text-[10px] px-2 py-0">
                                            Téléchargé
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <CardTitle className="text-sm font-bold truncate">
                                {pack.name}
                            </CardTitle>
                            <div className="text-[11px] font-medium text-gray-400">
                                {pack.country} • v{pack.version}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <p className="text-[12px] text-gray-500 leading-tight line-clamp-2">
                                {pack.description}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <Button
                                onClick={(e) => isDownloaded ? null : handleDownload(e, pack.id)}
                                variant="ghost"
                                size="sm"
                                disabled={isDownloaded || isDownloading || isActive}
                                className={`h-7 text-[10px] uppercase font-black ${isDownloaded ? 'text-green-600' : 'text-indigo-600 hover:bg-indigo-50'}`}
                            >
                                {isDownloading ? (
                                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> ...</>
                                ) : isDownloaded || isActive ? (
                                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Prêt</>
                                ) : (
                                    <><Download className="h-3 w-3 mr-1" /> Télécharger</>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[12px] text-gray-400 hover:text-indigo-600 hover:bg-transparent px-0"
                            >
                                Détails <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}

            <Card className="border border-dashed border-gray-200 bg-gray-50/30 flex flex-col items-center justify-center p-6 grayscale opacity-60">
                <Globe className="h-6 w-6 text-gray-300 mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bientôt disponible</p>
            </Card>
        </div>
    );
};

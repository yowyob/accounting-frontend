"use client";

import React, { useState, useEffect } from 'react';
import { LocalizationGallery } from '@/components/accounting/localization-gallery';
import { LocalizationPackDetails } from '@/components/accounting/localization-pack-details';
import { toast } from 'sonner';
import { Globe, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FiscalLocalizationPage() {
    const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
    const [isInstalling, setIsInstalling] = useState(false);
    const [installedPackId, setInstalledPackId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('installed_localization_id');
            if (saved) setInstalledPackId(saved);
        }
    }, []);

    const handleInstall = async (data: { packId: string, method: 'fusion' | 'ecrasement', selections: any }) => {
        setIsInstalling(true);
        // Simule un délai d'installation complexe
        await new Promise((resolve) => setTimeout(resolve, 3000));

        localStorage.setItem('installed_localization_id', data.packId);
        setInstalledPackId(data.packId);
        setIsInstalling(false);
        setSelectedPackId(null);

        const selectionCount = Object.values(data.selections).filter(Boolean).length;

        toast.success(`Pack ${data.packId.toUpperCase()} ${data.method === 'fusion' ? 'fusionné' : 'installé'} !`, {
            description: `${selectionCount} composants ont été ${data.method === 'fusion' ? 'intégrés à' : 'appliqués sur'} votre comptabilité.`,
            duration: 6000,
        });
    };

    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-100/30">
            <div className="w-full max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Fiscalité & Localisation</h2>
                            <p className="text-sm text-gray-500 font-medium">
                                Adaptez votre ERP aux normes légales et fiscales de votre pays.
                            </p>
                        </div>
                    </div>

                    {installedPackId && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-100 rounded-full">
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-green-600 leading-none">Système Actif</span>
                                <span className="text-xs font-bold text-green-900">{installedPackId.toUpperCase()} SYSCOA</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[600px] transition-all">
                    {!selectedPackId ? (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-gray-800">Galerie des Packs Disponibles</h3>
                                <p className="text-sm text-gray-400">Sélectionnez un pack pour consulter ses détails et l'installer.</p>
                            </div>
                            <LocalizationGallery
                                onSelectPack={(id) => setSelectedPackId(id)}
                                installedPackId={installedPackId}
                            />
                        </div>
                    ) : (
                        <LocalizationPackDetails
                            packId={selectedPackId}
                            onBack={() => setSelectedPackId(null)}
                            onInstall={handleInstall}
                            isInstalling={isInstalling}
                            currentLocalization={installedPackId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

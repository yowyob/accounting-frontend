// components/accounting/localization-pack-details.tsx
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    Download,
    CheckCircle,
    BookOpen,
    Info,
    Shield,
    Layers,
    FileText,
    Settings,
    AlertCircle,
    Check,
    ArrowLeft,
    MonitorCheck,
    Globe,
    Landmark,
    Building2,
    MapPin,
    ChevronDown,
    ChevronRight,
    Loader2
} from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

// --- PACK DATA ---
const PACK_DATA: Record<string, any> = {
    ohada: {
        id: 'ohada',
        name: 'Pack Fiscalité OHADA (SYSCOA Révisé)',
        icon: <Globe className="h-8 w-8" />,
        comptes: [
            { numero: '101', libelle: 'Capital social', classe: 'Classe 1', type: 'Passif' },
            { numero: '161', libelle: 'Emprunts obligataires', classe: 'Classe 1', type: 'Passif' },
            { numero: '244', libelle: 'Matériel informatique', classe: 'Classe 2', type: 'Actif' },
            { numero: '401', libelle: 'Fournisseurs', classe: 'Classe 4', type: 'Passif' },
            { numero: '411', libelle: 'Clients', classe: 'Classe 4', type: 'Actif' },
            { numero: '521', libelle: 'Banques locales', classe: 'Classe 5', type: 'Actif' },
            { numero: '601', libelle: 'Achats de marchandises', classe: 'Classe 6', type: 'Charge' },
            { numero: '701', libelle: 'Ventes de marchandises', classe: 'Classe 7', type: 'Produit' },
            { numero: '811', libelle: 'Charges Hors Activités Ordinaires', classe: 'Classe 8', type: 'Charge' },
            { numero: '921', libelle: 'Centres d\'analyse (Analytique)', classe: 'Classe 9', type: 'Autre' },
        ],
        taxes: [
            { code: 'TVA19.25', libelle: 'TVA Taux Normal (CEMAC)', taux: 19.25, type: 'Collectée/Déductible' },
            { code: 'TVA10', libelle: 'TVA Taux Réduit', taux: 10, type: 'Collectée/Déductible' },
        ],
        journaux: [
            { code: 'ACH', libelle: 'Journal des Achats', usage: 'Factures fournisseurs' },
            { code: 'VEN', libelle: 'Journal des Ventes', usage: 'Factures clients' },
        ],
        rapports: [
            { nom: 'Bilan (Système Normal)', description: 'Tableau de synthèse patrimoniale.' },
            { nom: 'Compte de Résultat', description: 'Performance de l\'exercice.' },
            { nom: 'Tableau des Flux de Trésorerie', description: 'Variation des liquidités.' },
        ]
    },
    france: {
        id: 'france',
        name: 'Plan Comptable Général (FR)',
        icon: <Landmark className="h-8 w-8" />,
        comptes: [
            { numero: '101', libelle: 'Capital social', classe: 'Classe 1', type: 'Passif' },
            { numero: '2183', libelle: 'Matériel informatique', classe: 'Classe 2', type: 'Actif' },
            { numero: '401', libelle: 'Fournisseurs', classe: 'Classe 4', type: 'Passif' },
            { numero: '512', libelle: 'Banque', classe: 'Classe 5', type: 'Actif' },
            { numero: '607', libelle: 'Achats de marchandises', classe: 'Classe 6', type: 'Charge' },
            { numero: '707', libelle: 'Ventes de marchandises', classe: 'Classe 7', type: 'Produit' },
        ],
        taxes: [
            { code: 'TVA20', libelle: 'TVA France 20%', taux: 20, type: 'Collectée/Déductible' },
            { code: 'TVA5.5', libelle: 'TVA France 5.5%', taux: 5.5, type: 'Collectée/Déductible' },
        ],
        journaux: [
            { code: 'AC', libelle: 'Journal des Achats', usage: 'Factures fournisseurs' },
            { code: 'VE', libelle: 'Journal des Ventes', usage: 'Factures clients' },
        ],
        rapports: [
            { nom: 'Bilan Actif/Passif', description: 'Conforme liasse fiscale FR.' },
            { nom: 'Compte de Résultat (SIG)', description: 'Soldes Intermédiaires de Gestion.' },
        ]
    },
    maroc: {
        id: 'maroc',
        name: 'Normalisation Comptable (MA)',
        icon: <Building2 className="h-8 w-8" />,
        comptes: [
            { numero: '1111', libelle: 'Capital social', classe: 'Classe 1', type: 'Passif' },
            { numero: '2332', libelle: 'Matériel informatique', classe: 'Classe 2', type: 'Actif' },
            { numero: '4411', libelle: 'Fournisseurs', classe: 'Classe 4', type: 'Passif' },
            { numero: '5141', libelle: 'Banques (solde débiteur)', classe: 'Classe 5', type: 'Actif' },
            { numero: '6111', libelle: 'Achats de marchandises', classe: 'Classe 6', type: 'Charge' },
            { numero: '7111', libelle: 'Ventes de marchandises', classe: 'Classe 7', type: 'Produit' },
        ],
        taxes: [
            { code: 'TVA20', libelle: 'TVA Maroc 20%', taux: 20, type: 'Collectée/Déductible' },
            { code: 'TVA14', libelle: 'TVA Maroc 14%', taux: 14, type: 'Collectée/Déductible' },
        ],
        journaux: [
            { code: 'ACH', libelle: 'Journal des Achats', usage: 'Factures fournisseurs' },
            { code: 'VEN', libelle: 'Journal des Ventes', usage: 'Factures clients' },
        ],
        rapports: [
            { nom: 'Bilan (Modèle comptable)', description: 'Conforme CGNC Maroc.' },
            { nom: 'CPC (Compte de Produits et Charges)', description: 'Analyse des flux de revenus.' },
        ]
    }
};

const CLASSES_LIST = ['Classe 1', 'Classe 2', 'Classe 3', 'Classe 4', 'Classe 5', 'Classe 6', 'Classe 7', 'Classe 8', 'Classe 9'];

interface LocalizationPackDetailsProps {
    packId: string;
    onBack: () => void;
    onInstall: (data: any) => void;
    isInstalling?: boolean;
    currentLocalization?: string | null;
}

export const LocalizationPackDetails: React.FC<LocalizationPackDetailsProps> = ({
    packId,
    onBack,
    onInstall,
    isInstalling = false,
    currentLocalization
}) => {
    const data = PACK_DATA[packId] || PACK_DATA.ohada;
    const isAlreadyActive = packId === currentLocalization;

    const [isDownloaded, setIsDownloaded] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('downloaded_packs');
        if (saved) {
            const list = JSON.parse(saved);
            setIsDownloaded(list.includes(packId));
        }
    }, [packId]);

    // Components selection state
    const [selections, setSelections] = useState({
        comptes: true,
        taxes: true,
        journaux: true,
        rapports: true
    });

    // Detailed accounts selection state
    const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Initially select all accounts
        setSelectedAccounts(new Set(data.comptes.map((c: any) => c.numero)));
    }, [data]);

    // Installation method state
    const [method, setMethod] = useState<'fusion' | 'ecrasement'>('fusion');
    const [searchTerm, setSearchTerm] = useState('');

    // Compatibility check logic
    const isCompatible = useMemo(() => {
        if (!currentLocalization) return true;
        return currentLocalization === packId;
    }, [packId, currentLocalization]);

    const handleDownload = async () => {
        setDownloading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const saved = localStorage.getItem('downloaded_packs');
        const list = saved ? JSON.parse(saved) : [];
        if (!list.includes(packId)) list.push(packId);
        localStorage.setItem('downloaded_packs', JSON.stringify(list));

        setIsDownloaded(true);
        setDownloading(false);
        toast.success("Pack téléchargé avec succès");
    };

    const handleAccountToggle = (numero: string) => {
        setSelectedAccounts(prev => {
            const next = new Set(prev);
            if (next.has(numero)) next.delete(numero);
            else next.add(numero);
            return next;
        });
    };

    const handleClassToggle = (classe: string, checked: boolean) => {
        setSelectedAccounts(prev => {
            const next = new Set(prev);
            data.comptes.filter((c: any) => c.classe === classe).forEach((c: any) => {
                if (checked) next.add(c.numero);
                else next.delete(c.numero);
            });
            return next;
        });
    };

    const handleInstallClick = () => {
        if (isAlreadyActive) {
            toast.info("Pack déjà actif", { description: "Ce pack est déjà appliqué à votre comptabilité." });
            return;
        }

        if (method === 'fusion' && !isCompatible) {
            toast.error("Compatibilité refusée", {
                description: `Structure incompatible entre ${packId.toUpperCase()} et ${currentLocalization?.toUpperCase()}. Utilisez 'Remplacer' si besoin.`,
            });
            return;
        }

        onInstall({
            packId,
            method,
            selections: {
                ...selections,
                selectedAccounts: Array.from(selectedAccounts)
            }
        });
    };

    const filteredComptes = data.comptes.filter((c: any) =>
        c.numero.includes(searchTerm) || c.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la galerie
                </Button>
                {isAlreadyActive && (
                    <Badge className="bg-green-100 text-green-700 border-none px-4 py-1">
                        <CheckCircle className="h-4 w-4 mr-2" /> SYSTÈME ACTUELLEMENT ACTIF
                    </Badge>
                )}
            </div>

            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white overflow-hidden shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm border border-indigo-50">
                                {data.icon}
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-2xl text-indigo-900">{data.name}</CardTitle>
                                <CardDescription>Version 2026.1 — {isDownloaded ? 'Stocké localement' : 'Disponible sur le Cloud'}</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {!isDownloaded ? (
                                <Button onClick={handleDownload} disabled={downloading} className="bg-indigo-600 hover:bg-indigo-700">
                                    {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Download className="h-4 w-4 mr-2" /> Télécharger</>}
                                </Button>
                            ) : (
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-white">
                                    <Check className="h-4 w-4 mr-2" /> Téléchargé
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Granular Component Toggles */}
                    <div className="p-4 bg-white rounded-xl border border-indigo-50 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['comptes', 'taxes', 'journaux', 'rapports'].map((comp) => (
                            <div key={comp} className="flex items-center gap-3">
                                <Switch
                                    checked={selections[comp as keyof typeof selections]}
                                    onCheckedChange={(val) => setSelections(prev => ({ ...prev, [comp]: val }))}
                                    disabled={!isDownloaded || isAlreadyActive}
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold capitalize text-gray-700">{comp === 'comptes' ? 'Plan Comptable' : comp}</span>
                                    <span className="text-[10px] text-gray-400">{isDownloaded ? 'Prêt' : 'À télécharger'}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Compatibility Warning */}
                    {!isCompatible && !isAlreadyActive && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-900 text-sm">Alerte de Incompatibilité</p>
                                <p className="text-xs text-red-700 leading-relaxed">
                                    Structure divergente détectée avec votre système actuel ({currentLocalization?.toUpperCase()}).
                                    Seul le **Remplacement Complet** est autorisé pour garantir l'intégrité comptable.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Install Options */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900">Options d'application</h4>
                        <RadioGroup
                            value={method}
                            onValueChange={(val) => setMethod(val as any)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            disabled={!isDownloaded || isAlreadyActive}
                        >
                            <div className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${method === 'fusion' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-100'}`} onClick={() => !isAlreadyActive && isDownloaded && setMethod('fusion')}>
                                <RadioGroupItem value="fusion" id="r-fusion" disabled={!isDownloaded || isAlreadyActive} />
                                <Label htmlFor="r-fusion" className="cursor-pointer space-y-1">
                                    <span className="font-bold block text-sm">Fusionner avec l'existant</span>
                                    <span className="text-[10px] text-gray-500 block leading-tight">Conserve vos comptes personnalisés.</span>
                                </Label>
                            </div>
                            <div className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${method === 'ecrasement' ? 'border-red-600 bg-red-50/30' : 'border-gray-100'}`} onClick={() => !isAlreadyActive && isDownloaded && setMethod('ecrasement')}>
                                <RadioGroupItem value="ecrasement" id="r-ecrasement" disabled={!isDownloaded || isAlreadyActive} />
                                <Label htmlFor="r-ecrasement" className="cursor-pointer space-y-1">
                                    <span className="font-bold block text-sm text-red-700">Remplacer complètement</span>
                                    <span className="text-[10px] text-gray-400 block leading-tight">Supprime tout pour réinitialiser aux normes {packId.toUpperCase()}.</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter className="bg-white border-t border-indigo-50 p-6 flex justify-between items-center">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        <MonitorCheck className="h-4 w-4" /> {isAlreadyActive ? "Pack actuellement actif sur le système" : "Vérification effectuée"}
                    </div>
                    {!isAlreadyActive && (
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleDownload} disabled={isDownloaded || downloading}>
                                {isDownloaded ? "Téléchargé" : "Juste Télécharger"}
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleInstallClick}
                                disabled={isInstalling || !isDownloaded}
                                className="bg-indigo-600 hover:bg-indigo-700 px-10 shadow-lg shadow-indigo-100"
                            >
                                {isInstalling ? "Application..." : "Appliquer la sélection"}
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Tabs defaultValue="comptes" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-11 bg-gray-100/50 p-1">
                    <TabsTrigger value="comptes">Plan Comptable</TabsTrigger>
                    <TabsTrigger value="taxes">Taxes</TabsTrigger>
                    <TabsTrigger value="journaux">Journaux</TabsTrigger>
                    <TabsTrigger value="rapports">Reporting</TabsTrigger>
                </TabsList>

                <TabsContent value="comptes" className="mt-4 space-y-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher un compte..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>
                        <div className="flex gap-1 overflow-x-auto pb-1 max-w-[60%]">
                            {CLASSES_LIST.map(cls => {
                                const classComptes = data.comptes.filter((c: any) => c.classe === cls);
                                const isSelected = classComptes.every((c: any) => selectedAccounts.has(c.numero));
                                return (
                                    <Button
                                        key={cls}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClassToggle(cls, !isSelected)}
                                        className={`h-7 px-2 text-[10px] ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}`}
                                    >
                                        {cls.split(' ')[1]} {isSelected ? '✓' : ''}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden max-h-[400px] overflow-y-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="w-12 text-center">Inclure</TableHead>
                                    <TableHead className="w-24">N° Compte</TableHead>
                                    <TableHead>Libellé Standard</TableHead>
                                    <TableHead>Classe</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredComptes.map((c: any) => (
                                    <TableRow key={c.numero} className={selectedAccounts.has(c.numero) ? 'bg-indigo-50/20' : 'opacity-50'}>
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={selectedAccounts.has(c.numero)}
                                                onCheckedChange={() => handleAccountToggle(c.numero)}
                                                disabled={isAlreadyActive}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono font-bold text-indigo-700">{c.numero}</TableCell>
                                        <TableCell className="font-medium text-xs">{c.libelle}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-[10px]">{c.classe}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Taxes, Journaux, Rapports tabs remain similar but updated with more mock data if needed */}
                <TabsContent value="taxes" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.taxes.map((t: any) => (
                            <div key={t.code} className="p-3 rounded-xl border border-slate-100 bg-white flex justify-between items-center shadow-sm">
                                <div className="space-y-0.5">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[10px] h-4">{t.code}</Badge>
                                    <h5 className="text-xs font-bold leading-tight">{t.libelle}</h5>
                                </div>
                                <span className="text-xl font-black text-indigo-600">{t.taux}%</span>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="journaux" className="mt-4">
                    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="w-20">Code</TableHead>
                                    <TableHead>Libellé</TableHead>
                                    <TableHead>Usage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.journaux.map((j: any) => (
                                    <TableRow key={j.code}>
                                        <TableCell className="font-bold text-sm">{j.code}</TableCell>
                                        <TableCell className="text-sm">{j.libelle}</TableCell>
                                        <TableCell className="text-[11px] text-gray-500 italic">{j.usage}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="rapports" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.rapports.map((r: any) => (
                            <div key={r.nom} className="p-4 rounded-xl border border-slate-100 bg-white flex items-start gap-3 shadow-sm hover:border-indigo-200 transition-colors">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <h5 className="text-xs font-bold leading-tight">{r.nom}</h5>
                                    <p className="text-[10px] text-gray-400 leading-tight">{r.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

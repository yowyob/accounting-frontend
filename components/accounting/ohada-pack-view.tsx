// components/accounting/ohada-pack-view.tsx
"use client";

import React, { useState } from 'react';
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
    Calendar,
    Settings,
    AlertCircle,
    Check
} from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface OhadaCompte {
    numero: string;
    libelle: string;
    classe: string;
    type: string;
}

// Référentiel OHADA SYSCOA - comptes standards
export const OHADA_COMPTES: OhadaCompte[] = [
    // Classe 1 - Comptes de ressources durables
    { numero: '10', libelle: 'Capital', classe: 'Classe 1', type: 'Passif' },
    { numero: '101', libelle: 'Capital social', classe: 'Classe 1', type: 'Passif' },
    { numero: '11', libelle: 'Réserves', classe: 'Classe 1', type: 'Passif' },
    { numero: '12', libelle: 'Report à nouveau', classe: 'Classe 1', type: 'Passif' },
    { numero: '13', libelle: 'Résultat de l\'exercice', classe: 'Classe 1', type: 'Passif' },
    { numero: '16', libelle: 'Emprunts et dettes assimilées', classe: 'Classe 1', type: 'Passif' },
    // Classe 2 - Actif immobilisé
    { numero: '21', libelle: 'Immobilisations incorporelles', classe: 'Classe 2', type: 'Actif' },
    { numero: '22', libelle: 'Terrains', classe: 'Classe 2', type: 'Actif' },
    { numero: '23', libelle: 'Bâtiments, installations techniques', classe: 'Classe 2', type: 'Actif' },
    { numero: '24', libelle: 'Matériel', classe: 'Classe 2', type: 'Actif' },
    { numero: '244', libelle: 'Matériel informatique', classe: 'Classe 2', type: 'Actif' },
    { numero: '245', libelle: 'Matériel de transport', classe: 'Classe 2', type: 'Actif' },
    // Classe 3 - Stocks
    { numero: '31', libelle: 'Marchandises', classe: 'Classe 3', type: 'Actif' },
    { numero: '32', libelle: 'Matières premières et fournitures', classe: 'Classe 3', type: 'Actif' },
    // Classe 4 - Tiers
    { numero: '401', libelle: 'Fournisseurs', classe: 'Classe 4', type: 'Passif' },
    { numero: '411', libelle: 'Clients', classe: 'Classe 4', type: 'Actif' },
    { numero: '421', libelle: 'Personnel - Rémunérations dues', classe: 'Classe 4', type: 'Passif' },
    { numero: '445', libelle: 'État - Taxes sur le chiffre d\'affaires', classe: 'Classe 4', type: 'Passif' },
    // Classe 5 - Trésorerie
    { numero: '521', libelle: 'Banques locales', classe: 'Classe 5', type: 'Actif' },
    { numero: '571', libelle: 'Caisse siège social', classe: 'Classe 5', type: 'Actif' },
    // Classe 6 - Charges
    { numero: '601', libelle: 'Achats de marchandises', classe: 'Classe 6', type: 'Charge' },
    { numero: '641', libelle: 'Appointements et salaires', classe: 'Classe 6', type: 'Charge' },
    { numero: '62', libelle: 'Services extérieurs', classe: 'Classe 6', type: 'Charge' },
    // Classe 7 - Produits
    { numero: '701', libelle: 'Ventes de produits finis', classe: 'Classe 7', type: 'Produit' },
    { numero: '706', libelle: 'Ventes de prestations de services', classe: 'Classe 7', type: 'Produit' },
];

export const OHADA_TAXES = [
    { code: 'TVA19.25', libelle: 'TVA Taux Normal (CEMAC/Cameroun)', taux: 19.25, type: 'Collectée/Déductible' },
    { code: 'TVA18', libelle: 'TVA Taux Normal (UEMOA)', taux: 18, type: 'Collectée/Déductible' },
    { code: 'TVA10', libelle: 'TVA Taux Réduit', taux: 10, type: 'Collectée/Déductible' },
    { code: 'TVA0', libelle: 'TVA Exonérée', taux: 0, type: 'Exonérée' },
    { code: 'AIR', libelle: 'Acompte Impôt Revenu', taux: 2.2, type: 'Retenue' },
];

export const OHADA_JOURNALS = [
    { code: 'ACH', libelle: 'Journal des Achats', usage: 'Factures fournisseurs' },
    { code: 'VEN', libelle: 'Journal des Ventes', usage: 'Factures clients' },
    { code: 'BNQ', libelle: 'Journal de Banque', usage: 'Opérations bancaires' },
    { code: 'CAI', libelle: 'Journal de Caisse', usage: 'Opérations espèces' },
    { code: 'OD', libelle: 'Opérations Diverses', usage: 'Régularisations' },
    { code: 'PAI', libelle: 'Journal de Paie', usage: 'Écritures de salaires' },
];

export const OHADA_REPORTS = [
    { nom: 'Bilan (Système Normal)', description: 'État de la situation patrimoniale' },
    { nom: 'Compte de Résultat', description: 'Performance de l\'exercice' },
    { nom: 'Tableau des Flux de Trésorerie', description: 'Variation des liquidités' },
    { nom: 'DSF (Liasse Fiscale)', description: 'Déclaration Statistique et Fiscale complète' },
];

const CLASSES = ['Classe 1', 'Classe 2', 'Classe 3', 'Classe 4', 'Classe 5', 'Classe 6', 'Classe 7'];

interface OhadaPackViewProps {
    onImport: (options: { method: 'fusion' | 'ecrasement' }) => void;
    isImporting?: boolean;
    isImported?: boolean;
}

export const OhadaPackView: React.FC<OhadaPackViewProps> = ({
    onImport,
    isImporting = false,
    isImported = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClasse, setSelectedClasse] = useState<string | null>(null);
    const [importMethod, setImportMethod] = useState<'fusion' | 'ecrasement'>('fusion');

    const filteredComptes = OHADA_COMPTES.filter((c) => {
        const matchSearch =
            c.numero.includes(searchTerm) ||
            c.libelle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchClasse = !selectedClasse || c.classe === selectedClasse;
        return matchSearch && matchClasse;
    });

    return (
        <div className="space-y-8">
            {/* Header / Summary Card */}
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white overflow-hidden shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="text-indigo-900 border-l-4 border-indigo-600 pl-3">
                                Localisation Fiscale OHADA (SYSCOA)
                            </CardTitle>
                            <CardDescription>
                                Version 2026.1 — Révisée (Acte Uniforme)
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-200">
                            Validé Experts
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-indigo-50 shadow-sm">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Plan Comptable</span>
                            <span className="text-xl font-bold text-indigo-600">{OHADA_COMPTES.length} Comptes</span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-indigo-50 shadow-sm">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Taxes & TVA</span>
                            <span className="text-xl font-bold text-indigo-600">{OHADA_TAXES.length} Taux</span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-indigo-50 shadow-sm">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Journaux</span>
                            <span className="text-xl font-bold text-indigo-600">{OHADA_JOURNALS.length} Modèles</span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-indigo-50 shadow-sm">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Reporting</span>
                            <span className="text-xl font-bold text-indigo-600">4 États</span>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-amber-900">Méthode d'installation</p>
                                <p className="text-sm text-amber-800">
                                    Choisissez comment appliquer ce pack à votre environnement actuel.
                                </p>
                            </div>

                            <RadioGroup
                                value={importMethod}
                                onValueChange={(val) => setImportMethod(val as any)}
                                className="flex flex-col gap-3"
                            >
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-md border border-amber-100">
                                    <RadioGroupItem value="fusion" id="fusion" />
                                    <Label htmlFor="fusion" className="cursor-pointer">
                                        <span className="font-bold block">Fusion (Recommandé)</span>
                                        <span className="text-xs text-gray-500">Ajoute les nouveaux comptes sans supprimer vos personnalisations existantes.</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-md border border-amber-100">
                                    <RadioGroupItem value="ecrasement" id="ecrasement" />
                                    <Label htmlFor="ecrasement" className="cursor-pointer">
                                        <span className="font-bold block text-red-600">Écrasement complet</span>
                                        <span className="text-xs text-gray-500">Remplace tout le plan comptable actuel par le standard OHADA. (Données perdues !)</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-white border-t border-indigo-50 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4 text-green-600" /> Conformité Garantie SYSCOA
                    </div>
                    <Button
                        size="lg"
                        onClick={() => onImport({ method: importMethod })}
                        disabled={isImporting || isImported}
                        className={`${isImported ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} shadow-lg shadow-indigo-200 px-8`}
                    >
                        {isImported ? (
                            <><Check className="h-5 w-5 mr-2" /> Pack Installé</>
                        ) : isImporting ? (
                            <><Download className="h-5 w-5 mr-2 animate-bounce" /> Installation...</>
                        ) : (
                            <><Download className="h-5 w-5 mr-2" /> Installer le Pack OHADA</>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Tabs defaultValue="comptes" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100/50 p-1">
                    <TabsTrigger value="comptes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Plan Comptable</TabsTrigger>
                    <TabsTrigger value="taxes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Taxes (TVA)</TabsTrigger>
                    <TabsTrigger value="journaux" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Journaux</TabsTrigger>
                    <TabsTrigger value="rapports" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Reporting</TabsTrigger>
                </TabsList>

                {/* Plan Comptable Tab */}
                <TabsContent value="comptes" className="mt-6 space-y-4">
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher un compte..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white border-gray-200 w-64 h-9 text-sm"
                            />
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <Button
                                variant={selectedClasse === null ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedClasse(null)}
                                className="text-[10px] h-7 px-2"
                            >
                                Tous
                            </Button>
                            {CLASSES.map((c) => (
                                <Button
                                    key={c}
                                    variant={selectedClasse === c ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setSelectedClasse(c)}
                                    className="text-[10px] h-7 px-2"
                                >
                                    {c}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden min-h-[400px]">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow>
                                    <TableHead className="w-24">N°</TableHead>
                                    <TableHead>Libellé Systématique</TableHead>
                                    <TableHead className="w-32">Type</TableHead>
                                    <TableHead className="w-28 text-right">Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredComptes.map((compte) => (
                                    <TableRow key={compte.numero} className="group hover:bg-indigo-50/30">
                                        <TableCell className="font-mono font-bold text-indigo-700">{compte.numero}</TableCell>
                                        <TableCell className="text-gray-700 font-medium">{compte.libelle}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-[10px] bg-slate-100">
                                                {compte.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5 text-xs text-green-600 font-medium">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                Conforme
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Taxes Tab */}
                <TabsContent value="taxes" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {OHADA_TAXES.map((taxe) => (
                            <Card key={taxe.code} className="hover:border-indigo-300 transition-colors cursor-default group">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">{taxe.code}</Badge>
                                        <span className="text-2xl font-black text-indigo-600 group-hover:scale-110 transition-transform">{taxe.taux}%</span>
                                    </div>
                                    <CardTitle className="text-sm mt-2">{taxe.libelle}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Settings className="h-3 w-3" />
                                        Mode: {taxe.type}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Journaux Tab */}
                <TabsContent value="journaux" className="mt-6">
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow>
                                    <TableHead className="w-24">Code</TableHead>
                                    <TableHead>Libellé du Journal</TableHead>
                                    <TableHead>Usage Recommandé</TableHead>
                                    <TableHead className="text-right">Configuration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {OHADA_JOURNALS.map((journal) => (
                                    <TableRow key={journal.code}>
                                        <TableCell className="font-bold text-gray-900">{journal.code}</TableCell>
                                        <TableCell>{journal.libelle}</TableCell>
                                        <TableCell className="text-sm text-gray-500 italic">{journal.usage}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="text-[10px] text-blue-600">Séquentiel</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Reporting Tab */}
                <TabsContent value="rapports" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {OHADA_REPORTS.map((report) => (
                            <div key={report.nom} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all">
                                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 h-fit">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900">{report.nom}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">{report.description}</p>
                                    <div className="pt-2 flex items-center gap-4">
                                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-500">Format PDF/XML</span>
                                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-500">Norme AUDCIF</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

// components/accounting/budget-list-view.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, RefreshCw, Search, Edit, Trash2, Loader2, TrendingUp, Lock } from 'lucide-react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Badge } from '@/components/ui/badge';

export interface Budget {
    id: string;
    name: string;
    code: string;
    axeAnalytique: string;
    montantAlloue: number;
    montantConsomme: number;
    dateDebut: string;
    dateFin: string;
    statut: 'ACTIF' | 'CLOTURE' | 'BROUILLON';
}

interface BudgetListViewProps {
    budgets: Budget[];
    isLoading: boolean;
    onEdit: (id: string) => void;
    onDelete: (budget: Budget) => void;
    onAddNew: () => void;
    onRefresh: () => void;
    onLock: (id: string) => void;
}

const statutColors: Record<Budget['statut'], string> = {
    ACTIF: 'bg-green-100 text-green-800',
    CLOTURE: 'bg-gray-100 text-gray-700',
    BROUILLON: 'bg-yellow-100 text-yellow-800',
};

export const BudgetListView: React.FC<BudgetListViewProps> = ({
    budgets = [],
    isLoading,
    onEdit,
    onDelete,
    onAddNew,
    onRefresh,
    onLock,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = budgets.filter((b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.axeAnalytique.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher par nom, code ou axe analytique..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white border-gray-300"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onRefresh} className="border-gray-300">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <PermissionGuard feature="budgets" action="create">
                        <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau Budget
                        </Button>
                    </PermissionGuard>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total budgets', value: budgets.length, color: 'blue' },
                    { label: 'Actifs', value: budgets.filter(b => b.statut === 'ACTIF').length, color: 'green' },
                    {
                        label: 'Budget total alloué',
                        value: budgets.reduce((s, b) => s + b.montantAlloue, 0).toLocaleString('fr-FR') + ' FCFA',
                        color: 'purple'
                    },
                ].map(({ label, value, color }) => (
                    <div key={label} className={`p-4 rounded-lg bg-${color}-50 border border-${color}-100`}>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className={`text-xl font-bold text-${color}-700`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="py-3 px-4">Code</TableHead>
                                <TableHead className="py-3 px-4">Nom</TableHead>
                                <TableHead className="py-3 px-4">Axe Analytique</TableHead>
                                <TableHead className="py-3 px-4 text-right">Alloué</TableHead>
                                <TableHead className="py-3 px-4 text-right">Consommé</TableHead>
                                <TableHead className="py-3 px-4">Période</TableHead>
                                <TableHead className="py-3 px-4">Statut</TableHead>
                                <TableHead className="py-3 px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-40 text-center text-gray-500">
                                        Aucun budget trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((budget) => {
                                    const ratio = budget.montantAlloue > 0
                                        ? Math.min(100, Math.round((budget.montantConsomme / budget.montantAlloue) * 100))
                                        : 0;
                                    return (
                                        <TableRow key={budget.id} className="hover:bg-gray-50 border-b border-gray-100">
                                            <TableCell className="py-3 px-4 font-mono text-sm font-bold">{budget.code}</TableCell>
                                            <TableCell className="py-3 px-4 font-medium">{budget.name}</TableCell>
                                            <TableCell className="py-3 px-4 text-gray-600">{budget.axeAnalytique}</TableCell>
                                            <TableCell className="py-3 px-4 text-right font-mono">
                                                {budget.montantAlloue.toLocaleString('fr-FR')}
                                            </TableCell>
                                            <TableCell className="py-3 px-4 text-right">
                                                <div className="space-y-1">
                                                    <div className="text-right font-mono text-sm">{budget.montantConsomme.toLocaleString('fr-FR')}</div>
                                                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                                                        <div
                                                            className={`h-1.5 rounded-full ${ratio >= 90 ? 'bg-red-500' : ratio >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                            style={{ width: `${ratio}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-right text-xs text-gray-500">{ratio}%</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 px-4 text-xs text-gray-500">
                                                {budget.dateDebut} → {budget.dateFin}
                                            </TableCell>
                                            <TableCell className="py-3 px-4">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statutColors[budget.statut]}`}>
                                                    {budget.statut}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3 px-4">
                                                <div className="flex justify-end gap-1">
                                                    <PermissionGuard feature="budgets" action="update">
                                                        <Button variant="outline" size="sm" onClick={() => onEdit(budget.id)}
                                                            className="h-7 px-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs">
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                    </PermissionGuard>
                                                    <PermissionGuard feature="budgets" action="lock">
                                                        <Button variant="outline" size="sm" onClick={() => onLock(budget.id)}
                                                            className="h-7 px-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs"
                                                            disabled={budget.statut === 'CLOTURE'}>
                                                            <Lock className="h-3 w-3" />
                                                        </Button>
                                                    </PermissionGuard>
                                                    <PermissionGuard feature="budgets" action="update">
                                                        <Button variant="outline" size="sm" onClick={() => onDelete(budget)}
                                                            className="h-7 px-2 border-red-200 text-red-700 hover:bg-red-50 text-xs"
                                                            disabled={budget.statut === 'ACTIF'}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </PermissionGuard>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

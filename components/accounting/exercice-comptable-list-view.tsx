"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';
import { Edit, Trash2, Plus, Lock, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface ExerciceComptableListViewProps {
    exercices: ExerciceComptableDto[];
    isLoading: boolean;
    onSelectExercice: (id: string) => void;
    onEditExercice: (id: string) => void;
    onDeleteExercice: (exercice: ExerciceComptableDto) => void;
    onCloseExercice: (id: string) => void;
    onAddNew: () => void;
    onRefresh: () => void;
}

const RowActions = ({ exercice, onEdit, onDelete, onClose }: {
    exercice: ExerciceComptableDto;
    onEdit: (id: string) => void;
    onDelete: (exercice: ExerciceComptableDto) => void;
    onClose: (id: string) => void;
}) => {
    return (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <TooltipProvider>
                {!exercice.cloture && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onClose(exercice.id || ''); }}>
                                <Lock className="h-4 w-4 text-blue-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Clôturer l'exercice</p></TooltipContent>
                    </Tooltip>
                )}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(exercice.id || ''); }}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Modifier</p></TooltipContent>
                </Tooltip>
                {!exercice.cloture && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onDelete(exercice); }}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Supprimer</p></TooltipContent>
                    </Tooltip>
                )}
            </TooltipProvider>
        </div>
    );
};

export const ExerciceComptableListView: React.FC<ExerciceComptableListViewProps> = ({
    exercices = [],
    isLoading,
    onSelectExercice,
    onEditExercice,
    onDeleteExercice,
    onCloseExercice,
    onAddNew,
    onRefresh,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvel Exercice
                </Button>
                <Button onClick={onRefresh} variant="outline" size="icon">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Libellé</TableHead>
                        <TableHead>Date Début</TableHead>
                        <TableHead>Date Fin</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-gray-400 font-medium italic">Chargement des exercices...</TableCell>
                        </TableRow>
                    ) : exercices.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">Aucun exercice trouvé.</TableCell>
                        </TableRow>
                    ) : (
                        exercices.map((exercice) => (
                            <TableRow
                                key={exercice.id}
                                className="group hover:bg-gray-50/50 cursor-pointer"
                                onClick={() => onSelectExercice(exercice.id || '')}
                            >
                                <TableCell className="font-medium text-gray-900">{exercice.code}</TableCell>
                                <TableCell>{exercice.libelle}</TableCell>
                                <TableCell>{exercice.date_debut ? new Date(exercice.date_debut).toLocaleDateString('fr-FR') : '-'}</TableCell>
                                <TableCell>{exercice.date_fin ? new Date(exercice.date_fin).toLocaleDateString('fr-FR') : '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={exercice.cloture ? 'secondary' : 'default'} className={exercice.cloture ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200 border-none'}>
                                        {exercice.cloture ? 'Clôturé' : 'Ouvert'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <RowActions
                                        exercice={exercice}
                                        onEdit={onEditExercice}
                                        onDelete={onDeleteExercice}
                                        onClose={onCloseExercice}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

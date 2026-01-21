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
import { PeriodeComptableDto } from '@/src/lib2/models/PeriodeComptableDto';
import { Edit, Trash2, Plus, Lock, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';

interface PeriodeComptableListViewProps {
  periodes: PeriodeComptableDto[];
  isLoading: boolean;
  onSelectPeriode: (id: string) => void;
  onEditPeriode: (id: string) => void;
  onDeletePeriode: (periode: PeriodeComptableDto) => void;
  onClosePeriode: (id: string) => void;
  onAddNew: () => void;
  onRefresh: () => void;
  exercices?: ExerciceComptableDto[];
}

const RowActions = ({ periode, onEdit, onDelete, onClose }: {
  periode: PeriodeComptableDto;
  onEdit: (id: string) => void;
  onDelete: (periode: PeriodeComptableDto) => void;
  onClose: (id: string) => void;
}) => {
  return (
    <div className="w-12 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipProvider>
        {!periode.cloturee && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50" onClick={(e) => { e.stopPropagation(); onClose(periode.id || ''); }}>
                <Lock className="h-4 w-4 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Clôturer la période</p></TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(periode.id || ''); }}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
        {!periode.cloturee && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onDelete(periode); }}>
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

export const PeriodeComptableListView: React.FC<PeriodeComptableListViewProps> = ({
  periodes = [],
  isLoading,
  onSelectPeriode,
  onEditPeriode,
  onDeletePeriode,
  onClosePeriode,
  onAddNew,
  onRefresh,
  exercices = [],
}) => {
  const getExerciceCode = (exerciceId?: string) => {
    if (!exerciceId) return '-';
    const ex = exercices.find(e => e.id === exerciceId);
    return ex ? ex.code : '-';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={onAddNew} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Période
        </Button>
        <Button onClick={onRefresh} variant="outline" size="icon">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Exercice</TableHead>
            <TableHead>Date Début</TableHead>
            <TableHead>Date Fin</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-400 font-medium italic">Chargement des périodes...</TableCell>
            </TableRow>
          ) : periodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">Aucune période trouvée.</TableCell>
            </TableRow>
          ) : (
            periodes.map((periode) => (
              <TableRow
                key={periode.id}
                className="group hover:bg-gray-50/50 cursor-pointer"
                onClick={() => onSelectPeriode(periode.id || '')}
              >
                <TableCell className="font-medium text-gray-900">{periode.code}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal border-blue-200 text-blue-700 bg-blue-50/50">
                    {getExerciceCode(periode.exercice_id)}
                  </Badge>
                </TableCell>
                <TableCell>{periode.dateDebut ? new Date(periode.dateDebut).toLocaleDateString('fr-FR') : '-'}</TableCell>
                <TableCell>{periode.dateFin ? new Date(periode.dateFin).toLocaleDateString('fr-FR') : '-'}</TableCell>
                <TableCell>
                  <Badge variant={periode.cloturee ? 'secondary' : 'default'} className={periode.cloturee ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200 border-none'}>
                    {periode.cloturee ? 'Clôturée' : 'Ouverte'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions
                    periode={periode}
                    onEdit={onEditPeriode}
                    onDelete={onDeletePeriode}
                    onClose={onClosePeriode}
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
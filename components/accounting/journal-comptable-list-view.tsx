// components/accounting/journal-comptable-list-view.tsx
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
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import { Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface JournalComptableListViewProps {
  journals: JournalComptableDto[];
  isLoading: boolean;
  onSelectJournal: (id: string) => void;
  onEditJournal: (id: string) => void;
  onDeleteJournal: (journal: JournalComptableDto) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({ journal, onEdit, onDelete }: {
  journal: JournalComptableDto,
  onEdit: (id: string) => void,
  onDelete: (journal: JournalComptableDto) => void
}) => {
  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(journal.id!); }}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier le journal</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onDelete(journal); }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Supprimer le journal</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const JournalComptableListView: React.FC<JournalComptableListViewProps> = ({
  journals = [],
  isLoading,
  onSelectJournal,
  onEditJournal,
  onDeleteJournal,
  onAddNew,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Journal
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
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-400 font-medium italic">Chargement des journaux...</TableCell>
            </TableRow>
          ) : journals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg font-medium italic">Aucun journal trouvé.</TableCell>
            </TableRow>
          ) : (
            journals.map((journal) => (
              <TableRow
                key={journal.id}
                className="group hover:bg-gray-50/50 cursor-pointer"
                onClick={() => onSelectJournal(journal.id!)}
              >
                <TableCell className="font-medium text-gray-900">{journal.codeJournal}</TableCell>
                <TableCell>{journal.libelle}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal border-blue-200 text-blue-700 bg-blue-50/50">
                    {journal.typeJournal}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={journal.actif ? 'default' : 'secondary'} className={journal.actif ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}>
                    {journal.actif ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions journal={journal} onEdit={onEditJournal} onDelete={onDeleteJournal} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
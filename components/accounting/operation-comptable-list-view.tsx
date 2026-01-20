"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

const OPERATION_DESCRIPTIONS: Record<string, string> = {
  "VENTE": "Vente client",
  "ACHAT": "Achat fournisseur",
  "Règlement": "Règlement",
  "Dépense": "Dépense",
};

interface OperationComptableListViewProps {
  operations: OperationComptableDto[];
  isLoading: boolean;
  onSelectOperation: (id: string) => void;
  onEditOperation: (id: string) => void;
  onDeleteOperation: (operation: OperationComptableDto) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({
  operation,
  onEdit,
  onDelete
}: {
  operation: OperationComptableDto,
  onEdit: (id: string) => void,
  onDelete: (operation: OperationComptableDto) => void
}) => (
  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(operation.id || '');
            }}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Modifier</p></TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(operation);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Supprimer</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export const OperationComptableListView: React.FC<OperationComptableListViewProps> = ({
  operations = [],
  isLoading,
  onSelectOperation,
  onEditOperation,
  onDeleteOperation,
  onAddNew,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperations = operations.filter((op) =>
    op.typeOperation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.modeReglement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.comptePrincipal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button onClick={onAddNew} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Opération
          </Button>
          <div className="w-64">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 border-gray-300 focus:border-indigo-500"
            />
          </div>
        </div>
        <Button onClick={onRefresh} variant="outline" size="icon">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[200px]">Type</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Compte</TableHead>
              <TableHead>Sens</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400 italic">Chargement...</TableCell>
              </TableRow>
            ) : filteredOperations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                  Aucune opération trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredOperations.map((operation) => (
                <TableRow
                  key={operation.id}
                  className="group hover:bg-indigo-50/30 cursor-pointer"
                  onClick={() => onSelectOperation(operation.id || '')}
                >
                  <TableCell className="font-medium text-indigo-900">
                    {OPERATION_DESCRIPTIONS[operation.typeOperation] || operation.typeOperation}
                  </TableCell>
                  <TableCell>{operation.modeReglement}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold">{operation.comptePrincipal}</code>
                  </TableCell>
                  <TableCell>
                    <span className={operation.sensPrincipal === 'DEBIT' ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                      {operation.sensPrincipal}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">{operation.typeMontant}</TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      operation={operation}
                      onEdit={onEditOperation}
                      onDelete={onDeleteOperation}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
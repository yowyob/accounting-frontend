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

const OPERATION_TEMPLATES: Record<string, string> = {
  "VENTE": "Vend à un client",
  "ACHAT": "Achète à un fournisseur",
  "SALAIRE": "Paye un salaire",
  "PAIEMENT": "Effectue un paiement",
  "DIVERS": "Opération diverse",
};

const MODE_REGLEMENT_LABELS: Record<string, { label: string, isComptant: boolean }> = {
  "ESPECE": { label: "par espèces [CCE]", isComptant: true },
  "CHEQUE": { label: "par chèque [CHQ]", isComptant: true },
  "VIREMENT": { label: "par virement [VIR]", isComptant: true },
  "MOBILE": { label: "par mobile [MOB]", isComptant: true },
  "CR": { label: "par crédit [CR]", isComptant: false },
};

const MONTANT_LABELS: Record<string, string> = {
  "TTC": "Montant Toutes Taxes Comprises [TTC]",
  "HT": "Montant Hors Taxes [HT]",
  "TVA": "Montant TVA [TVA]",
  "PAU": "Prix d'Achat Unitaire [PAU]",
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

  const formatOperationAsSentence = (op: OperationComptableDto) => {
    const verb = OPERATION_TEMPLATES[op.typeOperation] || op.typeOperation;
    const modeInfo = MODE_REGLEMENT_LABELS[op.modeReglement] || { label: `par ${op.modeReglement}`, isComptant: false };
    const comptantStr = modeInfo.isComptant ? "au comptant " : "";
    const action = op.sensPrincipal === 'DEBIT' ? 'on débite le compte' : 'on crédite le compte';
    const amount = MONTANT_LABELS[op.typeMontant] || `du Montant [${op.typeMontant}]`;

    return (
      <span className="leading-relaxed">
        {verb} {comptantStr}{modeInfo.label}, {action} <span className="font-mono bg-blue-50 text-blue-700 px-1 py-0.5 rounded border border-blue-100 font-bold">[{op.comptePrincipal}]</span> {amount}
      </span>
    );
  };

  const filteredOperations = operations.filter((op) => {
    const sentenceContent = `${OPERATION_TEMPLATES[op.typeOperation]} ${op.modeReglement} ${op.comptePrincipal} ${op.typeMontant}`.toLowerCase();
    return sentenceContent.includes(searchTerm.toLowerCase());
  });

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
          <TableHeader className="bg-gray-50/50 border-b">
            <TableRow>
              <TableHead className="font-bold text-gray-900 border-r">Opération</TableHead>
              <TableHead className="text-right font-bold text-gray-900 w-[100px]">Actions</TableHead>
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
                  className="group hover:bg-blue-50/50 cursor-pointer border-b transition-colors"
                  onClick={() => onSelectOperation(operation.id || '')}
                >
                  <TableCell className="py-4 text-sm text-gray-700 border-r">
                    {formatOperationAsSentence(operation)}
                  </TableCell>
                  <TableCell className="text-right py-4">
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
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { Edit, Trash2, Plus, RefreshCw, Loader2 } from 'lucide-react';
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
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
import { CompteDto } from '@/src/lib2/models/CompteDto';
import { useEffect } from 'react';

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
  onAddNew?: () => void;
  onRefresh?: () => void;
  selectedId?: string;
  readOnly?: boolean;
  variant?: 'sentence' | 'detailed';
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
  selectedId,
  readOnly = false,
  variant = 'sentence',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<CompteDto[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await AccountingComptesService.getAllComptes();
      if (res.success && res.data) {
        setAccounts(res.data);
      }
    };
    fetchAccounts();
  }, []);

  const getAccountNumber = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId || acc.noCompte === accountId);
    return account ? account.noCompte : accountId;
  };

  const formatOperationAsSentence = (op: OperationComptableDto) => {
    if (variant === 'detailed') {
      const accNumber = getAccountNumber(op.comptePrincipalId || '');
      const sensP = op.sensPrincipal === 'DEBIT' ? 'Débit' : 'Crédit';
      const sensBadgeClass = op.sensPrincipal === 'DEBIT'
        ? "bg-blue-100 text-blue-700 border-blue-200"
        : "bg-orange-100 text-orange-700 border-orange-200";

      const typeOp = OPERATION_TEMPLATES[op.typeOperation] || op.typeOperation;
      const modeInfo = MODE_REGLEMENT_LABELS[op.modeReglement] || { label: `par ${op.modeReglement}`, isComptant: false };
      const montant = MONTANT_LABELS[op.typeMontant] || `Montant [${op.typeMontant}]`;

      return (
        <div className="flex flex-col gap-3 py-2">
          {/* Operation Type Info */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-700">{typeOp}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{modeInfo.label}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{montant}</span>
          </div>

          {/* Principal Account */}
          <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-md border border-gray-200">
            <span className="text-[11px] font-bold uppercase text-gray-500 min-w-[90px]">Compte Principal</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-300 text-sm">{accNumber}</span>
              <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${sensBadgeClass}`}>{sensP}</span>
            </div>
          </div>

          {/* Counterparties */}
          {op.contreparties && op.contreparties.length > 0 && (
            <div className="flex flex-col gap-2 pl-4 border-l-2 border-gray-200">
              {op.contreparties.map((cp, idx) => {
                const cpAccNumber = getAccountNumber(cp.compteId || '');
                const cpSens = cp.sens === 'DEBIT' ? 'Débit' : 'Crédit';
                const cpSensBadgeClass = cp.sens === 'DEBIT'
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-orange-100 text-orange-700 border-orange-200";

                return (
                  <div key={idx} className="flex items-center gap-3 bg-blue-50/30 p-2 rounded-md border border-blue-100">
                    <span className="text-[11px] font-bold uppercase text-gray-500 min-w-[90px]">Contrepartie {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-300 text-sm">{cpAccNumber}</span>
                      <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${cpSensBadgeClass}`}>{cpSens}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notes if any */}
          {op.notes && (
            <div className="text-xs text-gray-500 italic bg-yellow-50 p-2 rounded border border-yellow-200">
              Note: {op.notes}
            </div>
          )}
        </div>
      );
    }

    // Default 'sentence' variant
    const verb = OPERATION_TEMPLATES[op.typeOperation] || op.typeOperation;
    const modeInfo = MODE_REGLEMENT_LABELS[op.modeReglement] || { label: `par ${op.modeReglement}`, isComptant: false };
    const comptantStr = modeInfo.isComptant ? "au comptant " : "";
    const action = op.sensPrincipal === 'DEBIT' ? 'on débite le compte' : 'on crédite le compte';
    const amount = MONTANT_LABELS[op.typeMontant] || `du Montant [${op.typeMontant}]`;
    const accNumber = getAccountNumber(op.comptePrincipalId || '');

    return (
      <span className="leading-relaxed">
        {verb} {comptantStr}{modeInfo.label}, {action} <span className="font-mono bg-blue-50 text-blue-700 px-1 py-0.5 rounded border border-blue-100 font-bold">[{accNumber}]</span> {amount}
      </span>
    );
  };

  const filteredOperations = operations.filter((op) => {
    const accNumber = getAccountNumber(op.comptePrincipalId);
    const sentenceContent = `${OPERATION_TEMPLATES[op.typeOperation]} ${op.modeReglement} ${accNumber} ${op.typeMontant}`.toLowerCase();
    return sentenceContent.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {!readOnly && (onAddNew || onRefresh) && (
        <div className="space-y-4">
          {/* Top Row: Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Bottom Row: Action buttons (New left, Refresh right) */}
          <div className="flex items-center justify-between">
            {onAddNew && (
              <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Opération
              </Button>
            )}
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="icon">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50/50 border-b">
            <TableRow>
              <TableHead className="font-bold text-gray-900 border-r">Détails de l'Opération (Compte & Sens)</TableHead>
              {!readOnly && <TableHead className="text-right font-bold text-gray-900 w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 1 : 2} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOperations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 1 : 2} className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                  Aucune opération trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredOperations.map((operation) => (
                <TableRow
                  key={operation.id}
                  className={`group hover:bg-blue-50/50 cursor-pointer border-b transition-colors ${selectedId === operation.id ? 'bg-blue-100/50 shadow-sm border-blue-200' : ''}`}
                  onClick={() => onSelectOperation(operation.id || '')}
                >
                  <TableCell className="py-4 text-sm text-gray-700 border-r">
                    {formatOperationAsSentence(operation)}
                  </TableCell>
                  {!readOnly && (
                    <TableCell className="text-right py-4">
                      <RowActions
                        operation={operation}
                        onEdit={onEditOperation}
                        onDelete={onDeleteOperation}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
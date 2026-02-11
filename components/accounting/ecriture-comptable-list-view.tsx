// components/accounting/ecriture-comptable-list-view.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { Edit, Trash2, Plus, Check, RefreshCw, Loader2, Search } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useNationalCurrency } from '@/hooks/use-national-currency';

interface EcritureComptableListViewProps {
  ecritures: EcritureComptableDto[];
  isLoading: boolean;
  onSelectEcriture: (id: string) => void;
  onEditEcriture: (id: string) => void;
  onDeleteEcriture: (ecriture: EcritureComptableDto) => void;
  onValidateEcriture: (id: string) => void;
  onAddNew?: () => void;
  onRefresh?: () => void;
  selectedId?: string;
  readOnly?: boolean;
}

const RowActions = ({ ecriture, onEdit, onDelete, onValidate }: { ecriture: EcritureComptableDto, onEdit: (id: string) => void, onDelete: (ecriture: EcritureComptableDto) => void, onValidate: (id: string) => void }) => {
  if (ecriture.validee) return null; // Hide actions if validated

  return (
    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50" onClick={() => onEdit(ecriture.id || '')}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(ecriture)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Supprimer</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const EcritureComptableListView: React.FC<EcritureComptableListViewProps> = ({
  ecritures = [],
  isLoading,
  onSelectEcriture,
  onEditEcriture,
  onDeleteEcriture,
  onValidateEcriture,
  onAddNew,
  onRefresh,
  selectedId,
  readOnly = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { nationalCurrency } = useNationalCurrency();
  const currencyCode = nationalCurrency?.code || 'XAF';

  const filteredEcritures = useMemo(() => {
    return ecritures.filter(ecriture => {
      const matchesSearch =
        ecriture.libelle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ecriture.journalComptableLibelle?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [ecritures, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {!readOnly && (
        <div className="space-y-4">
          {/* Top Row: Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Bottom Row: Actions (New left, Refresh right) */}
          <div className="flex items-center justify-between">
            {onAddNew && (
              <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Écriture
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

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-gray-900">Libellé</TableHead>
              <TableHead className="font-bold text-gray-900">Date</TableHead>
              <TableHead className="font-bold text-gray-900">Journal</TableHead>
              <TableHead className="font-bold text-gray-900 text-right">Montant Débit</TableHead>
              <TableHead className="font-bold text-gray-900 text-right">Montant Crédit</TableHead>
              <TableHead className="font-bold text-gray-900 text-center">Validée</TableHead>
              {!readOnly && <TableHead className="text-right font-bold text-gray-900 px-6">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 6 : 7} className="text-center py-10 text-gray-400 font-medium italic">
                  Chargement des écritures...
                </TableCell>
              </TableRow>
            ) : filteredEcritures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 6 : 7} className="text-center py-10 text-gray-400 font-medium italic">
                  Aucune écriture trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredEcritures.map((ecriture) => (
                <TableRow
                  key={ecriture.id}
                  className={`group cursor-pointer transition-colors hover:bg-blue-50/50 ${selectedId === ecriture.id ? 'bg-blue-100/50 shadow-sm border-blue-200' : ''}`}
                  onClick={() => onSelectEcriture(ecriture.id || '')}
                >
                  <TableCell className="font-medium text-gray-900">{ecriture.libelle}</TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(ecriture.dateEcriture).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal border-blue-200 text-blue-700 bg-blue-50/50">
                      {ecriture.journalComptableLibelle}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-right">
                    {(ecriture.montantTotalDebit || (ecriture.detailsEcriture?.reduce((sum, d) => sum + (Number(d.montantDebit) || 0), 0) || 0)).toLocaleString('fr-FR')} {currencyCode}
                  </TableCell>
                  <TableCell className="font-mono text-right">
                    {(ecriture.montantTotalCredit || (ecriture.detailsEcriture?.reduce((sum, d) => sum + (Number(d.montantCredit) || 0), 0) || 0)).toLocaleString('fr-FR')} {currencyCode}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={ecriture.validee ? "default" : "secondary"} className={ecriture.validee ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}>
                      {ecriture.validee ? 'Validée' : 'Brouillon'}
                    </Badge>
                  </TableCell>
                  {!readOnly && (
                    <TableCell className="text-right px-6">
                      <RowActions
                        ecriture={ecriture}
                        onEdit={onEditEcriture}
                        onDelete={onDeleteEcriture}
                        onValidate={onValidateEcriture}
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
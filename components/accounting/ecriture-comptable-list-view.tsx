// components/accounting/ecriture-comptable-list-view.tsx
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
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { Edit, Trash2, Plus, Check, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface EcritureComptableListViewProps {
  ecritures: EcritureComptableDto[];
  isLoading: boolean;
  onSelectEcriture: (id: string) => void;
  onEditEcriture: (id: string) => void;
  onDeleteEcriture: (ecriture: EcritureComptableDto) => void;
  onValidateEcriture: (id: string) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({ ecriture, onEdit, onDelete, onValidate }: { ecriture: EcritureComptableDto, onEdit: (id: string) => void, onDelete: (ecriture: EcritureComptableDto) => void, onValidate: (id: string) => void }) => {
  if (ecriture.validee) return null; // Hide actions if validated

  return (
    <div className="w-12 flex items-center justify-end gap-1 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-green-600" onClick={() => onValidate(ecriture.id || '')}>
              <Check className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Valider</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600" onClick={() => onEdit(ecriture.id || '')}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600" onClick={() => onDelete(ecriture)}>
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
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Écriture
        </Button>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Journal</TableHead>
            <TableHead>Montant Débit</TableHead>
            <TableHead>Montant Crédit</TableHead>
            <TableHead>Validée</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7}>Chargement...</TableCell>
            </TableRow>
          ) : ecritures.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>Aucune écriture trouvée.</TableCell>
            </TableRow>
          ) : (
            ecritures.map((ecriture) => (
              <TableRow
                key={ecriture.id}
                className="group cursor-pointer hover:bg-gray-50 bg-white"
                onClick={() => onSelectEcriture(ecriture.id || '')}
              >
                <TableCell className="font-medium text-blue-900">{ecriture.libelle}</TableCell>
                <TableCell>
                  {new Date(ecriture.dateEcriture).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <span className="font-medium text-gray-700">{ecriture.journalComptableLibelle}</span>
                </TableCell>
                <TableCell className="font-mono">{ecriture.montantTotalDebit?.toLocaleString('fr-FR')}</TableCell>
                <TableCell className="font-mono">{ecriture.montantTotalCredit?.toLocaleString('fr-FR')}</TableCell>
                <TableCell>
                  <Badge variant={ecriture.validee ? "default" : "secondary"}>
                    {ecriture.validee ? 'Validée' : 'Brouillon'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <RowActions
                    ecriture={ecriture}
                    onEdit={onEditEcriture}
                    onDelete={onDeleteEcriture}
                    onValidate={onValidateEcriture}
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
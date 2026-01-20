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
import { PlanComptableDto } from '@/src/lib2/models/PlanComptableDto';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AccountListViewProps {
  accounts: PlanComptableDto[];
  isLoading: boolean;
  onSelectAccount: (id: string) => void;
  onEditAccount: (id: string) => void;
  onDeleteAccount: (account: PlanComptableDto) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({ account, onEdit, onDelete }: { account: PlanComptableDto, onEdit: (id: string) => void, onDelete: (account: PlanComptableDto) => void }) => {
  return (
    <div className="w-10 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(account.id || '')}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(account)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Supprimer</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const AccountListView: React.FC<AccountListViewProps> = ({
  accounts = [],
  isLoading,
  onSelectAccount,
  onEditAccount,
  onDeleteAccount,
  onAddNew,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button onClick={onAddNew}>Nouveau</Button>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nom du compte</TableHead>
            <TableHead>Actif</TableHead>
            <TableHead>Autoriser l&#39;écriture</TableHead>
            <TableHead>Vue</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}>Chargement...</TableCell>
            </TableRow>
          ) : accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>Aucun compte trouvé.</TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account.id} className="group">
                <TableCell>{account.noCompte}</TableCell>
                <TableCell>{account.libelle}</TableCell>
                <TableCell>{account.actif ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{(account as any).allowEntry ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{(account as any).view || '-'}</TableCell>
                <TableCell>
                  <RowActions account={account} onEdit={onEditAccount} onDelete={onDeleteAccount} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
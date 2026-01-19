"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OperationComptable } from '@/types/accounting';
import { Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

// 1. Dictionnaire de correspondance (Solution 1)
const OPERATION_DESCRIPTIONS: Record<string, string> = {
  "VENTE": "Quand on vend à un client",
  "ACHAT": "Quand on achète à un fournisseur",
  "Règlement": "Lors d'un règlement",
  "Dépense": "Lors d'une dépense effectuée",
};

interface OperationComptableListViewProps {
  operations: OperationComptable[];
  isLoading: boolean;
  onSelectOperation: (id: string) => void;
  onEditOperation: (id: string) => void;
  onDeleteOperation: (operation: OperationComptable) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

// Composant pour les boutons d'actions (Modifier / Supprimer)
const RowActions = ({ 
  operation, 
  onEdit, 
  onDelete 
}: { 
  operation: OperationComptable, 
  onEdit: (id: string) => void, 
  onDelete: (operation: OperationComptable) => void 
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
              onEdit(operation.id!);
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

  // Filtrage basé sur les données brutes
  const filteredOperations = operations.filter((op) =>
    op.typeOperation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.modeReglement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.comptePrincipal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={onAddNew} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Opération
        </Button>
        <Button onClick={onRefresh} variant="outline" size="icon">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="max-w-lg">
        <Input
          placeholder="Rechercher par compte ou type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-gray-300 focus:border-indigo-500"
        />  
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400 italic">Chargement des opérations...</div>
        ) : filteredOperations.length === 0 ? (
          <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
            Aucune opération trouvée.
          </div>
        ) : (
          filteredOperations.map((operation) => {
            // Transformation de la valeur brute en phrase descriptive
            const typeAffiche = OPERATION_DESCRIPTIONS[operation.typeOperation] || operation.typeOperation;

            return (
              <div 
                key={operation.id} 
                className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
                onClick={() => onSelectOperation(operation.id!)}
              >
                {/* La construction dynamique de votre phrase */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-indigo-900">{typeAffiche}</strong> {operation.modeReglement.toLowerCase()}, 
                  on <strong className={operation.sensPrincipal === 'débite' ? 'text-emerald-600' : 'text-rose-600'}>
                    {operation.sensPrincipal}
                  </strong> le compte <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold text-gray-900">{operation.comptePrincipal}</code> du montant <strong>{operation.typeMontant}</strong>.
                </p>
                
                <RowActions 
                  operation={operation} 
                  onEdit={onEditOperation} 
                  onDelete={onDeleteOperation} 
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
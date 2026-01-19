"use client";

import React, { useState, useCallback } from 'react';
import { Taxe } from '@/types/accounting';
import { TaxeListView } from '@/components/accounting/taxe-list-view';
import { TaxeForm } from '@/components/accounting/settings/taxes-form';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useCompose } from '@/hooks/use-compose-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, FileText, Calculator, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Données Mockées améliorées avec les bons types ---
const mockTaxes: Taxe[] = [
  {
    id: '1',
    name: 'TVA Facturée (Taux Normal)',
    rate: 18,
    taxAccount: '4431',
    type: 'collectee',
    mode: 'ajoute',
    description: 'TVA collectée sur ventes - Taux normal',
    status: 'Actif'
  },
  {
    id: '2',
    name: 'TVA Récupérable sur Achats',
    rate: 18,
    taxAccount: '4452',
    type: 'deductible',
    mode: 'ajoute',
    description: 'TVA déductible sur achats de biens',
    status: 'Actif'
  },
  {
    id: '3',
    name: 'TVA Récupérable sur Immo',
    rate: 18,
    taxAccount: '4451',
    type: 'deductible',
    mode: 'ajoute',
    description: 'TVA déductible sur immobilisations',
    status: 'Actif'
  },
  {
    id: '4',
    name: 'TVA Déductible (taux réduit)',
    rate: 5.5,
    taxAccount: '445650',
    type: 'deductible',
    mode: 'ajoute',
    description: 'TVA au taux réduit applicable',
    status: 'Actif'
  },
  {
    id: '5',
    name: 'TVA Exonérée Export',
    rate: 0,
    taxAccount: '4458',
    type: 'collectee',
    mode: 'inclus',
    description: 'Opérations exonérées à l\'export',
    status: 'Exonérée'
  },
];

// Fonction pour obtenir la couleur du badge selon le type
const getTypeColor = (type: string) => {
  switch (type) {
    case 'collectee': return 'bg-red-100 text-red-800 hover:bg-red-100';
    case 'deductible': return 'bg-green-100 text-green-800 hover:bg-green-100';
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

// Fonction pour obtenir la couleur du badge selon le statut
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Actif': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'Passif': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
    case 'Exonérée': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

// Fonction pour traduire les types
const translateType = (type: string) => {
  switch (type) {
    case 'collectee': return 'Collectée';
    case 'deductible': return 'Déductible';
    default: return type;
  }
};

// Fonction pour traduire les modes
const translateMode = (mode: string) => {
  switch (mode) {
    case 'ajoute': return 'Ajoutée';
    case 'soustrait': return 'Soustraite';
    case 'inclus': return 'Incluse';
    default: return mode;
  }
};

// Composant RowActions pour les boutons Modifier/Supprimer
const RowActions = ({ 
  taxe, 
  onEdit, 
  onDelete 
}: { 
  taxe: Taxe, 
  onEdit: (id: string) => void, 
  onDelete: (taxe: Taxe) => void 
}) => (
  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-blue-50" 
            onClick={(e) => { e.stopPropagation(); onEdit(taxe.id!); }}
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
            onClick={(e) => { e.stopPropagation(); onDelete(taxe); }}
            disabled={taxe.status === 'Actif'}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Supprimer</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export default function TaxesPage() {
  const [taxes, setTaxes] = useState<Taxe[]>(mockTaxes);
  const [isLoading, setIsLoading] = useState(false);
  const [taxeToDelete, setTaxeToDelete] = useState<Taxe | null>(null);
  const { onOpen, onClose: closeCompose } = useCompose();

  // --- Statistiques calculées ---
  const stats = {
    total: taxes.length,
    actives: taxes.filter(t => t.status === 'Actif').length,
    collectees: taxes.filter(t => t.type === 'collectee').length,
    deductibles: taxes.filter(t => t.type === 'deductible').length,
  };

  // --- Fonctions ---
  const fetchAndSetTaxes = useCallback(async () => {
    console.log("Simulation du rafraîchissement");
    setIsLoading(true);
    setTimeout(() => {
      setTaxes(mockTaxes);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSave = async (data: Taxe) => {
    data.rate = parseFloat(data.rate as any);
    const isNew = !data.id;

    if (isNew) {
      const created: Taxe = {
        ...data,
        id: Math.random().toString(),
        status: data.status || 'Actif'
      };
      setTaxes((prev) => [...prev, created]);
    } else {
      setTaxes((prev) => prev.map(t => t.id === data.id ? data : t));
    }

    closeCompose();
  };

  const confirmDelete = async () => {
    if (!taxeToDelete?.id) return;
    setTaxes((prev) => prev.filter(t => t.id !== taxeToDelete.id));
    setTaxeToDelete(null);
  };

  const handleAddNew = () => {
    onOpen({
      title: "Nouvelle Taxe",
      content: <TaxeForm
        initialData={{}}
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  const handleEdit = (id: string) => {
    const taxeToEdit = taxes.find(t => t.id === id);
    if (!taxeToEdit) return;

    onOpen({
      title: "Modifier la Taxe",
      content: <TaxeForm
        initialData={taxeToEdit}
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  const handleDeleteClick = (taxe: Taxe) => {
    setTaxeToDelete(taxe);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête de la page */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Taxes</h1>
            <p className="text-muted-foreground mt-2">
              Configurez et gérez les différentes taxes applicables dans votre comptabilité
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={fetchAndSetTaxes}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Chargement...' : 'Actualiser'}
            </Button>
            <Button
              onClick={handleAddNew}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="h-4 w-4" />
              Nouvelle Taxe
            </Button>
          </div>
        </div>

        <Separator />

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Taxes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Taxes configurées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxes Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor('Actif')}>
                  {stats.actives}
                </Badge>
                <div>
                  <div className="text-2xl font-bold">{stats.actives}</div>
                  <p className="text-xs text-muted-foreground">En activité</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxes Collectées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getTypeColor('collectee')}>
                  {stats.collectees}
                </Badge>
                <div>
                  <div className="text-2xl font-bold">{stats.collectees}</div>
                  <p className="text-xs text-muted-foreground">À collecter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxes Déductibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calculator className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.deductibles}</div>
                  <p className="text-xs text-muted-foreground">À récupérer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des taxes avec filtres */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Taxes</CardTitle>
            <CardDescription>
              Visualisez et gérez toutes vos configurations fiscales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filtres rapides */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setTaxes(mockTaxes)}
              >
                Toutes ({stats.total})
              </Badge>
              <Badge
                variant="outline"
                className={`cursor-pointer ${getStatusColor('Actif')}`}
                onClick={() => setTaxes(mockTaxes.filter(t => t.status === 'Actif'))}
              >
                Actives ({stats.actives})
              </Badge>
              <Badge
                variant="outline"
                className={`cursor-pointer ${getTypeColor('collectee')}`}
                onClick={() => setTaxes(mockTaxes.filter(t => t.type === 'collectee'))}
              >
                Collectées ({stats.collectees})
              </Badge>
              <Badge
                variant="outline"
                className={`cursor-pointer ${getTypeColor('deductible')}`}
                onClick={() => setTaxes(mockTaxes.filter(t => t.type === 'deductible'))}
              >
                Déductibles ({stats.deductibles})
              </Badge>
            </div>

            {/* Tableau amélioré */}
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                <div className="col-span-3">Nom de la taxe</div>
                <div className="col-span-1 text-center">Taux</div>
                <div className="col-span-2">Compte</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Statut</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {isLoading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Chargement des taxes...</p>
                </div>
              ) : taxes.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 font-semibold">Aucune taxe trouvée</h3>
                  <p className="text-muted-foreground mt-1">
                    Commencez par ajouter une nouvelle taxe
                  </p>
                  <Button onClick={handleAddNew} className="mt-4">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ajouter une taxe
                  </Button>
                </div>
              ) : (
                taxes.map((taxe) => (
                  <div
                    key={taxe.id}
                    className="group grid grid-cols-12 gap-4 p-4 border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-3">
                      <div className="font-medium">{taxe.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {taxe.description}
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="font-bold">{taxe.rate}%</div>
                    </div>
                    <div className="col-span-2">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {taxe.taxAccount}
                      </code>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className={getTypeColor(taxe.type)}>
                        {translateType(taxe.type)}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {translateMode(taxe.mode)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className={getStatusColor(taxe.status)}>
                        {taxe.status}
                      </Badge>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <RowActions 
                        taxe={taxe} 
                        onEdit={handleEdit} 
                        onDelete={handleDeleteClick} 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Légende */}
            <div className="mt-6 text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-100 border border-red-300"></div>
                  <span>Taxe collectée (à payer)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-100 border border-green-300"></div>
                  <span>Taxe déductible (à récupérer)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-100 border border-blue-300"></div>
                  <span>Taxe active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialogue de confirmation de suppression */}
        {taxeToDelete && (
          <ConfirmationDialog
            isOpen={!!taxeToDelete}
            onClose={() => setTaxeToDelete(null)}
            onConfirm={confirmDelete}
            title={`Supprimer la taxe "${taxeToDelete.name}" ?`}
            description={`Compte: ${taxeToDelete.taxAccount} | Taux: ${taxeToDelete.rate}%

Cette action est irréversible. Vérifiez qu'aucune transaction n'utilise cette taxe avant suppression.`}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
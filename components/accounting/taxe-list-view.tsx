"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Taxe } from '@/types/accounting';
import {
  Plus,
  RefreshCw,
  Search,
  DollarSign,
  ShoppingCart,
  Building2,
  Percent,
  FileText,
  ArrowUpCircle,
  Hash,
  Edit,
  Trash2,
} from 'lucide-react';

interface TaxeListViewProps {
  taxes: Taxe[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (taxe: Taxe) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const getTaxIcon = (name: string) => {
  if (name.toLowerCase().includes('collectée')) return <DollarSign className="h-5 w-5" />;
  if (name.toLowerCase().includes('achats')) return <ShoppingCart className="h-5 w-5" />;
  if (name.toLowerCase().includes('immobilisations')) return <Building2 className="h-5 w-5" />;
  if (name.toLowerCase().includes('réduite')) return <Percent className="h-5 w-5" />;
  if (name.toLowerCase().includes('export')) return <ArrowUpCircle className="h-5 w-5" />;
  if (name.toLowerCase().includes('services')) return <FileText className="h-5 w-5" />;
  return <Percent className="h-5 w-5" />;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Actif': return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    case 'Passif': return <Badge className="bg-red-100 text-red-800">Passif</Badge>;
    case 'Exonérée': return <Badge className="bg-gray-100 text-gray-800">Exonérée</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

export const TaxeListView: React.FC<TaxeListViewProps> = ({
  taxes = [],
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Toutes');

  // Exemple de données stats (à remplacer par des calculs réels si besoin)
  const totalCollectee = 1_250_000;
  const totalDeductible = 850_000;
  const nombreTaxes = taxes.length;

  const filteredTaxes = taxes.filter((taxe) => {
    const matchesSearch =
      taxe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taxe.taxAccount.includes(searchTerm);
    const matchesFilter = filterStatus === 'Toutes' || true; // À adapter selon un champ statut si existant
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Taxes OHADA</h1>
          <p className="text-gray-600 mt-1">Gérez vos taxes conformément au plan comptable OHADA</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onRefresh} variant="outline" size="lg">
            <RefreshCw className="h-5 w-5 mr-2" />
            Actualiser
          </Button>
          <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Taxe
          </Button>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Rechercher une taxe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-base border-gray-300"
        />
      </div>

      {/* Filtres par statut */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus}>
        <TabsList className="grid w-full max-w-md grid-cols-4 h-12">
          <TabsTrigger value="Toutes" className="text-base">Toutes</TabsTrigger>
          <TabsTrigger value="Actif" className="text-base">Actif</TabsTrigger>
          <TabsTrigger value="Passif" className="text-base">Passif</TabsTrigger>
          <TabsTrigger value="Exonérée" className="text-base">Exonérée</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6">
            <p className="text-blue-100 text-lg">Total TVA Collectée</p>
            <p className="text-3xl font-bold mt-2">{totalCollectee.toLocaleString()} FCFA</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6">
            <p className="text-blue-100 text-lg">Total TVA Déductible</p>
            <p className="text-3xl font-bold mt-2">{totalDeductible.toLocaleString()} FCFA</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-lg">Nombre de Taxes</p>
              <p className="text-3xl font-bold mt-2">{nombreTaxes}</p>
            </div>
            <RefreshCw className="h-12 w-12 text-blue-300" />
          </CardContent>
        </Card>
      </div>

      {/* Liste des taxes configurées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <RefreshCw className="h-10 w-10 animate-spin mx-auto mb-4" />
            Chargement...
          </div>
        ) : filteredTaxes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucune taxe trouvée.
          </div>
        ) : (
          filteredTaxes.map((taxe) => (
            <Card
              key={taxe.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
              onClick={() => onEdit(taxe.id!)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {getTaxIcon(taxe.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{taxe.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-blue-100 text-blue-800">
                          {taxe.rate}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions au hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(taxe.id!);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Modifier</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(taxe);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Supprimer</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      {taxe.taxAccount}
                    </span>
                    {getStatusBadge('Actif')} {/* À adapter selon ton modèle */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
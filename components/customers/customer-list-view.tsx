"use client";

import React from 'react';
import { Client } from '@/types/core';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, Archive, Edit, Trash2, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';

interface CustomerListViewProps {
    clients: Client[];
    isLoading: boolean;
    onSelectClient: (id: string) => void;
    onEditClient: (id: string) => void;
    onDeleteClient: (client: Client) => void;
    onAddNew: () => void;
    onRefresh: () => void;
}

const RowActions = ({ client, onEdit, onDelete }: { client: Client, onEdit: (id: string) => void, onDelete: (client: Client) => void }) => {
    return (
        <div className="w-10 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(client.id)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Modifier</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(client)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Supprimer</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export function CustomerListView({ clients, isLoading, onSelectClient, onEditClient, onDeleteClient, onAddNew, onRefresh }: CustomerListViewProps) {
    const columns: ColumnDef<Client>[] = [
        {
            id: 'select',
            header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Tout sélectionner" />,
            cell: ({ row }) => <div className="group-hover:opacity-0 transition-opacity"><Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Sélectionner la ligne" /></div>,
        },
        {
            accessorKey: 'companyName',
            header: 'Client',
            cell: ({ row }) => (
                <div className="font-medium hover:underline cursor-pointer" onClick={() => onSelectClient(row.original.id)}>
                    {row.original.companyName}
                </div>
            )
        },
        { accessorKey: 'code', header: 'Code' },
        { accessorKey: 'contactPerson', header: 'Contact' },

        {
            accessorKey: 'balance',
            header: () => <div className="">Solde</div>,
            cell: ({ row }) => <div className=""><span className={row.original.balance >= 0 ? '' : 'text-red-600'}>{row.original.balance.toLocaleString('fr-FR')}</span></div>,
        },
        {
            accessorKey: 'isActive',
            header: 'Statut',
            cell: ({ row }) => <Badge variant={row.original.isActive ? 'success' : 'secondary'}>{row.original.isActive ? 'Actif' : 'Inactif'}</Badge>
        },
        {
            id: 'actions',
            cell: ({ row }) => <RowActions client={row.original} onEdit={onEditClient} onDelete={onDeleteClient} />,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Nouveau Client
                </Button>
                <div className="flex gap-2">
                    <Button onClick={onRefresh} variant="outline" size="icon">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>
            <div className="rounded-md border">
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                ) : (
                    <DataTable columns={columns} data={clients} />
                )}
            </div>
        </div>
    );
}

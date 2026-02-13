"use client";

import React, { useState } from 'react';
import { Client } from "@/types/core";
import { ArrowLeft, Archive, Trash2, MoreVertical, FileText, Banknote, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "./customer-form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const AccountingInfoView = ({ client }: { client: Client }) => (
    <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Informations Comptables</h3>
        <div className="space-y-4">
            <div><label className="text-sm font-medium text-gray-600">Solde actuel</label><p className={`text-lg font-semibold ${client.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{client.balance.toLocaleString('fr-FR')} FCFA</p></div>
            <div><label className="text-sm font-medium text-gray-600">Assujeti TVA</label><p className="text-gray-900">{client.isTaxable ? 'Oui' : 'Non'}</p></div>
        </div>
    </CardContent>
);
const ProductHistoryView = ({ client }: { client: Client }) => (
    <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Historique des Commandes</h3>
        <p className="text-gray-600">L'historique des commandes pour {client.companyName} sera affiché ici.</p>
    </CardContent>
);


interface CustomerDetailViewProps {
    client: Client;
    onSave: (data: Client) => void;
    onDelete: (id: string) => void;
    onBack: () => void;
}

export function CustomerDetailView({ client, onSave, onDelete, onBack }: CustomerDetailViewProps) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
            <div className="p-2 border-b flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon"><Archive className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(client.id)}>
                    <Trash2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </div>
            <div className="p-4 border-b">
                 <h1 className="text-2xl font-semibold">{client.companyName}</h1>
                 <p className="text-sm text-gray-500">{client.code}</p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="mx-4 mt-4 self-start">
                    <TabsTrigger value="profile"><FileText className="mr-2 h-4 w-4"/>Profil</TabsTrigger>
                    <TabsTrigger value="accounting"><Banknote className="mr-2 h-4 w-4"/>Comptabilité</TabsTrigger>
                    <TabsTrigger value="history"><History className="mr-2 h-4 w-4"/>Historique</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="profile" className="mt-0">
                        <CustomerForm initialData={client} onSave={onSave} />
                    </TabsContent>
                    <TabsContent value="accounting" className="mt-0">
                         <AccountingInfoView client={client} />
                    </TabsContent>
                    <TabsContent value="history" className="mt-0">
                        <ProductHistoryView client={client} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

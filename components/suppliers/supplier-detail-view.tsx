"use client";

import React, { useState } from 'react';
import { CompteDto } from "@/src/lib2/models/CompteDto";
import { ArrowLeft, Archive, Trash2, MoreVertical, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierForm } from "./supplier-form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui/card';

const PurchaseHistoryView = ({ supplier }: { supplier: CompteDto }) => (
    <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Historique des Achats</h3>
        <p className="text-gray-600">L'historique des achats chez {supplier.libelle} sera affiché ici.</p>
    </CardContent>
);

interface SupplierDetailViewProps {
    supplier: CompteDto;
    onSave: (data: CompteDto) => void;
    onDelete: (id: string) => void;
    onBack: () => void;
}

export function SupplierDetailView({ supplier, onSave, onDelete, onBack }: SupplierDetailViewProps) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
            <div className="p-2 border-b flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon"><Archive className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(supplier.id || '')}>
                    <Trash2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </div>
            <div className="p-4 border-b">
                <h1 className="text-2xl font-semibold">{supplier.libelle}</h1>
                <p className="text-sm text-gray-500">{supplier.noCompte}</p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="mx-4 mt-4 self-start">
                    <TabsTrigger value="profile"><FileText className="mr-2 h-4 w-4" />Profil</TabsTrigger>
                    <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />Historique</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="profile" className="mt-0">
                        <SupplierForm initialData={supplier} onSave={onSave} />
                    </TabsContent>
                    <TabsContent value="history" className="mt-0">
                        <PurchaseHistoryView supplier={supplier} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

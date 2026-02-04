"use client";

import React, { useState } from 'react';
import { CompteDto } from "@/src/lib2/models/CompteDto";
import { ArrowLeft, Archive, Trash2, MoreVertical, ShoppingBasket, Banknote, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./product-form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui/card';

const PricingInfoView = ({ product }: { product: CompteDto }) => (
    <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Informations Prix</h3>
        <p className="text-gray-600">Les détails des prix pour {product.libelle} seront affichés ici.</p>
    </CardContent>
);
const StockInfoView = ({ product }: { product: CompteDto }) => (
    <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Informations Stock</h3>
        <p className="text-gray-600">Les détails du stock pour {product.libelle} seront affichés ici.</p>
    </CardContent>
);
const MovementHistoryView = ({ product }: { product: CompteDto }) => (
    <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Historique Mouvements</h3>
        <p className="text-gray-600">L'historique des mouvements de stock pour {product.libelle} sera affiché ici.</p>
    </CardContent>
);


interface ProductDetailViewProps {
    product: CompteDto;
    onSave: (data: CompteDto) => void;
    onDelete: (id: string) => void;
    onBack: () => void;
}

export function ProductDetailView({ product, onSave, onDelete, onBack }: ProductDetailViewProps) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
            <div className="p-2 border-b flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon"><Archive className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(product.id || '')}>
                    <Trash2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </div>
            <div className="p-4 border-b">
                <h1 className="text-2xl font-semibold">{product.libelle}</h1>
                <p className="text-sm text-gray-500">{product.noCompte}</p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="mx-4 mt-4 self-start">
                    <TabsTrigger value="profile"><ShoppingBasket className="mr-2 h-4 w-4" />Profil</TabsTrigger>
                    <TabsTrigger value="pricing"><Banknote className="mr-2 h-4 w-4" />Prix</TabsTrigger>
                    <TabsTrigger value="stock"><Archive className="mr-2 h-4 w-4" />Stock</TabsTrigger>
                    <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />Mouvements</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="profile" className="mt-0">
                        <ProductForm initialData={product} onSave={onSave} />
                    </TabsContent>
                    <TabsContent value="pricing" className="mt-0">
                        <PricingInfoView product={product} />
                    </TabsContent>
                    <TabsContent value="stock" className="mt-0">
                        <StockInfoView product={product} />
                    </TabsContent>
                    <TabsContent value="history" className="mt-0">
                        <MovementHistoryView product={product} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
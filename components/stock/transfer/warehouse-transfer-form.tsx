"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { Product } from '@/types/core';
import { Warehouse, WarehouseTransferItem } from '@/types/stock';
import { createWarehouseTransfer, updateProduct } from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { PlusCircle, Save, Eraser, Trash2 } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useNationalCurrency } from '@/hooks/use-national-currency';

interface WarehouseTransferFormProps {
    products: Product[];
    warehouses: Warehouse[];
}

type FormValues = {
    sourceWarehouseId: string;
    destinationWarehouseId: string;
    reference: string;
    description: string;
    notes: string;
    items: (WarehouseTransferItem & { code: string; name: string, stock: number, totalValue: number })[];
};

export function WarehouseTransferForm({ products, warehouses }: WarehouseTransferFormProps) {
    const { nationalCurrency } = useNationalCurrency();
    const currencyCode = nationalCurrency?.code || 'XAF';
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const form = useForm<FormValues>({
        defaultValues: { sourceWarehouseId: '', destinationWarehouseId: '', reference: '', description: '', notes: '', items: [] }
    });
    const { control, handleSubmit, reset, watch } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    const watchedItems = watch('items');
    const sourceWarehouseId = watch('sourceWarehouseId');

    const productOptions: ComboboxOption[] = useMemo(() => products.map(p => ({ value: p.id, label: `${p.code} - ${p.name}` })), [products]);
    const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);

    const handleAddItem = useCallback(() => {
        if (!selectedProduct) return;
        append({
            productId: selectedProduct.id,
            code: selectedProduct.code,
            name: selectedProduct.name,
            quantity: quantity,
            costPrice: selectedProduct.costPrice,
            stock: selectedProduct.stock,
            totalValue: quantity * selectedProduct.costPrice,
        });
        setSelectedProductId('');
        setQuantity(1);
    }, [selectedProduct, quantity, append]);

    const onSubmit = async (data: FormValues) => {
        if (data.items.length === 0 || !data.sourceWarehouseId || !data.destinationWarehouseId) {
            alert("Veuillez remplir tous les champs obligatoires et ajouter des articles.");
            return;
        }

        const newTransfer = {
            reference: data.reference || `TRANS-${Date.now()}`,
            date: new Date().toISOString(),
            sourceWarehouseId: data.sourceWarehouseId,
            destinationWarehouseId: data.destinationWarehouseId,
            description: data.description,
            notes: data.notes,
            items: data.items.map(({ productId, quantity, costPrice }) => ({ productId, quantity, costPrice }))
        };

        try {
            await createWarehouseTransfer(newTransfer);

            const stockUpdates = data.items.map(item => {
                const productToUpdate = products.find(p => p.id === item.productId);
                if (!productToUpdate) return Promise.resolve();

                const newStock = productToUpdate.stock - item.quantity;
                return updateProduct(item.productId, { stock: newStock });
            });

            await Promise.all(stockUpdates);

            alert("Transfert de stock enregistré avec succès !");
            reset();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement du transfert.");
        }
    };

    const totalValue = useMemo(() => watchedItems.reduce((sum, item) => sum + item.totalValue, 0), [watchedItems]);

    const columns: ColumnDef<any>[] = [
        { accessorKey: "code", header: "Code" },
        { accessorKey: "name", header: "Libellé", cell: ({ row }) => <div className='w-[350px] truncate'>{row.original.name}</div> },
        { accessorKey: "quantity", header: "Qté" },
        { accessorKey: "costPrice", header: "P.U.", cell: ({ row }) => row.original.costPrice.toLocaleString() },
        { accessorKey: 'totalValue', header: 'Total', cell: ({ row }) => (row.original.quantity * row.original.costPrice).toLocaleString() },
        { id: 'actions', cell: ({ row }) => <Button variant="ghost" size="icon" onClick={() => remove(row.index)}><Trash2 className="h-4 w-4 text-destructive" /></Button> }
    ];

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col gap-4">
                <div className="flex flex-col h-full gap-4">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <Card className="flex-shrink-0 w-full lg:w-2/3">
                            <CardHeader>
                                <CardTitle>Informations sur le Transfert</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name="sourceWarehouseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Transférer de *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Magasin source..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warehouses.map((w) => (
                                                        <SelectItem key={w.id} value={w.id}>
                                                            {w.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="destinationWarehouseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vers *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Magasin destination..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warehouses.map((w) => (
                                                        <SelectItem key={w.id} value={w.id}>
                                                            {w.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <Input {...field} placeholder="Ex: Transfert hebdomadaire..." />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <Textarea {...field} rows={2} placeholder="Ajoutez des notes ou commentaires ici..." />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="w-full lg:w-1/3">
                            <CardContent className="p-4 flex flex-col gap-4">
                                <StatCard
                                    title="Valeur totale du transfert"
                                    value={`${totalValue.toLocaleString("fr-FR")} ${currencyCode}`}
                                    variant="primary"
                                />
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={() => reset()}>
                                        <Eraser className="mr-2 h-4 w-4" />
                                        Réinitialiser
                                    </Button>
                                    <Button type="submit">
                                        <Save className="mr-2 h-4 w-4" />
                                        Enregistrer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="flex-grow flex flex-col min-h-0">
                        <CardHeader>
                            <CardTitle>Articles à Transférer ({fields.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col gap-4 p-4">
                            <div className="border-b pb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                    <FormItem className="lg:col-span-1">
                                        <FormLabel>Ajouter un Article</FormLabel>
                                        <Combobox
                                            options={productOptions}
                                            value={selectedProductId}
                                            onChange={setSelectedProductId}
                                            placeholder="Rechercher un article..."
                                        />
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>En stock</FormLabel>
                                        <Input
                                            value={selectedProduct?.stock ?? "N/A"}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Quantité</FormLabel>
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            min={1}
                                        />
                                    </FormItem>
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="button"
                                            onClick={handleAddItem}
                                            disabled={!selectedProduct || !sourceWarehouseId}
                                        >
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Ajouter à la liste
                                        </Button>
                                    </div>
                                </div>

                            </div>
                            <div className="flex-grow overflow-y-auto">
                                <DataTable columns={columns} data={fields} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </Form>
    );
}
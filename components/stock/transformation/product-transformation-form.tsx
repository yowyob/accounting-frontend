"use client";

import { useState, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { Product } from '@/types/core';
import { Warehouse, ProductTransformationItem } from '@/types/stock';
import { createProductTransformation, updateProduct } from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { Save, Eraser, Trash2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNationalCurrency } from '@/hooks/use-national-currency';

interface ProductTransformationFormProps {
    products: Product[];
    warehouses: Warehouse[];
}

type FormValues = {
    warehouseId: string;
    description: string;
    notes: string;
    inputItems: (ProductTransformationItem & { code: string; name: string, stock: number, totalValue: number })[];
    outputItems: (ProductTransformationItem & { code: string; name: string, stock: number, totalValue: number })[];
};

const ItemAdder = ({ products, onAddItem, disabled }: {
    products: Product[],
    onAddItem: (product: Product, quantity: number) => void,
    disabled: boolean
}) => {
    const [selectedId, setSelectedId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const productOptions: ComboboxOption[] = useMemo(() => products.map(p => ({ value: p.id, label: `${p.code} - ${p.name}` })), [products]);
    const selectedProduct = useMemo(() => products.find(p => p.id === selectedId), [products, selectedId]);

    const handleAddClick = () => {
        if (!selectedProduct) return;
        onAddItem(selectedProduct, quantity);
        setSelectedId('');
        setQuantity(1);
    };

    return (
        <div className="flex items-end gap-2 p-2">
            <div className="flex-1"><FormLabel className="text-xs">Article</FormLabel><Combobox options={productOptions} value={selectedId} onChange={setSelectedId} placeholder="Produit..." disabled={disabled} /></div>
            <div className="w-20"><FormLabel className="text-xs">Quantité</FormLabel><Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min={1} className="h-9 text-center" /></div>
            <Button type="button" onClick={handleAddClick} disabled={!selectedProduct || disabled} className="h-9"><PlusCircle className="h-4 w-4" /></Button>
        </div>
    );
};

export function ProductTransformationForm({ products, warehouses }: ProductTransformationFormProps) {
    const { nationalCurrency } = useNationalCurrency();
    const currencyCode = nationalCurrency?.code || 'XAF';
    const form = useForm<FormValues>({
        defaultValues: { warehouseId: '', description: '', notes: '', inputItems: [], outputItems: [] }
    });
    const { control, handleSubmit, reset, watch } = form;

    const { fields: inputFields, append: appendInput, remove: removeInput } = useFieldArray({ control, name: "inputItems" });
    const { fields: outputFields, append: appendOutput, remove: removeOutput } = useFieldArray({ control, name: "outputItems" });

    const watchedInputs = watch("inputItems");
    const watchedOutputs = watch("outputItems");
    const warehouseId = watch('warehouseId');

    const handleAddItem = (isInput: boolean) => (product: Product, quantity: number) => {
        const item = {
            productId: product.id,
            code: product.code,
            name: product.name,
            quantity,
            costPrice: product.costPrice,
            stock: product.stock,
            totalValue: quantity * product.costPrice,
        };
        if (isInput) appendInput(item);
        else appendOutput(item);
    };

    const onSubmit = async (data: FormValues) => {
        if (data.inputItems.length === 0 || data.outputItems.length === 0 || !data.warehouseId) {
            alert("Veuillez choisir un magasin et ajouter au moins un produit en entrée et en sortie.");
            return;
        }
        try {
            const newTransformation = {
                reference: `TRF-${Date.now()}`,
                date: new Date().toISOString(),
                warehouseId: data.warehouseId,
                description: data.description,
                notes: data.notes,
                inputItems: data.inputItems.map(({ productId, quantity, costPrice }) => ({ productId, quantity, costPrice })),
                outputItems: data.outputItems.map(({ productId, quantity, costPrice }) => ({ productId, quantity, costPrice })),
            };

            await createProductTransformation(newTransformation);

            const stockUpdates = [
                ...data.inputItems.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) throw new Error(`Produit ${item.productId} non trouvé`);
                    return updateProduct(item.productId, { stock: product.stock - item.quantity });
                }),
                ...data.outputItems.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) throw new Error(`Produit ${item.productId} non trouvé`);
                    return updateProduct(item.productId, { stock: product.stock + item.quantity });
                })
            ];
            await Promise.all(stockUpdates);

            alert("Transformation enregistrée et stocks mis à jour !");
            reset();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement de la transformation.");
        }
    };

    const compactColumns: ColumnDef<any>[] = [
        { accessorKey: "code", header: "Code", cell: ({ row }) => <Badge variant="secondary" className="font-normal">{row.original.code}</Badge> },
        { accessorKey: "name", header: "Produit", cell: ({ row }) => <div className='truncate max-w-[200px]' title={row.original.name}>{row.original.name}</div> },
        { accessorKey: "quantity", header: "Qté", cell: ({ row }) => <span className="font-semibold">{row.original.quantity}</span> },
        { accessorKey: "totalValue", header: "Total", cell: ({ row }) => <div className="text-right font-semibold">{(row.original.totalValue).toLocaleString('fr-FR')}</div> },
        { id: "actions", cell: ({ row, table }) => (<Button variant="ghost" size="sm" onClick={() => (table.options.meta as any).remove(row.index)} className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></Button>) }
    ];

    const inputTotal = useMemo(() => watchedInputs.reduce((sum, item) => sum + item.totalValue, 0), [watchedInputs]);
    const outputTotal = useMemo(() => watchedOutputs.reduce((sum, item) => sum + item.totalValue, 0), [watchedOutputs]);

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col gap-2">
                <div className="flex-shrink-0 p-3 border rounded-lg flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-semibold">Détails de la Transformation</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={() => reset()} size="sm"><Eraser className="mr-2 h-3 w-3" />Effacer</Button>
                            <Button onClick={handleSubmit(onSubmit)} size="sm" disabled={!warehouseId || inputFields.length === 0 || outputFields.length === 0}><Save className="mr-2 h-3 w-3" />Enregistrer</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <FormField control={control} name="warehouseId" render={({ field }) => (<FormItem><FormLabel className="text-xs">Magasin *</FormLabel><Select onValueChange={field.onChange} value={field.value}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Sélectionner..." /></SelectTrigger><SelectContent>{warehouses.map(w => (<SelectItem key={w.id} value={w.id} className="text-xs">{w.name}</SelectItem>))}</SelectContent></Select></FormItem>)} />
                        <FormField control={control} name="description" render={({ field }) => (<FormItem><FormLabel className="text-xs">Description</FormLabel><Input {...field} placeholder="Ex: Production de béton B25" className="h-8 text-xs" /></FormItem>)} />
                        <FormField control={control} name="notes" render={({ field }) => (<FormItem><FormLabel className="text-xs">Notes</FormLabel><Input {...field} placeholder="Notes additionnelles..." className="h-8 text-xs" /></FormItem>)} />
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
                    <Card className="flex flex-col">
                        <CardHeader className="p-3">
                            <CardTitle className="text-sm">Produits à Consommer (Entrants)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 flex-1 flex flex-col gap-2 min-h-0">
                            <ItemAdder products={products} onAddItem={handleAddItem(true)} disabled={!warehouseId} />
                            <div className="flex-1 border rounded-md min-h-0 h-full overflow-y-auto [&_td]:py-0.5 [&_td]:text-xs [&_th]:py-1 [&_th]:text-xs">
                                <DataTable columns={compactColumns} data={inputFields} meta={{ remove: removeInput }} />
                            </div>
                        </CardContent>
                        <CardFooter className="p-2 border-t">
                            <div className="w-full text-sm font-semibold flex justify-between items-center text-red-600">
                                <span>Total Entrants :</span>
                                <span>{inputTotal.toLocaleString('fr-FR')} {currencyCode}</span>
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader className="p-3">
                            <CardTitle className="text-sm">Produits Obtenus (Sortants)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 flex-1 flex flex-col gap-2 min-h-0">
                            <ItemAdder products={products} onAddItem={handleAddItem(false)} disabled={!warehouseId} />
                            <div className="flex-1 border rounded-md min-h-0 h-full overflow-y-auto [&_td]:py-0.5 [&_td]:text-xs [&_th]:py-1 [&_th]:text-xs">
                                <DataTable columns={compactColumns} data={outputFields} meta={{ remove: removeOutput }} />
                            </div>
                        </CardContent>
                        <CardFooter className="p-2 border-t">
                            <div className="w-full text-sm font-semibold flex justify-between items-center text-green-600">
                                <span>Total Sortants :</span>
                                <span>{outputTotal.toLocaleString('fr-FR')} {currencyCode}</span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </Form>
    );
}
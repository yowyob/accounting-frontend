"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, ArrowLeft, Lock } from 'lucide-react';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';
import { PeriodeComptableDto } from '@/src/lib2/models/PeriodeComptableDto';
import { AccountingPeriodsService } from '@/src/lib2/services/AccountingPeriodsService';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

interface ExerciceComptableDetailViewProps {
    exercice: ExerciceComptableDto | null;
    onSave: (data: ExerciceComptableDto) => void;
    onClose: () => void;
    onDelete: () => void;
    onBack: () => void;
}

export const ExerciceComptableDetailView: React.FC<ExerciceComptableDetailViewProps> = ({
    exercice,
    onSave,
    onClose,
    onDelete,
    onBack,
}) => {
    const [periodes, setPeriodes] = React.useState<PeriodeComptableDto[]>([]);
    const [isLoadingPeriodes, setIsLoadingPeriodes] = React.useState(false);

    React.useEffect(() => {
        const fetchPeriodes = async () => {
            if (!exercice?.id) return;
            setIsLoadingPeriodes(true);
            try {
                // Filter periods by exercice_id if API supports it, or filter client-side
                const response = await AccountingPeriodsService.getAllPeriodeComptables();
                if (response && response.data) {
                    setPeriodes(response.data.filter(p => p.exercice_id === exercice.id));
                }
            } catch (error) {
                console.error("Failed to fetch periods for fiscal year:", error);
            } finally {
                setIsLoadingPeriodes(false);
            }
        };
        fetchPeriodes();
    }, [exercice?.id]);

    const form = useForm<ExerciceComptableDto>({
        defaultValues: exercice || {
            code: '',
            libelle: '',
            date_debut: new Date().getFullYear() + '-01-01',
            date_fin: new Date().getFullYear() + '-12-31',
            cloture: false,
        },
    });

    const onSubmit = (data: ExerciceComptableDto) => {
        onSave(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-auto rounded-none p-0 mb-8 border-b">
                            <TabsTrigger
                                value="general"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-blue-500 py-3 font-semibold text-gray-500 data-[state=active]:text-blue-600"
                            >
                                GÉNÉRAL
                            </TabsTrigger>
                            <TabsTrigger
                                value="periods"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-blue-500 py-3 font-semibold text-gray-500 data-[state=active]:text-blue-600"
                            >
                                PÉRIODES
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-6 mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    rules={{ required: "Le code est requis" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="EX: 2025" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="libelle"
                                    rules={{ required: "Le libellé est requis" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Libellé <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="EX: Exercice 2025" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="date_debut"
                                    rules={{ required: "Requis" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date de début <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date_fin"
                                    rules={{ required: "Requis" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date de fin <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                <FormField
                                    control={form.control}
                                    name="cloture"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>Clôturé</FormLabel>
                                                <FormMessage />
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="periods" className="space-y-6 mt-0">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead>Code</TableHead>
                                            <TableHead>Dates</TableHead>
                                            <TableHead>Statut</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingPeriodes ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                                                    Chargement des périodes...
                                                </TableCell>
                                            </TableRow>
                                        ) : periodes.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-gray-400 italic">
                                                    Aucune période définie pour cet exercice.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            periodes.map((periode) => (
                                                <TableRow key={periode.id}>
                                                    <TableCell className="font-medium">{periode.code}</TableCell>
                                                    <TableCell className="text-sm text-gray-500">
                                                        {periode.dateDebut} au {periode.dateFin}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={periode.cloturee ? 'secondary' : 'default'} className="text-[10px] h-5">
                                                            {periode.cloturee ? 'Clôturée' : 'Ouverte'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <Button variant="outline" type="button" onClick={onBack}>
                        Annuler
                    </Button>
                    {exercice && !exercice.cloture && (
                        <>
                            <Button variant="outline" type="button" onClick={onClose} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                <Lock className="mr-2 h-4 w-4" />
                                Clôturer
                            </Button>
                            <Button variant="destructive" type="button" onClick={onDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </Button>
                        </>
                    )}
                    <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#007bff] hover:bg-[#0069d9]">
                        <Save className="mr-2 h-4 w-4" />
                        <span>{form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
};

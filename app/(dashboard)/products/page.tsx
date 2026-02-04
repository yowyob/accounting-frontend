"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CompteDto } from '@/src/lib2/models/CompteDto';
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
import { useCompose } from '@/hooks/use-compose-store';
import { ProductForm } from '@/components/products/product-form';
import { ProductListView } from '@/components/products/product-list-view';
import { ProductDetailView } from '@/components/products/product-detail-view';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState<CompteDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<CompteDto | null>(null);

  const { onOpen, onClose } = useCompose();

  const fetchAndSetProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Using 'STOCK' as the type for products as requested by the pattern api/accounting/comptes/type/{type}
      const res = await AccountingComptesService.getAccountsByType('STOCK');
      if (res.success && res.data) {
        setProducts(res.data);
      }
      if (selectedProductId && res.data && !res.data.some(p => p.id === selectedProductId)) {
        setSelectedProductId(null);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Erreur lors de la récupération des articles");
    } finally {
      setIsLoading(false);
    }
  }, [selectedProductId]);

  useEffect(() => {
    fetchAndSetProducts();
  }, [fetchAndSetProducts]);

  const handleSave = async (data: CompteDto) => {
    try {
      if (data.id) {
        await AccountingComptesService.updateCompte(data.id, data);
        toast.success("Article mis à jour");
      } else {
        await AccountingComptesService.createCompte({
          ...data,
          typeCompte: 'STOCK'
        });
        toast.success("Article créé");
        onClose();
      }
      await fetchAndSetProducts();
    } catch (error) {
      console.error("Failed to save product", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await AccountingComptesService.deleteCompte(productToDelete.id || '');
      toast.success("Article supprimé");
      await fetchAndSetProducts();
      if (selectedProductId === productToDelete.id) {
        setSelectedProductId(null);
      }
    } catch (error) {
      console.error("Failed to delete product :", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setProductToDelete(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await AccountingComptesService.deleteCompte(id);
        toast.success("Article supprimé");
        handleBackToList();
        await fetchAndSetProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleOpenCompose = () => {
    onOpen({
      title: "Nouvel Article",
      content: <ProductForm onSave={handleSave} initialData={null} />
    });
  };

  const handleBackToList = () => {
    setSelectedProductId(null);
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  if (selectedProductId && selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        onSave={handleSave}
        onDelete={handleDelete}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <>
      <ProductListView
        products={products}
        isLoading={isLoading}
        onSelectProduct={setSelectedProductId}
        onEditProduct={setSelectedProductId}
        onDeleteProduct={setProductToDelete}
        onAddNew={handleOpenCompose}
        onRefresh={fetchAndSetProducts}
      />
      {productToDelete && (
        <ConfirmationDialog
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${productToDelete?.libelle} ?`}
          description="Cette action est irréversible. Toutes les données associées à cet article seront perdues."
        />)}
    </>
  );
}
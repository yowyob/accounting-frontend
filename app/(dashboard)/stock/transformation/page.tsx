"use client"; // <--- Indispensable pour �viter l'erreur "fetch failed"

import React, { useState, useEffect } from 'react';
import { ProductTransformationForm } from "@/components/stock/transformation/product-transformation-form";

// --- Importations API (Docommentez quand le backend est pret) ---
// import { getProducts, getWarehouses } from "@/lib/api";

// =========================================================
// 1. DONNEES MOCKEES (TEMPORAIRE)
// =========================================================
const mockProducts = [
  { id: '1', name: 'Bois (Planche)', reference: 'MAT-001', quantity: 200 },
  { id: '2', name: 'Clous (Bo�te)', reference: 'MAT-002', quantity: 50 },
  { id: '3', name: 'Table finie', reference: 'PROD-100', quantity: 10 },
  { id: '4', name: 'Vernis', reference: 'MAT-003', quantity: 20 },
];

const mockWarehouses = [
  { id: '1', name: 'Entrepot Principal (Douala)' },
  { id: '2', name: 'Atelier de Production' },
  { id: '3', name: 'Magasin Bastos (Yaounde)' },
];

// --- 2. COMPOSANT CLIENT (Plus de 'async') ---
export default function ProductTransformationPage() {

  // =========================================================
  // LOGIQUE BACKEND (ACTUELLEMENT EN COMMENTAIRE)
  // =========================================================
  /*
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, warehousesData] = await Promise.all([
          getProducts(),
          getWarehouses()
        ]);
        setProducts(productsData);
        setWarehouses(warehousesData);
      } catch (err) {
        console.error("Erreur API:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="p-6">Chargement...</div>;
  */

  // =========================================================
  // LOGIQUE MOCK (ACTIVE)
  // =========================================================
  const products = mockProducts;
  const warehouses = mockWarehouses;

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">
            Transformation de Produit
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Consommez des articles en stock (matieres premieres) pour en creer de nouveaux (produits finis).
        </p>
      </div>
      <div className="flex-grow min-h-0">
        {/* On passe les mocks au formulaire */}
        <ProductTransformationForm 
            products={products as any} 
            warehouses={warehouses as any} 
        />
      </div>
    </div>
  );
}
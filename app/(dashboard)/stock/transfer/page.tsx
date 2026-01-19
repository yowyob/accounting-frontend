"use client"; // <--- Indispensable pour éviter l'erreur "fetch failed"

import React, { useState, useEffect } from 'react';
import { WarehouseTransferForm } from "@/components/stock/transfer/warehouse-transfer-form";

// --- Importations API (Décommentez quand le backend est prêt) ---
// import { getProducts, getWarehouses } from "@/lib/api";

// =========================================================
// 1. DONNÉES MOCKÉES (TEMPORAIRE)
// =========================================================
const mockProducts = [
  { id: '1', name: 'Ordinateur Portable HP', reference: 'LAP-001', quantity: 50 },
  { id: '2', name: 'Chaise de Bureau', reference: 'MOB-002', quantity: 120 },
  { id: '3', name: 'Rame Papier A4', reference: 'BUR-003', quantity: 500 },
];

const mockWarehouses = [
  { id: '1', name: 'Entrepôt Principal (Douala)' },
  { id: '2', name: 'Magasin Bastos (Yaoundé)' },
  { id: '3', name: 'Stock de Transit' },
];

// --- 2. COMPOSANT CLIENT (Plus de 'async') ---
export default function WarehouseTransferPage() {

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
            Transfert de Stock entre Magasins
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Déplacez des articles d'un magasin source vers un magasin de destination.
        </p>
      </div>
      <div className="flex-grow min-h-0">
        {/* On passe les mocks au formulaire */}
        <WarehouseTransferForm 
            products={products as any} 
            warehouses={warehouses as any} 
        />
      </div>
    </div>
  );
}
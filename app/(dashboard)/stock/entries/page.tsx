"use client";

import React, { useState, useEffect } from 'react';
import { StockMovementForm } from "@/components/stock/entries/stock-movement-form";

// --- Importations API (Décommentez quand le backend est prêt) ---
// import { getProducts, getWarehouses } from "@/lib/api";

// =========================================================
// 1. DONNÉES MOCKÉES (TEMPORAIRE - À SUPPRIMER PLUS TARD)
// =========================================================
const mockProducts = [
  { id: '1', name: 'Ordinateur Portable HP', reference: 'LAP-001', price: 450000 },
  { id: '2', name: 'Chaise de Bureau', reference: 'MOB-002', price: 85000 },
  { id: '3', name: 'Rame Papier A4', reference: 'BUR-003', price: 3500 },
];

const mockWarehouses = [
  { id: '1', name: 'Entrepôt Principal (Douala)' },
  { id: '2', name: 'Magasin Bastos (Yaoundé)' },
  { id: '3', name: 'Stock de Transit' },
];

export default function StockEntriesPage() {
  
  // =========================================================
  // 2. LOGIQUE BACKEND (ACTUELLEMENT EN COMMENTAIRE)
  // =========================================================
  /*
  // États pour stocker les données venant de l'API
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // On lance les deux requêtes en parallèle pour aller plus vite
        const [productsData, warehousesData] = await Promise.all([
          getProducts(),
          getWarehouses()
        ]);

        setProducts(productsData);
        setWarehouses(warehousesData);
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
        setError("Impossible de charger les produits et entrepôts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Affichage pendant le chargement
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Chargement des données...</div>;
  }

  // Affichage en cas d'erreur
  if (error) {
    return <div className="p-8 text-center text-red-500">Erreur : {error}</div>;
  }
  */

  // =========================================================
  // 3. LOGIQUE ACTUELLE (UTILISATION DES MOCKS)
  // =========================================================
  // (Supprimez ces 2 lignes quand vous dé-commenterez le bloc ci-dessus)
  const products = mockProducts;
  const warehouses = mockWarehouses;


  // =========================================================
  // 4. RENDU DE LA PAGE
  // =========================================================
  return (
    <div className="h-full flex flex-col gap-6 p-6"> 
      
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">
            Gestion des Entrées / Sorties de Stock
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enregistrez les entrées (achats, retours) et les sorties (ventes, pertes) de marchandises.
        </p>
      </div>

      <div className="flex-grow min-h-0">
        {/* Le formulaire reçoit les données (soit mocks, soit API) */}
        <StockMovementForm 
            products={products as any} 
            warehouses={warehouses as any} 
        />
      </div>
    </div>
  );
}
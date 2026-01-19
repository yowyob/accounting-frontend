// src/lib/tax-utils.ts

/**
 * A.2. Fonction: calculateTTC
 * Calcule le montant Toutes Taxes Comprises (TTC) à partir du Hors Taxe (HT).
 * Formule : TTC = HT * (1 + Taux_TVA)
 * * @param ht Le montant Hors Taxe.
 * @param tvaRate Le taux de TVA (ex: 0.20 pour 20%).
 * @returns Le montant TTC.
 */
export const calculateTTC = (ht: number, tvaRate: number): number => {
    // Gestion des entrées invalides
    if (ht < 0 || tvaRate < 0) return 0;
    
    // Le taux est utilisé comme paramètre, garantissant la flexibilité.
    return ht * (1 + tvaRate);
  };
  
  /**
   * A.3. Fonction: calculateHT
   * Calcule le montant Hors Taxe (HT) à partir du Toutes Taxes Comprises (TTC).
   * Formule : HT = TTC / (1 + Taux_TVA)
   * * @param ttc Le montant Toutes Taxes Comprises.
   * @param tvaRate Le taux de TVA.
   * @returns Le montant HT, arrondi à deux décimales.
   */
  export const calculateHT = (ttc: number, tvaRate: number): number => {
    // Gestion des entrées invalides ou division par zéro
    if (ttc < 0 || tvaRate < 0 || 1 + tvaRate === 0) return 0;
    
    const rawHT = ttc / (1 + tvaRate);
    
    // Utilisation de toFixed(2) pour gérer la précision (critique en comptabilité)
    return Number(rawHT.toFixed(2));
  };
  
  /**
   * A.4. Fonction: calculateTVA
   * Calcule le montant de la Taxe sur la Valeur Ajoutée (TVA).
   * Peut calculer à partir du HT ou du TTC.
   * * @param amount Le montant d'entrée (HT si isHT=true, TTC sinon).
   * @param tvaRate Le taux de TVA.
   * @param isHT Indique si l'amount fourni est Hors Taxe (par défaut: true).
   * @returns Le montant de la TVA, arrondi à deux décimales.
   */
  export const calculateTVA = (amount: number, tvaRate: number, isHT: boolean = true): number => {
    if (amount < 0 || tvaRate < 0) return 0;
    
    let tvaAmount: number;
    
    if (isHT) {
      // Calcul basé sur le HT: HT * Taux
      tvaAmount = amount * tvaRate;
    } else {
      // Calcul basé sur le TTC: TTC - HT
      const ht = calculateHT(amount, tvaRate);
      tvaAmount = amount - ht;
    }
    
    // Assurer que le résultat final est bien arrondi au centime près
    return Number(tvaAmount.toFixed(2));
  };
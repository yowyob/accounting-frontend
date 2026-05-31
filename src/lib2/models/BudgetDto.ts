/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BudgetDto = {
    id?: string;
    exerciceId?: string;
    periodeId?: string;
    parentId?: string;
    parentNom?: string;
    compteId?: string;
    noCompte?: string;
    libelleCompte?: string;
    code?: string;
    nom?: string;
    montantAlloue?: number;
    montantConsomme?: number;
    libelle?: string;
    notes?: string;
    type?: 'EXERCICE' | 'PERIODE' | 'ANALYTIQUE' | string;
    statut?: 'BROUILLON' | 'VALIDE' | 'ACTIF' | 'INACTIF' | 'CLOTURE' | string;
    seuilAlerte?: number;
    dateDebut?: string;
    dateFin?: string;
    axeIds?: Array<string>;
    axeLibelles?: string;
    compteLines?: Array<BudgetLigneCompteDto>;
    createdAt?: string;
    createdBy?: string;
};

export type BudgetLigneCompteDto = {
    id?: string;
    compteId?: string;
    noCompte?: string;
    libelleCompte?: string;
    montantAlloue?: number;
    montantConsomme?: number;
    description?: string;
};

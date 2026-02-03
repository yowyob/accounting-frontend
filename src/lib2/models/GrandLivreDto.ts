/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LigneGrandLivreDto } from './LigneGrandLivreDto';
export type GrandLivreDto = {
    noCompte?: string;
    libelleCompte?: string;
    soldeOuverture?: number;
    totalDebit?: number;
    totalCredit?: number;
    soldeCloture?: number;
    lignes?: Array<LigneGrandLivreDto>;
};


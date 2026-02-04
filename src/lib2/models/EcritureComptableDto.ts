/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DetailEcritureDto } from './DetailEcritureDto';
export type EcritureComptableDto = {
    id?: string;
    libelle: string;
    validee?: boolean;
    statut?: string;
    actif?: boolean;
    notes?: string;
    numeroEcriture?: string;
    dateEcriture: string;
    journalComptableId: string;
    journalComptableLibelle?: string;
    periodeComptableId: string;
    periodeComptableCode?: string;
    montantTotalDebit: number;
    montantTotalCredit: number;
    dateValidation?: string;
    validatedBy?: string;
    referenceExterne?: string;
    detailsEcriture?: Array<DetailEcritureDto>;
    createdAt?: string;
    updatedAt?: string;
};


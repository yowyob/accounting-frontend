/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EcritureComptableDto } from './EcritureComptableDto';
export type JournalComptableDto = {
    id?: string;
    libelle: string;
    notes?: string;
    actif?: boolean;
    codeJournal: string;
    typeJournal: string;
    createdAt?: string;
    updatedAt?: string;
    ecritureComptable?: Array<EcritureComptableDto>;
};


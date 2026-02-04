/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContrepartieDto } from './ContrepartieDto';
export type OperationComptableDto = {
    id?: string;
    actif: boolean;
    notes?: string;
    contreparties?: Array<ContrepartieDto>;
    typeOperation: string;
    modeReglement: string;
    comptePrincipalId: string;
    estCompteStatique: boolean;
    sensPrincipal: string;
    journalComptableId: string;
    typeMontant: string;
    plafondClient?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
};


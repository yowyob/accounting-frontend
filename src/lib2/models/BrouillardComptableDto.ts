/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNode } from './JsonNode';
export type BrouillardComptableDto = {
    id?: string;
    type?: BrouillardComptableDto.type;
    statut?: BrouillardComptableDto.statut;
    sourceId?: string;
    sourceType?: string;
    numeroPiece?: string;
    datePiece?: string;
    libelle?: string;
    montantTotal?: number;
    devise?: string;
    journalId?: string;
    journalCode?: string;
    journalLibelle?: string;
    periodeId?: string;
    periodeCode?: string;
    dataJson?: JsonNode;
    ecritureId?: string;
    ecritureNumero?: string;
    attachmentIds?: JsonNode;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    validatedBy?: string;
    validatedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    rejectionReason?: string;
};
export namespace BrouillardComptableDto {
    export enum type {
        FACTURE_CLIENT = 'FACTURE_CLIENT',
        FACTURE_FOURNISSEUR = 'FACTURE_FOURNISSEUR',
        MOUVEMENT_STOCK = 'MOUVEMENT_STOCK',
        MOUVEMENT_CAISSE = 'MOUVEMENT_CAISSE',
        OPERATION_BANCAIRE = 'OPERATION_BANCAIRE',
        AUTRE = 'AUTRE',
    }
    export enum statut {
        BROUILLON = 'BROUILLON',
        EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
        VALIDE = 'VALIDE',
        REJETE = 'REJETE',
    }
}


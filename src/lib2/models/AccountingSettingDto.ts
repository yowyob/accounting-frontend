/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingSettingDto = {
    id?: string;
    objetType?: AccountingSettingDto.objetType;
    modeSaisie?: AccountingSettingDto.modeSaisie;
    montantSeuil?: number;
    journalId?: string;
    journalCode?: string;
    actif?: boolean;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace AccountingSettingDto {
    export enum objetType {
        FACTURE_CLIENT = 'FACTURE_CLIENT',
        FACTURE_FOURNISSEUR = 'FACTURE_FOURNISSEUR',
        MOUVEMENT_STOCK = 'MOUVEMENT_STOCK',
        MOUVEMENT_CAISSE = 'MOUVEMENT_CAISSE',
        OPERATION_BANCAIRE = 'OPERATION_BANCAIRE',
        AUTRE = 'AUTRE',
    }
    export enum modeSaisie {
        AUTOMATIQUE = 'AUTOMATIQUE',
        SEMI_AUTOMATIQUE = 'SEMI_AUTOMATIQUE',
    }
}


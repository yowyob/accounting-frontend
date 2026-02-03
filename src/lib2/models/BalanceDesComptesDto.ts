/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LigneBalanceDto } from './LigneBalanceDto';
export type BalanceDesComptesDto = {
    totalDebitOuverture?: number;
    totalCreditOuverture?: number;
    totalDebitMouvement?: number;
    totalCreditMouvement?: number;
    totalDebitCloture?: number;
    totalCreditCloture?: number;
    lignes?: Array<LigneBalanceDto>;
};


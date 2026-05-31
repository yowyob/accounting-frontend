/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { ApiResponseWrapperBudgetDto } from '../models/ApiResponseWrapperBudgetDto';
import type { ApiResponseWrapperBudgetVsRealiseDto } from '../models/ApiResponseWrapperBudgetVsRealiseDto';
import type { ApiResponseWrapperListBudgetDto } from '../models/ApiResponseWrapperListBudgetDto';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { BudgetDto } from '../models/BudgetDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AccountingBudgetsService {
    public static createBudget(requestBody: BudgetDto): CancelablePromise<ApiResponseWrapperBudgetDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/budgets',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static getAllBudgets(): CancelablePromise<ApiResponseWrapperListBudgetDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/budgets',
        });
    }

    public static getBudget(id: string): CancelablePromise<ApiResponseWrapperBudgetDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/budgets/{id}',
            path: { id },
        });
    }

    public static updateBudget(id: string, requestBody: BudgetDto): CancelablePromise<ApiResponseWrapperBudgetDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/budgets/{id}',
            path: { id },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static deleteBudget(id: string): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/budgets/{id}',
            path: { id },
        });
    }

    public static getBudgetsByExercice(exerciceId: string): CancelablePromise<ApiResponseWrapperListBudgetDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/budgets/exercice/{exerciceId}',
            path: { exerciceId },
        });
    }

    public static getBudgetsByPeriode(periodeId: string): CancelablePromise<ApiResponseWrapperListBudgetDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/budgets/periode/{periodeId}',
            path: { periodeId },
        });
    }

    public static getBudgetVsRealise(exerciceId: string): CancelablePromise<ApiResponseWrapperBudgetVsRealiseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/budgets/exercice/{exerciceId}/vs-realise',
            path: { exerciceId },
        });
    }

    public static validateBudget(id: string): CancelablePromise<ApiResponseWrapperBudgetDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/budgets/{id}/validate',
            path: { id },
        });
    }

    public static activateBudget(id: string): CancelablePromise<ApiResponseWrapperBudgetDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/budgets/{id}/activate',
            path: { id },
        });
    }

    public static deactivateBudget(id: string): CancelablePromise<ApiResponseWrapperBudgetDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/budgets/{id}/deactivate',
            path: { id },
        });
    }
}

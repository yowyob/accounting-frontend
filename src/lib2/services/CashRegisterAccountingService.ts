/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCashRegisterAccountingResponse } from '../models/ApiResponseCashRegisterAccountingResponse';
import type { CashRegisterMovementDto } from '../models/CashRegisterMovementDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CashRegisterAccountingService {
    /**
     * Account a cash register movement
     * Generates an accounting entry for a cash register movement
     * @param requestBody
     * @returns ApiResponseCashRegisterAccountingResponse OK
     * @throws ApiError
     */
    public static accountMovement(
        requestBody: CashRegisterMovementDto,
    ): CancelablePromise<ApiResponseCashRegisterAccountingResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/accounting/cash-movements',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

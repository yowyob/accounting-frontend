"use client";

import { useState, useEffect } from 'react';
import { CurrencyManagementService } from '@/src/lib2/services/CurrencyManagementService';
import { DeviseDto } from '@/src/lib2/models/DeviseDto';

export function useNationalCurrency() {
    const [nationalCurrency, setNationalCurrency] = useState<DeviseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const res = await CurrencyManagementService.getAllDevises(true);
                if (res.success && res.data) {
                    const national = res.data.find(c => c.est_nationale);
                    if (national) {
                        setNationalCurrency(national);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch national currency:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrency();
    }, []);

    return { nationalCurrency, isLoading };
}

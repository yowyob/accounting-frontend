"use client";

import { useEffect } from 'react';
import { OpenAPI as CoreOpenAPI } from '@/src/lib';
import { OpenAPI as AccountingOpenAPI } from '@/src/lib2';
import { useAuth } from '@/hooks/use-auth';

export function AuthInitializer() {
    const { initFromStorage } = useAuth();

    useEffect(() => {
        // Initialise le token OpenAPI (logique originale conservée)
        const token = localStorage.getItem('auth_token');
        if (token) {
            CoreOpenAPI.TOKEN = token;
            AccountingOpenAPI.TOKEN = token;
        }

        // Initialise le store de rôles/utilisateur depuis localStorage
        initFromStorage();
    }, [initFromStorage]);

    return null;
}

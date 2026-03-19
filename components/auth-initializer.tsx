"use client";

import { useEffect } from 'react';
import { OpenAPI } from '@/src/lib2/core/OpenAPI';

export function AuthInitializer() {
    useEffect(() => {
        // Restore token
        const token = localStorage.getItem('auth_token');
        if (token) {
            OpenAPI.TOKEN = token;
        }
        // Ensure BASE points to the correct backend (not hardcoded localhost)
        OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081';
    }, []);

    return null;
}

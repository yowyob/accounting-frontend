"use client";

import { useEffect } from 'react';
import { OpenAPI } from '@/src/lib';

export function AuthInitializer() {
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            OpenAPI.TOKEN = token;
        }
    }, []);

    return null;
}

"use client";

import { CustomPageLoader } from '@/components/ui/custom-page-loader';

export default function Loading() {
    // You can customize the message or loader for the overall analyse section loading
    return <CustomPageLoader message="Chargement du module d'analyse..." />;
}

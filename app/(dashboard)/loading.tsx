"use client";

import { CustomPageLoader } from '@/components/ui/custom-page-loader';

export default function Loading() {
    // Global dashboard loading state
    return <CustomPageLoader message="Chargement de l'interface..." />;
}

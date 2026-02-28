"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/hooks/use-loading-store";
import { CustomPageLoader } from "@/components/ui/custom-page-loader";

export const NavigationLoader = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isLoading, stopLoading } = useLoadingStore();

    useEffect(() => {
        // Stop loading once the new route has successfully mounted/rendered
        stopLoading();
    }, [pathname, searchParams, stopLoading]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
            <CustomPageLoader message="Chargement en cours..." />
        </div>
    );
};

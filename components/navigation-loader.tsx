"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/hooks/use-loading-store";

export const NavigationLoader = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { startLoading } = useLoadingStore();

    useEffect(() => {
        // Trigger loading on path or param change
        // We only start here; the page layout/component will stop it when mounted
        startLoading();
    }, [pathname, searchParams, startLoading]);

    return null;
};

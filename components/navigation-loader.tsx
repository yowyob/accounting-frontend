"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/hooks/use-loading-store";

export const NavigationLoader = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { startLoading, stopLoading } = useLoadingStore();

    useEffect(() => {
        // Trigger loading on path or param change
        startLoading();

        // Simulate a short delay for smooth transition or wait for next tick
        const timer = setTimeout(() => {
            stopLoading();
        }, 500); // 500ms delay to make it visible but not annoying

        return () => clearTimeout(timer);
    }, [pathname, searchParams, startLoading, stopLoading]);

    return null;
};

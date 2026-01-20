"use client";

import React, { useEffect, useState } from "react";
import { useLoadingStore } from "@/hooks/use-loading-store";

const QUOTES = [
    "La patience est une vertu de l'esprit...",
    "Le succès est un voyage, pas une destination.",
    "L'innovation distingue le leader du suiveur.",
    "La simplicité est la sophistication suprême.",
];

export const LoadingOverlay = () => {
    const { isLoading, progress } = useLoadingStore();
    const [displayProgress, setDisplayProgress] = useState(0);
    const [quote, setQuote] = useState("");

    useEffect(() => {
        if (isLoading) {
            setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
            // Simulate progress if no real progress is provided
            if (progress === 0) {
                const interval = setInterval(() => {
                    setDisplayProgress((prev) => (prev >= 95 ? 95 : prev + 5));
                }, 100);
                return () => clearInterval(interval);
            } else {
                setDisplayProgress(progress);
            }
        } else {
            setDisplayProgress(0);
        }
    }, [isLoading, progress]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] transition-all duration-500 animate-in fade-in">
            <div className="flex flex-col items-center gap-8 max-w-sm text-center">
                {/* Circular Progress */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-800"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * (displayProgress || 0)) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-300 ease-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="absolute text-3xl font-bold text-white tracking-tighter">
                        {displayProgress}%
                    </span>
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl -z-10" />
                </div>

                {/* Text and Animations */}
                <div className="space-y-4">
                    <h2 className="text-xl font-medium text-slate-200 tracking-wide">
                        Chargement en cours
                    </h2>
                    <div className="flex justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 rounded-full bg-violet-700 animate-bounce" />
                    </div>
                    <p className="text-sm text-slate-500 italic mt-6 opacity-80 max-w-[250px] mx-auto leading-relaxed">
                        {quote}
                    </p>
                </div>
            </div>
        </div>
    );
};

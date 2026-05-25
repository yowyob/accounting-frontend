"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useCompose } from '@/hooks/use-compose-store';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { X, Minus, Expand, Minimize, GripHorizontal } from 'lucide-react';

const WINDOW_WIDTH = 500;

export function ComposeWindow() {
    const { isOpen, title, content, isMinimized, isMaximized, onClose, onToggleMinimize, onToggleMaximize } = useCompose();

    // top/left in pixels — null = use default CSS anchor (bottom-right)
    const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
    const dragging = useRef(false);
    const dragOrigin = useRef({ mouseX: 0, mouseY: 0, left: 0, top: 0 });

    // Set initial position when the window first opens
    useEffect(() => {
        if (isOpen && pos === null) {
            const height = window.innerHeight * 0.7;
            setPos({
                left: window.innerWidth - WINDOW_WIDTH - 64,
                top: window.innerHeight - height,
            });
        }
        if (!isOpen) setPos(null);
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (isMaximized || isMinimized || pos === null) return;
        e.preventDefault();
        dragging.current = true;
        dragOrigin.current = { mouseX: e.clientX, mouseY: e.clientY, left: pos.left, top: pos.top };

        const onMove = (ev: MouseEvent) => {
            if (!dragging.current) return;
            setPos({
                left: dragOrigin.current.left + (ev.clientX - dragOrigin.current.mouseX),
                top: dragOrigin.current.top + (ev.clientY - dragOrigin.current.mouseY),
            });
        };
        const onUp = () => {
            dragging.current = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [isMaximized, isMinimized, pos]);

    if (!isOpen) return null;

    const isDraggable = !isMaximized && !isMinimized;

    // Minimisé → barre collée en bas à droite, indépendamment de pos
    // Maximisé → plein écran
    // Normal → position trackée ou ancre bas-droite par défaut
    let style: React.CSSProperties;
    if (isMaximized) {
        style = { top: 0, left: 0, width: '100vw', height: '100vh' };
    } else if (isMinimized) {
        // Forcer bottom/right sans top/left pour coller en bas
        style = { bottom: 0, right: 64, width: WINDOW_WIDTH, height: 48, top: 'auto', left: 'auto' };
    } else if (pos) {
        style = { top: pos.top, left: pos.left, width: WINDOW_WIDTH, height: '70vh' };
    } else {
        style = { bottom: 0, right: 64, width: WINDOW_WIDTH, height: '70vh' };
    }

    return (
        <div
            style={style}
            className={cn(
                "fixed z-50 flex flex-col bg-white shadow-2xl border border-gray-200 transition-all duration-300",
                isMaximized ? "rounded-none" : "rounded-t-lg"
            )}
        >
            <header
                className={cn(
                    "flex items-center justify-between px-4 py-2 bg-blue-600 text-white select-none",
                    isMaximized ? "rounded-none" : "rounded-t-lg",
                    isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                    isMinimized && "opacity-90"
                )}
                onMouseDown={handleMouseDown}
                onClick={() => isMinimized && onToggleMinimize()}
            >
                <div className="flex items-center gap-2">
                    {isDraggable && <GripHorizontal className="h-4 w-4 opacity-60 shrink-0" />}
                    <h3 className="font-semibold text-sm truncate">{title}</h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-blue-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isMaximized) {
                                // Quitter le plein écran puis réduire
                                onToggleMaximize();
                                setTimeout(() => onToggleMinimize(), 50);
                            } else {
                                onToggleMinimize();
                            }
                        }}
                        title={isMinimized ? "Restaurer" : "Réduire"}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    {/* Bouton Expand/Maximize — visible aussi quand minimisé pour agrandir */}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-blue-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isMinimized) {
                                // Depuis la barre minimisée : restaurer d'abord, puis maximiser
                                onToggleMinimize();
                                setTimeout(() => onToggleMaximize(), 50);
                            } else {
                                onToggleMaximize();
                            }
                        }}
                        title={isMaximized ? "Restaurer" : "Plein écran"}>
                        {isMaximized ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-blue-700"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        title="Fermer">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {!isMinimized && (
                <div className="flex-1 overflow-hidden flex flex-col">
                    {content}
                </div>
            )}
        </div>
    );
}

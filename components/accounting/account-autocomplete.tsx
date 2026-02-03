"use client";

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Check, AlertCircle } from 'lucide-react';
import { CompteDto } from '@/src/lib2/models/CompteDto';
import { cn } from '@/lib/utils';

interface AccountAutocompleteProps {
    value: string;
    onChange: (val: string) => void;
    accounts: CompteDto[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const AccountAutocomplete = memo(({
    value,
    onChange,
    accounts,
    placeholder,
    className,
    disabled
}: AccountAutocompleteProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredAccounts = useMemo(() => {
        const searchTerm = (value || "").toString().trim();
        if (!searchTerm) return [];
        return accounts.filter(acc => acc.noCompte?.startsWith(searchTerm)).slice(0, 10);
    }, [value, accounts]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <Input
                    value={value ?? ""}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={cn("font-mono pr-8", className)}
                    disabled={disabled}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={14} />
                </div>
            </div>

            {isOpen && (value ?? "").toString().trim() !== '' && (
                <div className="absolute z-[100] w-full mt-1 bg-white border rounded-md shadow-xl max-h-64 overflow-auto animate-in fade-in zoom-in duration-200">
                    {filteredAccounts.length > 0 ? (
                        <div className="py-1">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/50">
                                Comptes suggérés
                            </div>
                            {filteredAccounts.map(acc => (
                                <div
                                    key={acc.id}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition-colors"
                                    onClick={() => {
                                        onChange(acc.noCompte!);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-mono font-bold text-sm text-gray-900 group-hover:text-blue-700">{acc.noCompte}</span>
                                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{acc.libelle}</span>
                                    </div>
                                    <Check size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-4 text-sm text-red-500 bg-red-50/30 flex flex-col items-center gap-2 text-center">
                            <AlertCircle size={20} className="text-red-400" />
                            <div className="flex flex-col">
                                <span className="font-semibold">Aucun compte correspondant</span>
                                <span className="text-[10px] text-red-400">Vérifiez le numéro saisi</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

AccountAutocomplete.displayName = "AccountAutocomplete";

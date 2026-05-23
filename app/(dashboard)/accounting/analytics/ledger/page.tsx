"use client";

import React from 'react';
import { BookOpen } from 'lucide-react';
import { AnalyticalLedgerView } from '@/components/accounting/analytical-ledger-view';
import { PermissionGuard } from '@/components/auth/permission-guard';

export default function AnalyticalLedgerPage() {
    return (
        <div className="bg-gray-50/50 min-h-full">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-xl bg-indigo-100 p-3">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Grand Livre Analytique
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Consultez et filtrez les écritures comptables par axe et compte analytique.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <PermissionGuard
                    feature="analytics"
                    action="read"
                    fallback={
                        <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400 text-sm">
                            Vous n'avez pas la permission de consulter ce grand livre.
                        </div>
                    }
                >
                    <AnalyticalLedgerView />
                </PermissionGuard>
            </div>
        </div>
    );
}

"use client";

import { RoleAssignmentView } from '@/components/accounting/role-assignment-view';
import { Shield } from 'lucide-react';

export default function RoleAssignmentPage() {
    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-100 space-y-6">
            <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6 flex items-start gap-4">
                    <div className="p-2.5 bg-purple-100 rounded-lg">
                        <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-1">Attribution des Rôles Comptables</h2>
                        <p className="text-sm text-gray-500">
                            Gérez les rôles des utilisateurs du module comptable. Seul le Responsable Comptable peut effectuer ces modifications.
                        </p>
                    </div>
                </div>

                <RoleAssignmentView />
            </div>
        </div>
    );
}

// components/accounting/role-assignment-view.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Shield, UserCheck, AlertTriangle } from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/hooks/use-auth';
import { getRoleLabel } from '@/src/lib/auth/roles';
import { toast } from 'sonner';

interface MockUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

const ROLE_OPTIONS = [
    { value: 'AIDE_COMPTABLE', label: 'Aide-comptable' },
    { value: 'COMPTABLE', label: 'Comptable' },
    { value: 'RESPONSABLE_COMPTABLE', label: 'Responsable comptable' },
];

export const RoleAssignmentView: React.FC = () => {
    const { user } = useAuth();
    const [mockUsers, setMockUsers] = useState<MockUser[]>([]);
    const [saving, setSaving] = useState<string | null>(null);

    const loadUsers = () => {
        const stored = localStorage.getItem('mock_users');
        if (stored) {
            try {
                setMockUsers(JSON.parse(stored));
            } catch {
                setMockUsers([]);
            }
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleChange = (userId: string, email: string, newRole: string) => {
        // Un utilisateur ne peut pas modifier son propre rôle
        if (user?.email === email) {
            toast.warning('Impossible de modifier votre propre rôle.', {
                description: 'Contactez un autre responsable pour modifier votre rôle.',
            });
            return;
        }

        setSaving(userId);
        const updated = mockUsers.map((u) =>
            u.id === userId ? { ...u, role: newRole } : u
        );
        setMockUsers(updated);
        localStorage.setItem('mock_users', JSON.stringify(updated));
        setSaving(null);

        toast.success('Rôle mis à jour', {
            description: `Le rôle de ${email} a été modifié en "${getRoleLabel(newRole)}".`,
            className: "bg-green-50 border-green-200 text-green-800",
        });
    };

    const roleColor = (role: string) => {
        switch (role) {
            case 'RESPONSABLE_COMPTABLE': return 'bg-purple-100 text-purple-800';
            case 'COMPTABLE': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">

            {/* Stats */}
            <div className="flex gap-4 flex-wrap">
                {ROLE_OPTIONS.map((r) => (
                    <div key={r.value} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{r.label}:</span>
                        <strong className="text-sm">{mockUsers.filter(u => u.role === r.value).length}</strong>
                    </div>
                ))}
            </div>

            {/* Refresh */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{mockUsers.length} utilisateur(s) enregistré(s)</p>
                <Button variant="outline" size="sm" onClick={loadUsers} className="border-gray-300">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="py-3 px-4">Utilisateur</TableHead>
                            <TableHead className="py-3 px-4">Email</TableHead>
                            <TableHead className="py-3 px-4">Rôle actuel</TableHead>
                            <TableHead className="py-3 px-4">Changer le rôle</TableHead>
                            <TableHead className="py-3 px-4 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <UserCheck className="h-8 w-8 text-gray-300" />
                                        <p>Aucun utilisateur inscrit en mode test.</p>
                                        <p className="text-xs">Les utilisateurs apparaissent ici après inscription via le formulaire.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            mockUsers
                                .filter(u => u.email !== user?.email)
                                .map((u) => {
                                    const isSelf = user?.email === u.email;
                                    return (
                                        <TableRow key={u.id} className={`hover:bg-gray-50 border-b border-gray-100 ${isSelf ? 'bg-amber-50/40' : ''}`}>
                                            <TableCell className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                                                        {u.firstName?.[0]}{u.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{u.firstName} {u.lastName}</p>
                                                        {isSelf && <span className="text-xs text-amber-600 font-medium">Vous</span>}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 px-4 text-gray-600">{u.email}</TableCell>
                                            <TableCell className="py-3 px-4">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColor(u.role)}`}>
                                                    {getRoleLabel(u.role)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3 px-4">
                                                <select
                                                    disabled={isSelf || saving === u.id}
                                                    defaultValue={u.role}
                                                    onChange={(e) => handleRoleChange(u.id, u.email, e.target.value)}
                                                    className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {ROLE_OPTIONS.map((r) => (
                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                    ))}
                                                </select>
                                            </TableCell>
                                            <TableCell className="py-3 px-4 text-right">
                                                {isSelf ? (
                                                    <span className="text-xs text-amber-600">Non modifiable</span>
                                                ) : (
                                                    <span className="text-xs text-green-600">Modifiable</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

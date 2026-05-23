"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';

interface PermissionGuardProps {
    /** Fonctionnalité cible (ex: "accounts", "journals") */
    feature: string;
    /** Action souhaitée (ex: "create", "update", "delete") */
    action: string;
    /** Contenu à afficher si l'utilisateur a la permission */
    children: React.ReactNode;
    /**
     * Contenu à afficher à la place si l'utilisateur n'a PAS la permission.
     * Par défaut : rien (null).
     */
    fallback?: React.ReactNode;
}

/**
 * Composant de protection par permission.
 *
 * Affiche `children` uniquement si l'utilisateur connecté a la permission
 * d'effectuer `action` sur `feature`. Sinon, affiche `fallback` (null par défaut).
 *
 * @example
 * // Masquer un bouton de création si l'utilisateur n'est pas Comptable ou Responsable
 * <PermissionGuard feature="accounts" action="create">
 *   <Button>Nouveau compte</Button>
 * </PermissionGuard>
 *
 * @example
 * // Afficher un message alternatif pour les utilisateurs sans permission
 * <PermissionGuard feature="periods" action="lock" fallback={<span>Lecture seule</span>}>
 *   <Button>Verrouiller la période</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
    feature,
    action,
    children,
    fallback = null,
}: PermissionGuardProps) {
    const { checkPermission } = useAuth();

    if (!checkPermission(feature, action)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { getRoleLabel } from '@/src/lib/auth/roles';
import { toast } from 'sonner';
import { User, Mail, Shield, Building, Save, Camera, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ProfilePage() {
    const auth = useAuth() as any;
    const user = auth.user;
    const setUser = auth.setUser;
    const accountingRole = auth.accountingRole;

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [company, setCompany] = useState(user?.company || 'Yowyob ERP');
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-muted-foreground italic">Chargement du profil...</p>
            </div>
        );
    }

    const handleSave = () => {
        const updatedUser = { ...user, firstName, lastName, email, company };
        // Update mock storage
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const updatedUsers = mockUsers.map((u: any) => u.email === user.email ? updatedUser : u);
        localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Update state
        setUser(updatedUser);
        setIsEditing(false);
        toast.success('Profil mis à jour', {
            description: 'Vos modifications ont été enregistrées avec succès.'
        });
    };

    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

    const handlePasswordChange = () => {
        if (!passwords.current || !passwords.next || !passwords.confirm) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        if (passwords.next !== passwords.confirm) {
            toast.error('Les nouveaux mots de passe ne correspondent pas');
            return;
        }
        toast.success('Mot de passe mis à jour', {
            description: 'Votre mot de passe a été modifié avec succès.'
        });
        setIsPasswordDialogOpen(false);
        setPasswords({ current: '', next: '', confirm: '' });
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mon Profil</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Summary */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                        <CardContent className="pt-0 relative flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-md -mt-12 mb-4">
                                {initials}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{firstName} {lastName}</h2>
                            <Badge variant="secondary" className="mt-2 bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1.5 px-3">
                                <Shield className="h-3 w-3" /> {getRoleLabel(accountingRole)}
                            </Badge>
                            <div className="w-full mt-8 space-y-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm">{email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Building className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm">{company} (Organisation)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-blue-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base text-white/90">Périmètre de mon rôle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-white/70 leading-relaxed">
                                En tant que {getRoleLabel(accountingRole)?.toLowerCase()}, vous avez accès aux fonctionnalités standards du module comptable selon les spécifications SYSCOA/OHADA.
                            </p>
                            <Button variant="ghost" className="mt-4 text-white hover:bg-white/10 p-0 h-auto text-xs font-semibold underline underline-offset-4">
                                Consulter mes permissions détaillées
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                            <div>
                                <CardTitle className="text-lg">Informations personnelles</CardTitle>
                                <CardDescription>Gérez vos informations de compte ERP.</CardDescription>
                            </div>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">Modifier</Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Enregistrer</Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-slate-600 font-medium">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={!isEditing}
                                        className="border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-slate-600 font-medium">Nom</Label>
                                    <Input
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={!isEditing}
                                        className="border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-600 font-medium">Adresse email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing}
                                        className="border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="text-slate-600 font-medium">Organisation</Label>
                                    <Input
                                        id="company"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        disabled={!isEditing}
                                        className="border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-slate-400 font-medium flex items-center gap-2">
                                        Rôle comptable <Shield className="h-3 w-3" />
                                    </Label>
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-md text-slate-500 text-sm font-medium italic">
                                        {getRoleLabel(accountingRole)} — <span className="font-normal">Ce champ ne peut pas être modifié par vous-même.</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b pb-4">
                            <CardTitle className="text-lg">Sécurité</CardTitle>
                            <CardDescription>Mettez à jour votre mot de passe et vos paramètres de sécurité.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                Changer mon mot de passe
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Changer le mot de passe</DialogTitle>
                        <DialogDescription>
                            Saisissez votre mot de passe actuel et le nouveau.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Mot de passe actuel</Label>
                            <Input
                                type="password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Nouveau mot de passe</Label>
                            <Input
                                type="password"
                                value={passwords.next}
                                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirmer le nouveau mot de passe</Label>
                            <Input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700 text-white">Mettre à jour</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

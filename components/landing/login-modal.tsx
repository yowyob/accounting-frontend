"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Building2,
    Chrome,
    Facebook,
    Github
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthenticationService, OpenAPI } from '@/src/lib';
import { LoginData } from '@/types/personnel';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    password: string;
    confirmPassword: string;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    const loginForm = useForm<LoginData>({ mode: 'onChange' });
    const registerForm = useForm<RegisterFormData>({ mode: 'onChange' });

    const handleLogin = async (data: LoginData) => {
        setIsLoading(true);
        try {
            const response = await AuthenticationService.login(data);
            if (response && response.token) {
                // Store token in localStorage
                localStorage.setItem('auth_token', response.token);
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                // Set token for subsequent API calls
                OpenAPI.TOKEN = response.token;

                router.push('/accounting/dashboard');
                onClose();
            }
        } catch (error: any) {
            alert(error.message || 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const { confirmPassword, ...registerData } = data;
            const newUser = await AuthenticationService.register(registerData);
            if (newUser) {
                alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                setActiveTab('login');
                loginForm.reset({ email: newUser.email, password: '' });
            }
        } catch (error: any) {
            alert(error.message || "Erreur d'inscription");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Connexion avec ${provider}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200">
                <DialogHeader className="space-y-3 pb-2 border-b border-gray-100">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
                            KSM
                        </DialogTitle>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                        Accédez à votre espace de gestion commerciale
                    </p>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg mb-2">
                        <TabsTrigger value="login">Connexion</TabsTrigger>
                        <TabsTrigger value="register">Inscription</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="space-y-4 mt-6">
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        className="pl-10"
                                        {...loginForm.register('email', {
                                            required: 'Email requis',
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: 'Email invalide'
                                            }
                                        })}
                                    />
                                </div>
                                {loginForm.formState.errors.email && (
                                    <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Votre mot de passe"
                                        className="pl-10 pr-10"
                                        {...loginForm.register('password', {
                                            required: 'Mot de passe requis'
                                        })}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {loginForm.formState.errors.password && (
                                    <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 text-sm">
                                    <input type="checkbox" className="rounded" />
                                    <span>Se souvenir de moi</span>
                                </label>
                                <Button variant="link" className="text-sm p-0 h-auto text-blue-600 hover:underline">
                                    Mot de passe oublié ?
                                </Button>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm"
                                disabled={isLoading}
                            >
                                {isLoading ? "Connexion..." : "Se connecter"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4 mt-6">
                        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="Jean"
                                        {...registerForm.register('firstName', { required: 'Prénom requis' })}
                                    />
                                    {registerForm.formState.errors.firstName && (
                                        <p className="text-sm text-red-600">{registerForm.formState.errors.firstName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Dupont"
                                        {...registerForm.register('lastName', { required: 'Nom requis' })}
                                    />
                                    {registerForm.formState.errors.lastName && (
                                        <p className="text-sm text-red-600">{registerForm.formState.errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerEmail">Email</Label>
                                <Input
                                    id="registerEmail"
                                    type="email"
                                    placeholder="votre@email.com"
                                    {...registerForm.register('email', {
                                        required: 'Email requis',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Email invalide'
                                        }
                                    })}
                                />
                                {registerForm.formState.errors.email && (
                                    <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Entreprise</Label>
                                <Input
                                    id="company"
                                    placeholder="Nom de votre entreprise"
                                    {...registerForm.register('company', { required: 'Entreprise requise' })}
                                />
                                {registerForm.formState.errors.company && (
                                    <p className="text-sm text-red-600">{registerForm.formState.errors.company.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerPassword">Mot de passe</Label>
                                <Input
                                    id="registerPassword"
                                    type="password"
                                    placeholder="Minimum 6 caractères"
                                    {...registerForm.register('password', {
                                        required: 'Mot de passe requis',
                                        minLength: { value: 6, message: 'Minimum 6 caractères' }
                                    })}
                                />
                                {registerForm.formState.errors.password && (
                                    <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    {...registerForm.register('confirmPassword', {
                                        required: 'Confirmation requise',
                                        validate: value => value === registerForm.watch('password') || 'Les mots de passe ne correspondent pas'
                                    })}
                                />
                                {registerForm.formState.errors.confirmPassword && (
                                    <p className="text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm"
                                disabled={isLoading}
                            >
                                {isLoading ? "Création du compte..." : "Créer mon compte"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
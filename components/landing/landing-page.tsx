"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  BarChart3, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  Menu,
  X,
  Wallet,
  Calculator
} from 'lucide-react';
import { LoginModal } from './login-modal';

export function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: "Comptabilité Générale",
      description: "Gestion complète de votre plan comptable, écritures et journaux avec automatisation intelligente."
    },
    {
      icon: Calculator,
      title: "États Financiers",
      description: "Génération automatique de bilans, comptes de résultat et balances en temps réel."
    },
    {
      icon: Users,
      title: "Gestion des Tiers",
      description: "Suivi détaillé de vos comptes clients et fournisseurs pour une maîtrise parfaite de vos flux."
    },
    {
      icon: TrendingUp,
      title: "Croissance Business",
      description: "Outils d'analyse pour identifier les opportunités de croissance et optimiser vos performances."
    },
    {
      icon: Shield,
      title: "Sécurité Avancée",
      description: "Protection des données avec cryptage et contrôles d'accès multi-niveaux."
    },
    {
      icon: Zap,
      title: "Performance Optimale",
      description: "Interface rapide et réactive pour une productivité maximale de vos équipes."
    }
  ];

  const stats = [
    { number: "99.9%", label: "Disponibilité" },
    { number: "500+", label: "Entreprises" },
    { number: "2M+", label: "Transactions" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation — barre Gmail */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#ea4335] flex items-center justify-center text-white text-sm font-medium">
                K
              </div>
              <div>
                <h1 className="text-[22px] font-normal text-foreground leading-none">KSM</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Solution Comptable</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Fonctionnalités
              </a>
              <a href="#solutions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Solutions
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Tarifs
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <Button onClick={() => setIsLoginOpen(true)}>
                Se connecter
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-1">
                <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-sm hover:bg-secondary">
                  Fonctionnalités
                </a>
                <a href="#solutions" className="text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-sm hover:bg-secondary">
                  Solutions
                </a>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-sm hover:bg-secondary">
                  Tarifs
                </a>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-sm hover:bg-secondary">
                  Contact
                </a>
                <Button onClick={() => setIsLoginOpen(true)} className="mx-3 mt-2">
                  Se connecter
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative overflow-hidden py-20 sm:py-28 bg-card">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-normal text-foreground tracking-normal">
              Maîtrisez votre
              <span className="text-primary font-normal"> Gestion Comptable</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              KSM vous offre une suite complète d&apos;outils pour gérer efficacement votre comptabilité,
              vos flux financiers et vos rapports. Simplifiez votre gestion financière avec notre solution tout-en-un.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={() => setIsLoginOpen(true)} className="px-8">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-normal text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground mb-3">
              Fonctionnalités avancées
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Découvrez les outils qui vous aideront à développer votre activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-normal text-white mb-4">
            Prêt à révolutionner votre entreprise ?
          </h2>
          <p className="text-base text-white/90 mb-8 leading-relaxed">
            Rejoignez des centaines d&apos;entreprises qui font déjà confiance à KSM
            pour optimiser leur gestion comptable et financière.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-secondary px-8"
            >
              Démarrer maintenant
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8"
            >
              Contacter l&apos;équipe
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#ea4335] flex items-center justify-center text-white text-xs font-medium">
                  K
                </div>
                <span className="text-base font-normal text-foreground">KSM</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Solution complète pour maîtriser votre gestion comptable.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-foreground mb-3">Produit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Centre d&apos;aide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm text-foreground mb-3">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Presse</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
            <p>&copy; 2025 KSM. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </div>
  );
}

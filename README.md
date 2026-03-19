# KSM ERP — Frontend

Interface web du système ERP YOWYOB, construite avec **Next.js 15** (App Router), **TypeScript** et **Tailwind CSS**. Déployée sur [Vercel](https://vercel.com).

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

---

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation locale](#installation-locale)
- [Variables d'environnement](#variables-denvironnement)
- [Déploiement sur Vercel](#déploiement-sur-vercel)
- [Structure du projet](#structure-du-projet)

---

## Fonctionnalités

- **Tableau de bord comptable** : Vue d'ensemble des indicateurs financiers clés.
- **Gestion des écritures comptables** : Saisie, validation, lettrage.
- **Rapports financiers** : Balance des comptes, grand livre, bilan, compte de résultat, tableau de flux de trésorerie.
- **Gestion des journaux et périodes comptables**.
- **Facturation** : Création et suivi des factures clients/fournisseurs.
- **Gestion des tiers** : Clients et fournisseurs.
- **Notifications en temps réel**.
- **Authentification JWT** : Connexion sécurisée avec gestion des rôles.
- **Mode sombre / clair** : Thème adaptatif.
- **Interface responsive** : Optimisée pour desktop.

---

## Stack technique

| Composant | Technologie |
|-----------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Langage | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Composants UI | [Shadcn/UI](https://ui.shadcn.com/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Data Fetching | `fetch` natif + API client généré (`src/lib2`) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Backend | Spring Boot (YOWYOB ERP Backend) |
| Déploiement | [Vercel](https://vercel.com) |

---

## Prérequis

- [Node.js](https://nodejs.org/) **20.x** ou supérieur
- [npm](https://www.npmjs.com/) ou `pnpm`
- Un backend YOWYOB ERP démarré (local ou sur Render)

---

## Installation locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/Delmat237/Yowyob-ERP-Accounting.git
cd Yowyob-ERP-Accounting/FRONTEND
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
# Éditer .env.local avec ton URL backend
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

### 5. Build de production (optionnel)

```bash
npm run build
```

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine du dossier `FRONTEND/` :

```env
# URL du backend YOWYOB ERP
NEXT_PUBLIC_API_URL=http://localhost:8081

# URL de l'API d'authentification
NEXT_PUBLIC_AUTH_URL=https://rt-comops.onrender.com
```

Sur **Vercel**, ces variables sont à définir dans **Project Settings → Environment Variables**.

---

## Déploiement sur Vercel

### Option 1 — CLI Vercel (recommandé)

```bash
# Installer le CLI si pas encore fait
npm install -g vercel

# Se connecter
vercel login

# Déployer en production
vercel --prod
```

### Option 2 — Intégration GitHub automatique

1. Connecter le dépôt sur [Vercel Dashboard](https://vercel.com/new)
2. Définir les variables d'environnement dans les paramètres du projet
3. Chaque push sur la branche principale déclenche un redéploiement automatique

> **Note :** Le projet est configuré avec `eslint.ignoreDuringBuilds: true` dans `next.config.ts` pour éviter que les avertissements ESLint dans les fichiers auto-générés ne bloquent les builds de production.

---

## Structure du projet

```
FRONTEND/
├── app/                      → Pages et layouts (App Router)
│   ├── (dashboard)/          → Pages protégées (authentifiées)
│   │   ├── accounting/       → Module comptabilité
│   │   ├── analyse/          → Rapports financiers
│   │   ├── customers/        → Gestion des clients
│   │   ├── suppliers/        → Gestion des fournisseurs
│   │   ├── products/         → Gestion des produits
│   │   └── settings/         → Paramètres
│   ├── auth/                 → Pages de connexion
│   ├── layout.tsx            → Layout racine
│   └── globals.css           → Styles globaux + thème
├── components/               → Composants réutilisables
│   ├── ui/                   → Composants Shadcn/UI
│   └── ...                   → Composants métier
├── hooks/                    → Custom React hooks
├── lib/                      → Utilitaires et logique API
│   └── api.ts                → Client API principal
├── src/lib2/                 → Client API généré (OpenAPI)
│   ├── models/               → Types de données
│   └── services/             → Services par endpoint
├── types/                    → Définitions TypeScript
├── next.config.ts            → Configuration Next.js
└── tailwind.config.ts        → Configuration Tailwind
```

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
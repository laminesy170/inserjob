# Quick Start — CapOrientation 360

Démarrez en 5 minutes.

## 1. Prérequis

- Node.js 18+
- npm
- Compte Supabase gratuit
- Optionnel : compte Brevo pour les e-mails

## 2. Installation (2 minutes)

```bash
# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env.local

# Aller à https://app.supabase.com et créer un projet
# Copier :
# - API URL → NEXT_PUBLIC_SUPABASE_URL
# - Anon Key → NEXT_PUBLIC_SUPABASE_ANON_KEY
# - Service Key → SUPABASE_SERVICE_ROLE_KEY
```

## 3. Base de données (1 minute)

```bash
# Initialiser Supabase localement (optionnel)
# Ou utiliser Supabase Cloud directement

# Appliquer les migrations
npm run db:migrate

# Charger les données de démo
npm run seed
```

Cela crée :
- Une organisation de démonstration
- Un compte admin : `admin@demo.fr` / `DemoPassword123!`
- Un questionnaire d'exemple

## 4. Démarrer (1 minute)

```bash
npm run dev
```

Ouvrez http://localhost:3000

## 5. Login

- Email : `admin@demo.fr`
- Mot de passe : `DemoPassword123!`

---

## En cas de problème

### "Cannot find module @supabase"

```bash
npm install --legacy-peer-deps
```

### "SUPABASE_URL not found"

Vérifier `.env.local` contient les bonnes valeurs Supabase.

### Tests échouent

```bash
npm run test -- --run
npm run type-check
npm run lint
```

### Port 3000 déjà utilisé

```bash
npm run dev -- -p 3001
```

---

## Structure minimale à connaître

```
caporientation/
├── app/                     # Pages Next.js
│   ├── (auth)/             # Pages authentification
│   ├── api/                # Routes API
│   └── page.tsx            # Accueil
├── lib/                     # Code réutilisable
│   ├── scoring/            # Moteur de scoring
│   ├── email/              # Gestion des e-mails
│   └── validation/         # Schémas Zod
├── db/                      # Base de données
│   ├── migrations/         # SQL
│   └── types.ts            # Types TypeScript
└── __tests__/              # Tests
```

---

## Commandes principales

```bash
npm run dev              # Démarrer serveur dev
npm run build            # Build production
npm run start            # Serveur production
npm run test             # Tests unitaires
npm run lint             # ESLint
npm run type-check       # TypeScript
npm run db:migrate       # Migrations
npm run seed             # Données démo
```

---

## Prochaines étapes

1. Lire [README.md](./README.md) pour l'architecture complète
2. Lire [ARCHITECTURE.md](./ARCHITECTURE.md) pour les décisions
3. Lire [GUIDE_ADMIN.md](./GUIDE_ADMIN.md) pour l'admin
4. Implémenter les routes API dans `app/api/`
5. Implémenter les pages dans `app/`

---

## Support

- 📖 Docs : [README.md](./README.md)
- 🏗️ Architecture : [ARCHITECTURE.md](./ARCHITECTURE.md)
- 👤 Admin : [GUIDE_ADMIN.md](./GUIDE_ADMIN.md)
- 📋 Implémentation : [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

Bon développement ! 🚀

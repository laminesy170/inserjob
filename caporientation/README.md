# CapOrientation 360

Application web d'auto-positionnement à l'orientation professionnelle.

## Fonctionnalités principales

- ✅ Création de comptes conseillers
- ✅ Envoi d'invitations individuelles sécurisées
- ✅ Questionnaire responsive (mobile-first)
- ✅ Sauvegarde automatique des réponses
- ✅ Calcul des résultats côté serveur
- ✅ Génération de rapports PDF
- ✅ Notifications par e-mail
- ✅ Export JSON et CSV
- ✅ Tableau de bord conseiller
- ✅ Gestion multi-organisations
- ✅ Audit et traçabilité

## Stack technique

- **Framework** : Next.js 14 avec App Router
- **Base de données** : Supabase PostgreSQL
- **Auth** : Supabase Auth
- **Validation** : Zod
- **Formulaires** : React Hook Form
- **Styles** : Tailwind CSS
- **PDF** : @react-pdf/renderer
- **E-mails** : Brevo
- **Tests** : Vitest + Playwright
- **Security** : RLS, CSRF, Rate limiting

## Installation

### 1. Pré-requis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Brevo (pour e-mails)

### 2. Cloner et installer

```bash
cd caporientation
npm install
```

### 3. Configuration

Copier `.env.example` en `.env.local` et renseigner les variables :

```bash
cp .env.example .env.local
```

**Variables obligatoires** :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxx
BREVO_API_KEY=xxxx
BREVO_SENDER_EMAIL=noreply@caporientation.fr
INVITATION_TOKEN_PEPPER=chaîne_aléatoire_secrète
```

### 4. Configuration Supabase

```bash
# Initialiser Supabase
supabase init

# Appliquer les migrations
supabase db push

# Ou en production
npm run db:migrate
```

Les migrations créent :
- Tous les schémas et tables
- Les politiques RLS
- Les index pour la performance

### 5. Seed data

```bash
npm run seed
```

Crée :
- Une organisation de démonstration
- Un compte administrateur
- Un questionnaire exemple

## Développement

### Démarrer le serveur de développement

```bash
npm run dev
```

Accédez à `http://localhost:3000`

### Structure du code

```
app/                    # Next.js App Router
├── (auth)/             # Routes d'authentification
├── (counsel)/          # Espace conseiller (protégé)
├── api/                # Routes API
│   ├── auth/
│   ├── invitations/
│   ├── public/         # Routes publiques (questionnaire)
│   └── admin/
└── public/             # Pages publiques
```

### Moteur de scoring

Le moteur de scoring est entièrement découplé du reste de l'application :

```typescript
import { ScoringEngine } from '@/lib/scoring/engine';
import { scoringRulesV1 } from '@/lib/scoring/rules';

const engine = new ScoringEngine(questionnaire, scoringRulesV1);
const result = engine.score(answers);
```

**Caractéristiques** :
- Déterministe et testé
- Versionnement automatique
- Inversions de questions supportées
- Normes sur 0-100
- Interpretations configurables

## Tests

### Tests unitaires

```bash
npm run test
```

Tests du moteur de scoring, validation, etc.

### Tests d'intégration

```bash
npm run test:integration
```

Tests de la création d'invitation, scoring, etc.

### Tests end-to-end

```bash
npm run test:e2e
```

Tests complets du flux (mobile et desktop).

## Sécurité

### Authentification

- Tokens Supabase sécurisés
- Sessions httpOnly cookies
- Déconnexion sur fermeture du navigateur

### Invitations

- Tokens aléatoires SHA256
- Seul le hash stocké en BD
- Expiration configurable
- Single-use ou replay

### Données

- RLS strict (Row Level Security)
- Isolement multi-org
- Pas de données sensibles en logs
- Chiffrement au repos via Supabase

### API

- Validation Zod sur tous les inputs
- Rate limiting (30 req/min par IP)
- CSRF protection
- Headers de sécurité (CSP, X-Frame-Options, etc.)

## Architecture

### Flux invitation-réponse

1. **Conseiller crée invitation**
   - Valide les données
   - Génère token aléatoire
   - Envoie e-mail via Brevo (outbox)
   - Statut : `INVITATION_ENVOYEE`

2. **Bénéficiaire ouvre le lien**
   - Valide token et expiration
   - Crée session
   - Statut : `CONSULTEE`

3. **Bénéficiaire répond**
   - Affiche une question par écran
   - Sauvegarde automatique (debounce 2s)
   - Barre de progression
   - Statut : `EN_COURS`

4. **Validation finale**
   - Toutes les réponses présentes
   - Calcul scores serveur
   - Génération rapport PDF
   - Envoi e-mail conseiller
   - Statut : `RAPPORT_GENERE`

5. **Conseiller consulte résultats**
   - Tableau de bord
   - Graphiques
   - Export PDF/JSON/CSV
   - Peut ajouter notes

### Base de données

Voir `db/migrations/` pour le schéma complet.

**Tables principales** :
- `organizations` : Multi-tenancy
- `profiles` : Comptes conseillers/admins
- `questionnaires` : Versions publiées
- `invitations` : Lien bénéficiaire
- `assessment_sessions` : Réponses en cours
- `assessment_results` : Résultats finaux
- `reports` : PDFs privés
- `email_outbox` : File d'envoi
- `audit_logs` : Traçabilité

### Policies RLS

Chaque utilisateur ne voit que les données de son organisation.

```sql
-- Exemple : Un conseiller ne voit que ses invitations
SELECT * FROM invitations WHERE organization_id = auth.user().organization_id
```

## Configuration Brevo

### Créer les templates

Allez sur https://dashboard.brevo.com/templates

1. **Invitation** (ID: BREVO_TEMPLATE_INVITATION_ID)
   - Variables : `{{beneficiaryName}}`, `{{invitationLink}}`, `{{expiresAt}}`

2. **Relance** (ID: BREVO_TEMPLATE_REMINDER_ID)
   - Variables : `{{beneficiaryName}}`, `{{invitationLink}}`

3. **Résultats au conseiller** (ID: BREVO_TEMPLATE_COMPLETED_COUNSELOR_ID)
   - Variables : `{{beneficiaryName}}`, `{{reportLink}}`, `{{overallScore}}`

4. **Confirmation au bénéficiaire** (ID: BREVO_TEMPLATE_COMPLETED_BENEFICIARY_ID)
   - Variables : `{{reportLink}}`

Renseigner les IDs dans `.env.local`.

### Webhooks (optionnel)

Pour tracker les bounces/plaintes :

```
POST https://yourdomain.com/api/webhooks/brevo
```

## Production

### Build

```bash
npm run build
npm start
```

### Déploiement recommandé

- **Plateforme** : Vercel, Netlify, Railway, Heroku
- **Base de données** : Supabase Cloud
- **Stockage** : Supabase Storage
- **E-mails** : Brevo

### Checklist pré-production

- [ ] Variables d'environnement sécurisées
- [ ] RLS testée (audit des accès)
- [ ] Tests e2e passants
- [ ] PDF testé avec accents français
- [ ] Brevo configuré et testé
- [ ] Backup base de données planifiée
- [ ] Monitoring/Sentry configuré
- [ ] Politique de conservation RGPD définie
- [ ] Termes de service et politique de confidentialité

## API Documentation

### Invitations

```bash
# Créer une invitation
POST /api/invitations
{
  "beneficiaryDisplayName": "Camille",
  "beneficiaryEmail": "camille@example.com",
  "internalReference": "DOSSIER-123",
  "questionnaireId": "uuid",
  "expiresAt": "2026-08-31T23:59:59+02:00",
  "language": "fr",
  "reportToBeneficiary": true
}

# Lister les invitations
GET /api/invitations?status=INVITATION_ENVOYEE&page=1&pageSize=20

# Détail d'une invitation
GET /api/invitations/{id}

# Relancer
POST /api/invitations/{id}/remind

# Annuler
POST /api/invitations/{id}/cancel

# Archiver
POST /api/invitations/{id}/archive
```

### Questionnaire (publique)

```bash
# Initialiser une session
POST /api/public/assessment/{token}/start

# Sauvegarder les réponses
PUT /api/public/assessment/{token}/answers
{
  "answers": [
    {"questionId": "SA1", "value": 4},
    {"questionId": "SA2", "value": 3}
  ]
}

# Soumettre et calculer résultats
POST /api/public/assessment/{token}/submit
```

### Résultats

```bash
# Récupérer les résultats
GET /api/results/{invitationId}

# Exporter JSON
GET /api/results/{invitationId}/export.json

# Exporter CSV
GET /api/results/{invitationId}/export.csv

# Télécharger rapport PDF
GET /api/reports/{reportId}/download
```

## Limitations V0.1

- ❌ Pas de webhooks Brevo pour tracking
- ❌ Export statistiques globales (roadmap)
- ❌ Intégration France Travail (hors scope)
- ❌ Application mobile native (web PWA possible)
- ❌ Multilingue (français seulement)
- ❌ Customisation complète du questionnaire (V0.2)

## Roadmap

### V0.2

- [ ] Interface d'édition de questionnaires
- [ ] Webhooks Brevo
- [ ] Analytics globales
- [ ] Export statistiques

### V0.3

- [ ] PWA installable
- [ ] Multilingue (EN, ES, IT)
- [ ] Intégration SI-EMPLOI (si spec fournie)
- [ ] Entretiens guidés post-questionnaire

## Support

- 📧 E-mail : support@caporientation.fr
- 🐛 Issues : GitHub issues
- 📖 Docs : `/docs` (à venir)

## License

Propriétaire - 2026

## Contribuer

1. Fork le repository
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Conventions

- **Commits** : Format conventionnel (feat:, fix:, docs:, etc.)
- **Code** : ESLint + Prettier
- **Types** : TypeScript strict
- **Tests** : Minimum 80% coverage critiques
- **Français** : Tous les labels/messages en français

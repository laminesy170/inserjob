# Architecture — CapOrientation 360

## Vue d'ensemble

CapOrientation 360 est une application Next.js full-stack sécurisée et scalable pour l'auto-positionnement professionnel.

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                   │
│    (React, Tailwind, Mobile-first, Accessible)      │
└──────────────────────┬────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
    ┌────▼──────────────┐      ┌─────▼──────────────┐
    │   Client Side     │      │  Server Actions   │
    │  - Questionnaire  │      │  - Validation     │
    │  - UI Rendering   │      │  - Business Logic │
    │  - Local State    │      │  - DB Queries     │
    └────┬──────────────┘      └──────┬─────────────┘
         │                             │
         └─────────────┬───────────────┘
                       │
         ┌─────────────▼──────────────┐
         │      Next.js API Routes    │
         │   (/api/...)               │
         │  - Auth & Sessions         │
         │  - Invitations             │
         │  - Assessment              │
         │  - Results & Reports       │
         │  - Admin                   │
         └──────────────┬──────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
    ┌────▼─────────────┐       ┌──────▼─────────────┐
    │   Supabase       │       │  External Services │
    │ - PostgreSQL     │       │  - Brevo (email)   │
    │ - Auth           │       │  - Sentry (errors) │
    │ - Storage (PDF)  │       │  - Vercel (deploy) │
    │ - RLS            │       └────────────────────┘
    └──────────────────┘
```

## Couches architecturales

### 1. Présentation (UI)

**Fichiers** : `app/`, `components/`

```typescript
// Composants React avec Tailwind
- Layout wrappers (Auth, Counsel, Public)
- Form components (Input, Button, Card)
- Domain components (QuestionnairePlayer, Dashboard)
- Pages (Next.js App Router)
```

**Responsabilités** :
- Afficher l'interface
- Capturer les entrées utilisateur
- Gérer l'état local (React state)
- Appeler les API

### 2. Logique applicative (Services)

**Fichiers** : `lib/`

```typescript
// Services métier découplés
- scoring/engine.ts     → Calcul des scores
- scoring/rules.ts      → Règles versionnées
- security/token.ts     → Génération/vérification tokens
- email/outbox.ts       → Gestion file d'e-mails
- utils.ts              → Helpers génériques
```

**Responsabilités** :
- Logique métier pure
- Pas de dépendance à Next.js/React
- 100% testable
- Versionnable

### 3. Validation des données

**Fichiers** : `lib/validation/schemas.ts`

```typescript
// Zod schemas
- loginSchema
- createInvitationSchema
- submitAnswersSchema
- Admin schemas
```

**Responsabilités** :
- Valider côté serveur uniquement
- Rejeter les données invalides
- Fournir des messages d'erreur
- Générer les types TypeScript

### 4. Routes API (Backend)

**Fichiers** : `app/api/`

```typescript
// Route handlers Next.js
POST /api/auth/login
GET|POST /api/invitations
POST /api/public/assessment/:token/start
PUT /api/public/assessment/:token/answers
POST /api/public/assessment/:token/submit
GET /api/results/:id
GET /api/reports/:id/download
```

**Responsabilités** :
- Authentification
- Validation des permissions
- Appels BD
- Gestion des erreurs
- Journalisation

### 5. Accès aux données

**Fichiers** : `lib/supabase.ts`

```typescript
// Supabase clients
- createClient() → client côté client
- createServiceRoleClient() → admin côté serveur
```

**Responsabilités** :
- Communiquer avec Supabase
- Respecter les permissions
- Utiliser RLS
- Gérer les erreurs BD

### 6. Base de données

**Fichiers** : `db/migrations/`

```sql
-- Schema :
organizations
profiles
questionnaires
invitations
assessment_sessions
answers
assessment_results
dimension_results
reports
counselor_notes
email_outbox
audit_logs
```

**Responsabilités** :
- Persister les données
- RLS (multi-tenancy)
- Intégrité référentielle
- Performance (indexes)

## Patterns et conventions

### 1. Scoring engine

**Découplé et testable** :

```typescript
import { ScoringEngine } from '@/lib/scoring/engine';

// Pur, sans I/O
const engine = new ScoringEngine(questionnaire, rules);
const result = engine.score(answers);
```

**Versionnement** :
- `questionnaire.version` : 1.0.0
- `scoring_version` : 1.0.0
- Immuable une fois persisté

### 2. Erreurs et validation

**Zod côté serveur** :

```typescript
const input = loginSchema.parse(req.body);
// Lève ZodError si invalide
// Types générés automatiquement

const safe = loginSchema.safeParse(data);
if (!safe.success) {
  return safe.error.issues;
}
```

**Pas de validation côté client seule** :
- Le serveur ne fait jamais confiance au client
- Chaque endpoint valide ses inputs

### 3. Authentification et autorisation

**Supabase Auth** :
- Sessions httpOnly cookies
- Tokens JWT côté Supabase

**RLS strict** :
- Chaque table a des politiques
- Les utilisateurs ne voient que leurs données
- Pas de contournement possible

```sql
-- Exemple :
SELECT * FROM invitations
WHERE organization_id = auth.uid().organization_id
```

### 4. Gestion des e-mails

**Outbox pattern** :
- Table `email_outbox` : file de travail
- Statut : PENDING → PROCESSING → SENT
- Retry avec backoff exponentiel
- Idempotency key pour éviter les doublons

```typescript
await emailOutbox.enqueue(job, idempotencyKey);
// Plus tard :
await emailOutbox.getPending();
await emailOutbox.markSent(id, providerId);
```

### 5. Tokens d'invitation

**Sécurisés** :
- Générés aléatoirement (crypto.getRandomValues)
- Hash SHA256 stocké uniquement
- Expiration en BD
- Single use ou contrôlé

```typescript
const { token, hash } = generateInvitationToken();
// Stocker hash
// Renvoyer token au bénéficiaire
// Vérifier avec verifyInvitationToken()
```

### 6. Gestion des erreurs

**Try-catch avec logging** :

```typescript
try {
  const result = await riskierOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error, context });
  return NextResponse.json(
    { message: 'Une erreur est survenue' },
    { status: 500 }
  );
}
```

**Pas de stack trace au client** :
- Messages génériques pour l'utilisateur
- Détails en logs serveur seulement

## Flux de données

### Invitation → Réponse → Résultat

```
1. Conseiller crée invitation
   POST /api/invitations
   → Validation (Zod)
   → Création en BD
   → Email dans outbox
   → Retour ID

2. Bénéficiaire ouvre lien
   GET /api/public/assessment/:token
   → Validation token et expiration
   → Création session
   → Retour métadonnées

3. Bénéficiaire répond
   PUT /api/public/assessment/:token/answers
   → Validation réponses (Zod)
   → Sauvegarde en BD
   → Sauvegarde progress

4. Bénéficiaire soumet
   POST /api/public/assessment/:token/submit
   → Validation toutes réponses présentes
   → Calcul scores (serveur)
   → Sauvegarde résultats
   → Génération PDF
   → Email conseiller
   → Retour synthèse

5. Conseiller consulte
   GET /api/results/:id
   → Vérification permission (RLS)
   → Retour résultats et rapports

6. Export
   GET /api/results/:id/export.json
   → Vérification permission
   → Retour JSON structuré
```

## Scalabilité

### Horizontal

- **Stateless** : aucun état applicatif en mémoire
- **Deploiement** : Vercel (scale auto)
- **Supabase** : gère l'échelle

### Vertical

- **Caching** : HTTP cache headers
- **Compression** : Gzip automatique
- **Pagination** : limiter les résultats
- **Indexes BD** : sur les colonnes critiques

## Sécurité

### Défense en profondeur

```
┌─────────────────────────────────┐
│  Browser Security               │ CSP, X-Frame-Options
├─────────────────────────────────┤
│  API Security                   │ CORS, Rate limit
├─────────────────────────────────┤
│  Input Validation               │ Zod
├─────────────────────────────────┤
│  Database Authorization         │ RLS, Policies
├─────────────────────────────────┤
│  Data Encryption                │ HTTPS, at-rest
└─────────────────────────────────┘
```

### Points clés

- **Auth** : Supabase (éprouvé)
- **Tokens** : Hash SHA256
- **RLS** : Immuable
- **Validation** : Zod + serveur
- **Secrets** : `.env.local` (gitignore)
- **Logs** : sans données sensibles

## Testabilité

### Unit tests

```typescript
// Logique pure, 100% testable
import { ScoringEngine } from '@/lib/scoring/engine';
const engine = new ScoringEngine(...);
const result = engine.score(answers);
expect(result.dimensions[0].normalizedScore).toBe(50);
```

### Integration tests

```typescript
// Avec vraie BD (test)
const response = await POST('/api/invitations', payload);
expect(response.status).toBe(201);
```

### E2E tests

```typescript
// Navigateur réel
test('complete flow', async ({ page }) => {
  await page.goto('/assessment/token');
  await page.fill('[name=answer-Q1]', '4');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/results');
});
```

## Performance

### Chargement initial

- **Static** : pages accueil (2KB gzip)
- **Dynamic** : questionnaire (50KB)
- **API** : réponses < 1s

### Runtime

- Scoring : < 100ms
- PDF : < 5s
- Email : asynchrone (outbox)

## Maintenance

### Logs

- API requests/responses
- Erreurs non gérées
- Actions sensibles (audit)

### Monitoring

- Erreurs (Sentry)
- Performance (Vercel Analytics)
- Disponibilité (UptimeRobot)

### Mises à jour

- Dépendances : monthly
- Security patches : asap
- Migrations BD : tested en staging

## Roadmap architecture

### V0.2

- [ ] Caching Redis
- [ ] Queue worker (Bull)
- [ ] WebSocket pour live stats

### V0.3

- [ ] Webhook system
- [ ] Custom questionnaires (drag-drop)
- [ ] Analytics engine

# Checklist de mise en production

Vérifier ces points avant de déployer en production.

## Code et tests

- [ ] `npm run type-check` : Pas d'erreurs TypeScript
- [ ] `npm run lint` : Pas de violations ESLint
- [ ] `npm run test` : Tous les tests unitaires passent
- [ ] `npm run test:integration` : Tests d'intégration verts
- [ ] `npm run test:e2e` : Tests e2e passants (mobile + desktop)
- [ ] `npm run build` : Build de production sans erreurs
- [ ] Zod validations sur tous les endpoints
- [ ] RLS testées et vérifiées

## Sécurité

- [ ] Aucune clé secrète en dur dans le code
- [ ] `.env.local` dans `.gitignore`
- [ ] Secrets stockés dans le service de secrets (Vercel, Railway, etc.)
- [ ] Passwords hachés (Supabase)
- [ ] Tokens hashés en BD
- [ ] HTTPS activé
- [ ] CORS bien configuré (seulement domaine autorisé)
- [ ] Rate limiting activé
- [ ] CSRF protection sur les formulaires
- [ ] Headers de sécurité présents :
  - [ ] Content-Security-Policy
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Pas de données sensibles dans les logs
- [ ] Pas de SQL injection possible (Zod + prepared statements)
- [ ] Pas de XSS possible (React escape)
- [ ] RLS non contournable (pas de vérification client-only)

## Données et base de données

- [ ] Base de données en production (Supabase Cloud)
- [ ] Migrations appliquées
- [ ] Politiques RLS activées
- [ ] Indexes créés pour les requêtes critiques
- [ ] Sauvegarde automatique activée
- [ ] PITR (Point In Time Recovery) configuré
- [ ] Seed data de production chargé
- [ ] Pas de test data en production
- [ ] Quotas appropriés (compute, storage)

## E-mails

- [ ] Brevo configuré
- [ ] Clé API Brevo stockée de manière sécurisée
- [ ] Templates Brevo créés (invitation, relance, confirmation)
- [ ] IDs templates dans l'env
- [ ] Emails de test envoyés avec succès
- [ ] Adresse expéditeur correcte
- [ ] Domain authenticé (SPF, DKIM, DMARC)
- [ ] Webhook Brevo configuré (optionnel mais recommandé)

## Rapports et stockage

- [ ] Supabase Storage configuré
- [ ] Bucket private-reports créé et privé
- [ ] Permissions RLS sur les rapports
- [ ] PDF généré correctement avec accents français
- [ ] URLs signées courte durée (900s)
- [ ] Rapport téléchargeable via API
- [ ] Stockage illimité ou quota adéquat

## Infrastructure

- [ ] Domaine configuré
- [ ] SSL/TLS certificat valide
- [ ] DNS pointant vers le serveur
- [ ] CDN configuré (optionnel)
- [ ] Auto-scaling configuré si pertinent
- [ ] Backup de la BD planifiée
- [ ] Monitoring configuré (Sentry, Vercel, etc.)
- [ ] Logs centralisés (optionnel)
- [ ] Alertes sur erreurs en production

## Supabase

- [ ] Projet en production
- [ ] RLS activée sur toutes les tables
- [ ] Politiques RLS testées
- [ ] Row security : Enforce RLS = ON
- [ ] Service Role secret sécurisé
- [ ] Anon key restictive (public read)
- [ ] Database extensions requises présentes
- [ ] Quotas appropriés
- [ ] Backups quotidiens
- [ ] PITR configuré

## Configuration

- [ ] Variable `NEXT_PUBLIC_APP_URL` = domaine production
- [ ] Variable `NODE_ENV` = production
- [ ] Tous les `.env` remplis
- [ ] Aucune variable manquante
- [ ] Logs activés au bon niveau (info)
- [ ] Sentry DSN configuré (optionnel)

## Performance

- [ ] Page initiale charge < 3 secondes
- [ ] First Contentful Paint < 2 secondes
- [ ] Time To Interactive < 5 secondes
- [ ] Largest Contentful Paint < 2.5 secondes
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images optimisées (lazy loading)
- [ ] CSS/JS minifiés
- [ ] Caching headers appropriés

## Accessibilité

- [ ] Navigation clavier fonctionnelle
- [ ] Focus visible
- [ ] Contraste WCAG AA minimum
- [ ] Liens avec text-decoration
- [ ] Labels sur les inputs
- [ ] ARIA labels où pertinent
- [ ] Zoom 200% testé
- [ ] Lecteur d'écran testé (au moins 1 page)

## Responsive

- [ ] 320px : fonctionnel
- [ ] 375px : fonctionnel (iPhone SE)
- [ ] 390px : fonctionnel (iPhone 14)
- [ ] 768px : fonctionnel (iPad)
- [ ] 1440px : fonctionnel (desktop)
- [ ] Pas de scroll horizontal
- [ ] Touch targets 48px minimum

## Navigateurs

- [ ] Chrome récent ✅
- [ ] Firefox récent ✅
- [ ] Safari récent ✅
- [ ] Edge récent ✅
- [ ] iOS Safari ✅
- [ ] Android Chrome ✅

## Documentation

- [ ] README complète
- [ ] Commandes documentées
- [ ] Variables d'environnement documentées
- [ ] Guide administrateur
- [ ] Guide conseiller
- [ ] Procédure de déploiement
- [ ] Procédure de rollback
- [ ] Procédure de sauvegarde
- [ ] Procédure RGPD (export/suppression)

## RGPD et légal

- [ ] Politique de confidentialité publiée
- [ ] Mentions légales complètes
- [ ] Responsable de traitement identifié
- [ ] DPO contactable
- [ ] Base légale documentée
- [ ] Durées de conservation configurées
- [ ] Droit d'accès implémenté
- [ ] Droit de rectification implémenté
- [ ] Droit d'effacement implémenté
- [ ] Droit de portabilité implémenté
- [ ] Pas de données sensibles collectées
- [ ] Consentement explicite avant questionnaire
- [ ] Aucune décision automatisée discriminante

## Monitoring et alertes

- [ ] Sentry ou équivalent configuré
- [ ] Alertes e-mail sur erreurs
- [ ] Uptimme monitoring activé
- [ ] Health check endpoint fonctionnel
- [ ] Logs centralisés (optionnel)
- [ ] Dashboard monitoring visible
- [ ] On-call configuré (si applicable)

## Processus de release

- [ ] Version taguée en git (`v1.0.0`)
- [ ] Changelog rempli
- [ ] Notes de release écrire
- [ ] Review code OK
- [ ] Staging testé 24h
- [ ] Approbation finale

## Post-déploiement

- [ ] Smoke tests réussis (admin, conseiller, bénéficiaire)
- [ ] E-mails reçus
- [ ] PDF générés correctement
- [ ] Rapports téléchargeables
- [ ] Logs sans erreur
- [ ] Performance acceptable
- [ ] Pas de 500 errors
- [ ] RLS non contournée
- [ ] Pas d'accès inter-org

## En cas de problème

Si un test échoue :

1. **Ne pas déployer** si critique (sécurité, RLS, données)
2. **Corriger et retest** localement
3. **Vérifier en staging** 24h
4. **Revalider la checklist**
5. **Déployer avec CI/CD**

## Escalade de production

### Sévérité Critique (Déployer immédiatement)

- Faille de sécurité exploitée
- RLS contournée
- Données corrompues
- Service indisponible

### Sévérité Haute (Déployer en priorité)

- Bug bloquant (ex: invitations non envoyées)
- Performance dégradée
- Rapports non générés

### Sévérité Normale (Déployer demain)

- Minor bugs
- Améliorations mineures
- Documentation

## Contacts d'urgence

- **Admin** : admin@caporientation.fr
- **Support** : support@caporientation.fr
- **Supabase** : Support plan payant
- **Brevo** : api-support@brevo.com

## Validé par

- [ ] Tech Lead
- [ ] Product Owner
- [ ] Security Officer
- [ ] DevOps/Infra

Date : _______________

Signatures : _______________

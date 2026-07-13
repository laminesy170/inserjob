# Guide Administrateur — CapOrientation 360

Ce guide décrit les tâches principales pour configurer et administrer CapOrientation 360.

## Accès administrateur

### 1. Première connexion

1. Aller à `https://votredomaine.com/auth/login`
2. Entrer les identifiants fournis à l'installation
3. Vous accédez au tableau de bord administrateur

### 2. Créer des conseillers

**Depuis le tableau de bord** :

1. Aller dans **Paramètres → Utilisateurs**
2. Cliquer **+ Ajouter un conseiller**
3. Remplir :
   - Prénom
   - Nom
   - E-mail
   - Mot de passe temporaire
4. Cliquer **Créer**

Le conseiller recevra un e-mail avec un lien pour se connecter.

### 3. Créer une organisation

**Pour gérer plusieurs entités** :

1. Aller dans **Paramètres → Organisations** (si vous êtes super-admin)
2. Cliquer **+ Nouvelle organisation**
3. Remplir :
   - Nom
   - Slug (ex: acme-insertion)
   - E-mail de contact
   - Responsable de traitement (pour RGPD)
   - Contact confidentialité
   - Base légale
   - Durée de conservation (jours)
   - Logo (optionnel)

### 4. Configurer les e-mails

#### Brevo

1. Aller dans **Paramètres → E-mails**
2. Entrer :
   - Clé API Brevo
   - E-mail expéditeur
   - ID template invitation
   - ID template relance
   - ID template confirmation conseiller
   - ID template confirmation bénéficiaire

#### Mode sandbox (développement)

Pour tester sans envoyer d'e-mails réels :

1. Dans `.env.local` :
   ```
   MAIL_SANDBOX=true
   MAIL_SANDBOX_RECIPIENT=votreadmin@exemple.com
   ```

2. Tous les e-mails sont envoyés à cette adresse

### 5. Configurer les paramètres RGPD

1. Aller dans **Paramètres → Conformité RGPD**
2. Configurer par organisation :
   - **Durée de conservation invitation** : 90 jours (par défaut)
   - **Durée de conservation passation** : 730 jours (2 ans)
   - **Durée de conservation logs** : 365 jours (1 an)
   - **Politique d'anonymisation** : oui/non
3. Cliquer **Enregistrer**

### 6. Gérer les questionnaires

#### Créer un nouveau questionnaire

1. Aller dans **Questionnaires → + Nouveau**
2. Remplir :
   - Titre
   - Description
   - Langue
   - Version (format X.Y.Z)
3. Cliquer **Créer (brouillon)**

#### Éditer un questionnaire

**Dans le brouillon** :

1. Cliquer **Éditer**
2. Modifier :
   - Dimensions
   - Questions
   - Poids
   - Labels d'échelle
3. Cliquer **Enregistrer**

#### Publier une version

**Immuable une fois publiée** :

1. Cliquer **Publier**
2. Confirmer la version
3. Une fois publiée, elle ne peut plus être modifiée
4. Les nouvelles invitations l'utiliseront automatiquement

**Important** : Tester le brouillon avant publication.

### 7. Monitoring et audit

#### Tableau de bord statistiques

Aller dans **Tableau de bord** :

- Nombre d'invitations
- Taux de réponse
- Temps moyen de réponse
- Scores moyens par dimension
- Activité récente

#### Journaux d'audit

Aller dans **Logs → Audit** :

- Qui a créé une invitation
- Qui a consulté des résultats
- Qui a téléchargé un rapport
- Quand
- Depuis quel IP

#### Gestion des e-mails

Aller dans **Logs → E-mails** :

- État d'envoi
- Nombre de tentatives
- Dernière erreur
- Vous pouvez forcer un renvoi

### 8. Suppression et anonymisation

#### Suppression RGPD

Aller dans **RGPD → Droit à l'oubli** :

1. Entrer l'e-mail de la personne
2. Choisir :
   - **Suppression complète** : données effacées
   - **Anonymisation** : données conservées mais identifiant retiré
3. Cliquer **Traiter la demande**

#### Export RGPD

Pour exercer le droit d'accès :

1. Aller dans **RGPD → Portabilité**
2. Entrer l'e-mail
3. Cliquer **Générer un export**
4. Un ZIP est créé avec toutes les données

### 9. Sauvegardes et récupération

#### Sauvegarde de la base de données

**Avec Supabase** :

1. Aller sur https://app.supabase.com
2. Sélectionner le projet CapOrientation
3. Aller dans **Settings → Database Backups**
4. Cliquer **Create Backup**
5. Les sauvegardes quotidiennes sont automatiques

#### Restauration

1. Aller dans **Database Backups**
2. Sélectionner une date
3. Cliquer **Restore**

⚠️ **Attention** : La restauration arrête le service pendant 5-15 minutes.

### 10. Dépannage courant

#### Les e-mails ne s'envoient pas

1. Vérifier la clé API Brevo dans les paramètres
2. Vérifier les logs d'e-mail
3. Vérifier les templates Brevo (les IDs doivent correspondre)
4. Tester : créer une invitation avec mode sandbox

#### Les résultats ne s'affichent pas

1. Vérifier que le questionnaire est **PUBLISHED** (pas DRAFT)
2. Vérifier les logs des sessions
3. Vérifier que toutes les réponses sont présentes

#### Le PDF ne se génère pas

1. Vérifier les logs API
2. Vérifier que le bucket Supabase Storage existe et est configuré
3. Tester la génération PDF directement (endpoint /api/reports)

#### Problèmes de performance

1. Vérifier l'indexation : `SELECT * FROM pg_stat_user_indexes`
2. Vérifier les queries lentes : Supabase Analytics
3. Augmenter les compute add-ons si trop de requêtes

## Sécurité

### Points critiques

- ✅ Toujours garder les secrets hors du code
- ✅ Utiliser HTTPS en production
- ✅ Garder Supabase à jour
- ✅ Vérifier les logs d'accès régulièrement
- ✅ Limiter les accès administrateur
- ✅ Changer régulièrement les mots de passe
- ✅ Activer 2FA si possible

### Politique d'accès

**Administrateur** :
- Toutes les données de l'organisation
- Gestion des utilisateurs
- Configuration
- Audit

**Conseiller** :
- Ses propres invitations et résultats
- Selon configuration : toutes les invitations de l'org
- Peut ajouter des notes

**Bénéficiaire** :
- N'a pas de compte
- Accès via lien sécurisé
- Voit seulement sa passation et son résultat

## Maintenance

### Mises à jour

Avant de mettre à jour :

1. Faire une sauvegarde
2. Tester sur un environnement de staging
3. Vérifier les notes de release
4. Planifier hors heures de pointe

### Monitoring

Mettre en place :

- Email d'alerte sur erreurs (Sentry)
- Monitoring de disponibilité (UptimeRobot)
- Monitoring des performances (Vercel Analytics)
- Alertes sur RLS violations (PostgreSQL logs)

### Logs

Les logs sont conservés selon la politique RGPD :

- Erreurs API : 12 mois
- Audit : 12 mois
- E-mails : 3 mois (pas les contenus)
- Sessions : non conservées

## Bonnes pratiques

1. **Mots de passe** : Générer des mots de passe forts pour chaque conseiller
2. **Organisations** : Une organisation par entité
3. **Questionnaires** : Versionner régulièrement
4. **E-mails** : Tester les templates dans Brevo
5. **Backup** : Au minimum hebdomadaire
6. **Monitoring** : Vérifier les logs chaque semaine
7. **RGPD** : Traiter les demandes sous 30 jours
8. **Sécurité** : Audit annuel des accès

## Support

Pour les problèmes :

- 📧 support@caporientation.fr
- 🐛 Consulter les logs
- 📖 Lire la documentation
- 🔧 Contacter Supabase pour les problèmes BD

## Roadmap admin

### V0.2

- [ ] Dashboard analytics avancées
- [ ] Export statistiques globales
- [ ] Webhooks Brevo
- [ ] Alerts d'erreur

### V0.3

- [ ] White-label
- [ ] Custom questionnaires
- [ ] Rapports périodiques
- [ ] Intégrations externes (SI-EMPLOI, etc.)

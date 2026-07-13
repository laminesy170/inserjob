import type { QuestionnaireSchema } from '@/db/types';

export const questionnaireSchema: QuestionnaireSchema = {
  schemaVersion: '1.0.0',
  questionnaire: {
    id: 'caporientation-360',
    version: '1.0.0',
    status: 'published',
    title: 'CapOrientation 360',
    description:
      'Auto-positionnement sur les compétences utiles pour piloter son parcours professionnel.',
    language: 'fr',
    estimatedDurationMinutes: 10,
    scale: {
      min: 1,
      max: 5,
      labels: {
        '1': 'Pas du tout vrai pour moi',
        '2': 'Plutôt faux',
        '3': 'Partiellement vrai',
        '4': 'Plutôt vrai',
        '5': 'Tout à fait vrai',
      },
    },
    dimensions: [
      {
        id: 'self_awareness',
        label: 'Connaissance de soi',
        weight: 1,
        description:
          'Capacité à identifier ses compétences, motivations, valeurs, contraintes et préférences.',
        questions: [
          {
            id: 'SA1',
            text: 'Je sais expliquer clairement les compétences que j\'ai développées au cours de mes expériences.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'SA2',
            text: 'Je peux citer les conditions de travail qui me permettent d\'être efficace et motivé.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'SA3',
            text: 'J\'ai du mal à identifier ce qui compte réellement pour moi dans un emploi.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'SA4',
            text: 'Je connais les principales contraintes personnelles ou professionnelles à prendre en compte dans mon projet.',
            reverse: false,
            weight: 1,
          },
        ],
      },
      {
        id: 'transferable_skills',
        label: 'Compétences transférables',
        weight: 1,
        description: 'Capacité à relier son expérience à d\'autres métiers ou secteurs.',
        questions: [
          {
            id: 'TS1',
            text: 'Je sais repérer les compétences que je pourrais utiliser dans un autre métier.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'TS2',
            text: 'Je peux transformer une expérience concrète en compétence compréhensible par un recruteur.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'TS3',
            text: 'Je pense que mes compétences ne sont utiles que dans mon ancien métier.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'TS4',
            text: 'Je sais donner des exemples précis prouvant mes compétences.',
            reverse: false,
            weight: 1,
          },
        ],
      },
      {
        id: 'career_exploration',
        label: 'Exploration des métiers',
        weight: 1,
        description: 'Capacité à rechercher, comparer et tester plusieurs pistes.',
        questions: [
          {
            id: 'CE1',
            text: 'Avant de choisir une piste, je compare plusieurs métiers possibles.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'CE2',
            text: 'J\'ai testé ou observé au moins deux métiers différents pour mon projet.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'CE3',
            text: 'Je me sens bloqué pour explorer de nouveaux domaines.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'CE4',
            text: 'J\'ai identifié au moins trois pistes professionnelles possibles.',
            reverse: false,
            weight: 1,
          },
        ],
      },
      {
        id: 'job_market_understanding',
        label: 'Compréhension du marché du travail',
        weight: 1,
        description: 'Capacité à comprendre la demande du marché et les tendances.',
        questions: [
          {
            id: 'JMU1',
            text: 'J\'ai analysé les offres d\'emploi pour connaître les compétences demandées.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'JMU2',
            text: 'Je connais les débouchés géographiques et les tendances de recrutement dans mon domaine.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'JMU3',
            text: 'Je méconnais les exigences réelles du marché dans mon secteur.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'JMU4',
            text: 'Je consulte régulièrement les rapports et statistiques d\'emploi.',
            reverse: false,
            weight: 1,
          },
        ],
      },
      {
        id: 'digital_and_ai',
        label: 'Numérique et intelligence artificielle',
        weight: 1,
        description:
          'Maîtrise numérique et usage raisonné de l\'intelligence artificielle.',
        questions: [
          {
            id: 'DAI1',
            text: 'Je sais utiliser les outils numériques essentiels pour ma recherche d\'emploi.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'DAI2',
            text: 'Je comprends comment fonctionent les outils d\'intelligence artificielle et comment les utiliser à bon escient.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'DAI3',
            text: 'Je suis conscient des risques de sécurité et de confidentialité dans mon usage numérique.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'DAI4',
            text: 'Les technologies numériques me mettent mal à l\'aise.',
            reverse: true,
            weight: 1,
          },
        ],
      },
      {
        id: 'project_presentation',
        label: 'Présentation du parcours et du projet',
        weight: 1,
        description: 'Capacité à articuler son parcours et son projet de manière claire.',
        questions: [
          {
            id: 'PP1',
            text: 'Je sais expliquer mon parcours professionnel et ma transition de manière cohérente.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'PP2',
            text: 'Je peux communiquer mon projet professionnel clairement, même si je suis encore en réflexion.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'PP3',
            text: 'Mon projet me semble flou ou difficile à expliquer.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'PP4',
            text: 'J\'ai identifié au moins trois messages clés que je veux communiquer à un employeur potentiel.',
            reverse: false,
            weight: 1,
          },
        ],
      },
      {
        id: 'job_search_strategy',
        label: 'Stratégie de recherche d\'emploi',
        weight: 1,
        description: 'Capacité à planifier et piloter sa recherche d\'emploi.',
        questions: [
          {
            id: 'JSS1',
            text: 'J\'ai défini un plan d\'action clair pour ma recherche d\'emploi.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'JSS2',
            text: 'Je suis régulièrement mes démarches et j\'ajuste ma stratégie selon les résultats.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'JSS3',
            text: 'Ma recherche d\'emploi me paraît désorganisée ou peu efficace.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'JSS4',
            text: 'J\'utilise plusieurs canaux de recherche (offres en ligne, réseau, candidatures spontanées, etc.).',
            reverse: false,
            weight: 1,
          },
        ],
      },
      {
        id: 'network_and_visibility',
        label: 'Réseau et visibilité professionnelle',
        weight: 1,
        description: 'Capacité à développer son réseau et sa visibilité professionnelle.',
        questions: [
          {
            id: 'NV1',
            text: 'Je cultive activement mon réseau professionnel.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'NV2',
            text: 'Ma présence professionnelle en ligne (LinkedIn, etc.) est à jour et attractive.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'NV3',
            text: 'Je ne sais pas comment développer mon réseau.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'NV4',
            text: 'J\'ai participé à des événements réseaux ou des groupes professionnels.',
            reverse: false,
            weight: 1,
          },
        ],
      },
      {
        id: 'learning_and_development',
        label: 'Formation et développement des compétences',
        weight: 1,
        description: 'Capacité à identifier ses besoins de formation et à apprendre.',
        questions: [
          {
            id: 'LD1',
            text: 'J\'ai identifié les compétences que je dois développer pour mon projet.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'LD2',
            text: 'J\'investis dans ma formation (cours, mentorat, auto-apprentissage, etc.).',
            reverse: false,
            weight: 1,
          },
          {
            id: 'LD3',
            text: 'Je ne sais pas par où commencer pour me développer.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'LD4',
            text: 'Je suis capable d\'apprendre rapidement de nouvelles compétences.',
            reverse: false,
            weight: 1,
          },
        ],
      },
      {
        id: 'action_and_adaptation',
        label: 'Passage à l\'action et capacité d\'adaptation',
        weight: 1,
        description: 'Capacité à passer à l\'action et à adapter son approche.',
        questions: [
          {
            id: 'AA1',
            text: 'Je suis capable de définir des actions concrètes et de les suivre.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'AA2',
            text: 'Lorsque mon approche ne fonctionne pas, j\'adapte rapidement ma stratégie.',
            reverse: false,
            weight: 1,
          },
          {
            id: 'AA3',
            text: 'Je suis souvent paralysé par le doute et j\'ai du mal à passer à l\'action.',
            reverse: true,
            weight: 1,
          },
          {
            id: 'AA4',
            text: 'J\'apprends de mes erreurs et je les utilise pour m\'améliorer.',
            reverse: false,
            weight: 1,
          },
        ],
      },
    ],
  },
};

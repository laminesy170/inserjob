export const scoringRulesV1 = {
  version: '1.0.0',
  thresholds: {
    TO_STRENGTHEN: { min: 0, max: 39 },
    IN_DEVELOPMENT: { min: 40, max: 59 },
    OPERATIONAL: { min: 60, max: 79 },
    AUTONOMOUS: { min: 80, max: 100 },
  },
  interpretations: {
    self_awareness: {
      TO_STRENGTHEN: {
        summary:
          "Vous êtes en phase d'exploration de vos compétences et motivations. C'est une étape normale et importante pour construire un projet solide.",
        strengths: ['Capacité à réfléchir sur vos expériences'],
        developmentAreas: [
          'Formaliser vos compétences',
          'Identifier vos priorités',
          'Clarifier vos contraintes',
        ],
        recommendedActions: [
          'Réaliser un inventaire de compétences détaillé',
          'Identifier trois conditions de travail souhaitées',
          'Lister vos contraintes personnelles ou professionnelles',
          'Demander un retour à d\'anciens collègues ou mentors',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous avez une bonne compréhension de vos compétences. Approfondissez cette connaissance pour affiner votre projet professionnel.',
        strengths: [
          'Conscience de vos forces',
          'Clarté sur certaines préférences',
        ],
        developmentAreas: [
          'Approfondir la connaissance de soi',
          'Formuler vos motivations avec précision',
        ],
        recommendedActions: [
          'Documenter vos succès et les compétences associées',
          'Formaliser vos valeurs professionnelles',
          'Analyser les moments de satisfaction au travail',
        ],
      },
      OPERATIONAL: {
        summary:
          'Vous avez une connaissance solide de vos compétences et motivations. Continuez à explorer pour affiner votre positionnement.',
        strengths: [
          'Conscience claire de vos forces',
          'Compréhension de vos préférences',
        ],
        developmentAreas: [
          'Adapter votre positionnement à de nouveaux contextes',
        ],
        recommendedActions: [
          'Revisiter régulièrement votre profil de compétences',
          'Rechercher de nouvelles expériences pour affiner votre projet',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous avez une très bonne connaissance de vous-même. Utilisez cette clarté pour piloter activement vos choix professionnels.',
        strengths: [
          'Connaissance très complète de vos forces',
          'Clarté de vos motivations et valeurs',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Mettre à profit cette clarté pour vos démarches professionnelles',
          'Servir de conseil à d\'autres dans leur réflexion',
        ],
      },
    },
    transferable_skills: {
      TO_STRENGTHEN: {
        summary:
          'Vous doutez de la valeur de vos compétences dans d\'autres contextes. Explorez comment vos forces peuvent se transférer.',
        strengths: ['Conscience de vos expériences'],
        developmentAreas: [
          'Reconnaître vos compétences transférables',
          'Formuler vos atouts pour de nouveaux publics',
        ],
        recommendedActions: [
          'Cartographier vos compétences par domaine',
          'Identifier trois secteurs ou métiers où ces compétences s\'appliquent',
          'Préparer des exemples concrets de transfert',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous commencez à identifier vos compétences transférables. Renforcez cette capacité en explorant de nouveaux contextes.',
        strengths: [
          'Début de reconnaissance des compétences',
          'Capacité à faire le lien',
        ],
        developmentAreas: [
          'Approfondir la réflexion sur le transfert',
          'Formuler avec précision pour les recruteurs',
        ],
        recommendedActions: [
          'Analyser des offres d\'emploi pour repérer les compétences demandées',
          'Préparer des argumentaires de transfert pour trois métiers',
          'Faire valider votre positionnement par des experts métier',
        ],
      },
      OPERATIONAL: {
        summary:
          'Vous savez comment valoriser vos compétences auprès de nouveaux employeurs. Renforcez vos exemples et votre communication.',
        strengths: [
          'Bonne capacité de transfert',
          'Clarté de votre positionnement',
        ],
        developmentAreas: [
          'Affiner votre discours pour différents contextes',
        ],
        recommendedActions: [
          'Développer des exemples STAR (Situation, Tâche, Action, Résultat)',
          'Préparer différentes versions de votre positionnement',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous maîtrisez parfaitement vos compétences transférables et savez les valoriser. Utilisez cet atout pour explorer largement.',
        strengths: [
          'Excellence en transfert de compétences',
          'Capacité à inspirer par votre positionnement',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Explorer de nouveaux marchés ou métiers sans crainte',
          'Mentorer d\'autres personnes en transition',
        ],
      },
    },
    career_exploration: {
      TO_STRENGTHEN: {
        summary:
          'Vous êtes en phase de découverte. Il est temps d\'explorer activement plusieurs pistes professionnelles.',
        strengths: ['Ouverture à l\'exploration'],
        developmentAreas: [
          'Structurer votre recherche',
          'Tester plusieurs pistes',
        ],
        recommendedActions: [
          'Identifier dix métiers ou domaines à explorer',
          'Mener quatre à six enquêtes métier',
          'Consulter la base de données ROME (Répertoire Opérationnel des Métiers et Emplois)',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous explorez plusieurs pistes, ce qui est positif. Approchez votre projet progressivement par des tests concrets.',
        strengths: [
          'Curiosité professionnelle',
          'Exploration progressive',
        ],
        developmentAreas: [
          'Valider vos pistes par l\'expérience',
          'Affiner votre choix',
        ],
        recommendedActions: [
          'Mener une enquête approfondie sur vos trois pistes principales',
          'Chercher des périodes d\'observation ou mini-stages',
          'Analyser les points communs entre vos pistes',
        ],
      },
      OPERATIONAL: {
        summary:
          'Vous avez une bonne connaissance de plusieurs pistes. Consolidez vos choix et préparez votre plan d\'action.',
        strengths: [
          'Capacité d\'exploration',
          'Connaissance de plusieurs pistes',
        ],
        developmentAreas: [
          'Finaliser votre choix',
          'Préparer votre transition',
        ],
        recommendedActions: [
          'Valider votre projet via une expérience pratique',
          'Définir les étapes de transition',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous avez une très bonne connaissance du marché et de vos options. Avancez avec confiance vers votre projet.',
        strengths: [
          'Excellente connaissance du marché',
          'Clarté de projet',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Mettre en place votre plan d\'action',
          'Documenter votre apprentissage pour future référence',
        ],
      },
    },
    job_market_understanding: {
      TO_STRENGTHEN: {
        summary:
          'Vous manquez de connaissance du marché du travail actuel. Investissez dans une analyse des offres et des tendances.',
        strengths: ['Volonté d\'apprendre'],
        developmentAreas: [
          'Connaître la demande du marché',
          'Identifier les tendances',
          'Comprendre les débouchés',
        ],
        recommendedActions: [
          'Analyser au moins vingt offres d\'emploi dans votre domaine',
          'Identifier cinq à dix compétences clés demandées',
          'Consulter les rapports de France Travail sur votre secteur',
          'Vérifier les débouchés géographiques et les salaires',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous commencez à connaître le marché. Approfondissez votre analyse pour affiner votre stratégie de recherche.',
        strengths: [
          'Capacité d\'analyse des offres',
          'Début de compréhension des tendances',
        ],
        developmentAreas: [
          'Élargir votre analyse',
          'Suivre les évolutions',
        ],
        recommendedActions: [
          'Analyser les offres dans plusieurs régions',
          'Identifier les compétences en hausse et en baisse',
          'Suivre les réseaux professionnels de votre secteur',
        ],
      },
      OPERATIONAL: {
        summary:
          'Vous comprenez bien le marché et ses exigences. Utilisez cette connaissance pour affiner votre approche.',
        strengths: [
          'Bonne connaissance du marché',
          'Compréhension des tendances',
        ],
        developmentAreas: [
          'Anticiper les évolutions',
          'Adapter votre profil',
        ],
        recommendedActions: [
          'Surveiller régulièrement les offres',
          'Adapter votre profil aux évolutions du marché',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous avez une excellente connaissance du marché et des opportunités. Utilisez cet atout pour vos décisions.',
        strengths: [
          'Connaissance fine du marché',
          'Compréhension des tendances long terme',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Vous pouvez vous projeter avec confiance',
          'Partager vos insights avec d\'autres',
        ],
      },
    },
    digital_and_ai: {
      TO_STRENGTHEN: {
        summary:
          'Vous souhaitez développer vos compétences numériques et votre compréhension de l\'IA. C\'est une priorité pour rester compétitif.',
        strengths: ['Conscience de l\'importance du numérique'],
        developmentAreas: [
          'Maîtriser les outils de recherche et de communication',
          'Comprendre l\'IA et ses usages',
          'Sécuriser votre usage numérique',
        ],
        recommendedActions: [
          'Apprendre à utiliser les opérateurs de recherche avancée',
          'Prendre un cours introduisant l\'IA et ses applications',
          'Comprendre les risques de confidentialité et anonymité',
          'Adapter un CV avec relecture humaine en utilisant une IA',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous avez une bonne base en numérique et commencez à explorer l\'IA. Renforcez vos compétences.',
        strengths: [
          'Compétences numériques de base',
          'Curiosité pour l\'IA',
        ],
        developmentAreas: [
          'Approfondir vos compétences',
          'Appliquer l\'IA à votre contexte',
        ],
        recommendedActions: [
          'Suivre une formation spécifique à votre domaine',
          'Expérimenter des outils IA pertinents pour vous',
          'Rejoindre des communautés professionnelles numériques',
        ],
      },
      OPERATIONAL: {
        summary:
          'Vous maîtrisez bien le numérique et l\'IA dans un contexte professionnel. Continuez à vous mettre à jour.',
        strengths: [
          'Bonne maîtrise numérique',
          'Compréhension pratique de l\'IA',
        ],
        developmentAreas: [
          'Rester à jour avec les évolutions',
        ],
        recommendedActions: [
          'Suivre les évolutions technologiques pertinentes',
          'Partager vos compétences avec d\'autres',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous maîtrisez excellemment le numérique et l\'IA. Utilisez cet atout comme différenciant dans votre recherche.',
        strengths: [
          'Excellence en numérique et IA',
          'Capacité d\'adaptation technologique',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Positionner cet atout dans vos démarches',
          'Former ou mentorer d\'autres',
        ],
      },
    },
    project_presentation: {
      TO_STRENGTHEN: {
        summary:
          'Vous êtes en train de clarifier votre projet. C\'est l\'occasion de bien le formaliser pour pouvoir le communiquer.',
        strengths: ['Réflexion en cours'],
        developmentAreas: [
          'Formaliser votre projet',
          'Clarifier votre parcours',
          'Préparer votre pitch',
        ],
        recommendedActions: [
          'Écrire une page résumant votre projet en trois points',
          'Préparer une explication courte de votre transition',
          'Identifier trois messages clés pour un employeur',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Votre projet commence à prendre forme. Travaillez à le clarifier davantage et à le communiquer avec confiance.',
        strengths: [
          'Projet identifié',
          'Capacité de communication',
        ],
        developmentAreas: [
          'Affiner la clarté du projet',
          'Renforcer la cohérence du parcours',
        ],
        recommendedActions: [
          'Faire valider votre projet par un conseiller',
          'Préparer des réponses aux questions "Pourquoi" et "Comment"',
        ],
      },
      OPERATIONAL: {
        summary:
          'Vous présentez bien votre projet et votre parcours. Renforcez la confiance qu\'inspirent votre clarté et cohérence.',
        strengths: [
          'Projet clair',
          'Parcours compréhensible',
          'Communication efficace',
        ],
        developmentAreas: [
          'Adapter votre présentation à différents publics',
        ],
        recommendedActions: [
          'Préparer plusieurs versions de votre présentation',
          'Vous entraîner devant des pairs ou mentors',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous inspirez la clarté et la confiance par votre présentation de projet et de parcours. Exploitez cet atout.',
        strengths: [
          'Excellente clarté du projet',
          'Communication très efficace',
          'Parcours impressionnant',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Utiliser cette force dans vos démarches',
          'Servir de modèle ou mentor',
        ],
      },
    },
    job_search_strategy: {
      TO_STRENGTHEN: {
        summary:
          'Vous êtes en phase de préparation de votre recherche. Structurez votre approche pour être plus efficace.',
        strengths: ['Volonté de bien préparer'],
        developmentAreas: [
          'Définir une stratégie claire',
          'Mettre en place des actions',
          'Mesurer votre progression',
        ],
        recommendedActions: [
          'Définir trois à cinq actions concrètes et datées',
          'Mettre en place un suivi hebdomadaire',
          'Identifier les obstacles et les solutions',
          'Créer un tableau de suivi de vos démarches',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous avez commencé votre recherche. Structurez-la davantage pour augmenter votre efficacité.',
        strengths: [
          'Actions engagées',
          'Dynamique positive',
        ],
        developmentAreas: [
          'Augmenter le nombre de démarches',
          'Mesurer et adapter',
        ],
        recommendedActions: [
          'Analyser les résultats de vos démarches',
          'Ajuster votre approche si nécessaire',
          'Augmenter le nombre de contacts',
        ],
      },
      OPERATIONAL: {
        summary:
          'Votre stratégie de recherche est efficace et bien structurée. Maintenez votre rythme et restez flexible.',
        strengths: [
          'Stratégie claire',
          'Approche structurée',
          'Résultats visibles',
        ],
        developmentAreas: [
          'Diversifier vos approches',
        ],
        recommendedActions: [
          'Tester de nouveaux canaux ou approches',
          'Rester discipliné dans votre suivi',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous pilotez votre recherche avec efficacité et adaptabilité. Continuez ainsi et partagez vos bonnes pratiques.',
        strengths: [
          'Excellence en stratégie',
          'Approche proactive et flexible',
          'Résultats concrets',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Continuer votre stratégie avec confiance',
          'Partager votre approche avec d\'autres',
        ],
      },
    },
    network_and_visibility: {
      TO_STRENGTHEN: {
        summary:
          'Vous développez votre réseau et votre visibilité professionnelle. C\'est un atout clé en recherche d\'emploi.',
        strengths: ['Conscience de l\'importance du réseau'],
        developmentAreas: [
          'Développer votre réseau',
          'Augmenter votre visibilité',
          'Utiliser LinkedIn efficacement',
        ],
        recommendedActions: [
          'Mettre à jour votre profil LinkedIn avec un bon titre',
          'Vous connecter avec dix personnes de votre réseau',
          'Participer à un événement networking ou un groupe professionnel',
          'Rédiger un article court sur votre domaine d\'expertise',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous avez commencé à développer votre visibilité. Renforcez votre présence professionnelle.',
        strengths: [
          'Présence en ligne',
          'Connexions établies',
        ],
        developmentAreas: [
          'Amplifier votre visibilité',
          'Approfondir vos connexions',
        ],
        recommendedActions: [
          'Engager plus sur LinkedIn (commentaires, partages)',
          'Élargir votre réseau professionnel',
          'Participer à des discussions ou forums du secteur',
        ],
      },
      OPERATIONAL: {
        summary:
          'Votre réseau est bien développé et votre visibilité est bonne. Entretenez-les régulièrement.',
        strengths: [
          'Réseau solide',
          'Visibilité professionnelle',
          'Présence en ligne efficace',
        ],
        developmentAreas: [
          'Diversifier vos interactions',
        ],
        recommendedActions: [
          'Entretenir régulièrement vos contacts',
          'Offrir de la valeur à votre réseau',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous avez un excellent réseau et une forte présence professionnelle. Continuez à les cultiver.',
        strengths: [
          'Réseau très développé',
          'Forte visibilité professionnelle',
          'Influence positive',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Utiliser votre réseau pour vos objectifs',
          'Aider d\'autres dans leur développement',
        ],
      },
    },
    learning_and_development: {
      TO_STRENGTHEN: {
        summary:
          'Vous commencez à réfléchir à votre développement professionnel. Il est temps de l\'accélérer.',
        strengths: ['Conscience du besoin de formation'],
        developmentAreas: [
          'Identifier vos besoins de formation',
          'Mettre en place des actions d\'apprentissage',
          'Capitaliser sur votre apprentissage',
        ],
        recommendedActions: [
          'Identifier trois compétences clés à développer',
          'Chercher une formation, un mentorat ou une auto-formation',
          'Mettre en place un plan d\'apprentissage sur 6 mois',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous investissez dans votre développement professionnel. Structurez cet apprentissage.',
        strengths: [
          'Volonté d\'apprendre',
          'Actions en cours',
        ],
        developmentAreas: [
          'Mesurer votre progression',
          'Diversifier les approches',
        ],
        recommendedActions: [
          'Suivre régulièrement votre progression',
          'Combiner formations, mentorat et pratique',
          'Valoriser vos apprentissages',
        ],
      },
      OPERATIONAL: {
        summary:
          'Vous investissez régulièrement dans votre développement. Continuez à diversifier votre apprentissage.',
        strengths: [
          'Approche continue',
          'Compétences en développement',
          'Adaptabilité',
        ],
        developmentAreas: [
          'Rester à jour constamment',
        ],
        recommendedActions: [
          'Mettre à jour vos compétences avec les tendances',
          'Partager vos apprentissages',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous êtes un apprenant continu qui se développe régulièrement. Cet atout vous rend très compétitif.',
        strengths: [
          'Excellente dynamique d\'apprentissage',
          'Adaptabilité remarquable',
          'Expertise développée',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Continuer votre trajectoire d\'apprentissage',
          'Mentorer d\'autres apprenants',
        ],
      },
    },
    action_and_adaptation: {
      TO_STRENGTHEN: {
        summary:
          'Vous réfléchissez à l\'action. C\'est le moment de passer des intentions à la réalité concrète.',
        strengths: ['Réflexion en cours'],
        developmentAreas: [
          'Passer à l\'action',
          'Surmonter les obstacles',
          'Apprendre des expériences',
        ],
        recommendedActions: [
          'Définir trois actions concrètes et datées pour cette semaine',
          'Identifier ce qui vous freine et trouver des solutions',
          'Mettre en place un système de suivi simple',
          'Analyser chaque semaine vos avancées et vos freins',
        ],
      },
      IN_DEVELOPMENT: {
        summary:
          'Vous avez commencé à agir. Amplifiez vos actions et apprenez de vos expériences.',
        strengths: [
          'Actions engagées',
          'Première expérience',
        ],
        developmentAreas: [
          'Accélérer le rythme',
          'Capitaliser sur l\'expérience',
        ],
        recommendedActions: [
          'Augmenter le nombre et la diversité de vos actions',
          'Documenter votre apprentissage',
          'Adapter vos approches selon les résultats',
        ],
      },
      OPERATIONAL: {
        summary:
          'Vous agissez régulièrement et vous apprenez de vos expériences. Maintenez ce dynamisme.',
        strengths: [
          'Dynamisme d\'action',
          'Capacité d\'apprentissage',
          'Adaptabilité',
        ],
        developmentAreas: [
          'Anticiper les obstacles',
        ],
        recommendedActions: [
          'Continuer votre rythme d\'action',
          'Vous préparer aux obstacles potentiels',
        ],
      },
      AUTONOMOUS: {
        summary:
          'Vous avez une excellente capacité d\'action et d\'adaptation. Utilisez cette force pour atteindre vos objectifs.',
        strengths: [
          'Excellence en action',
          'Apprentissage rapide',
          'Grande adaptabilité',
        ],
        developmentAreas: [],
        recommendedActions: [
          'Continuer avec confiance votre trajectoire',
          'Vous poser des défis plus ambitieux',
        ],
      },
    },
  },
};

export type ScoringRules = typeof scoringRulesV1;

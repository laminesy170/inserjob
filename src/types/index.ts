export type Role = 'candidat' | 'entreprise' | 'gestionnaire'

export type TypeContrat = 'CDI' | 'CDD' | 'Intérim' | 'Stage' | 'Alternance' | 'Bénévolat'

export type StatutOffre = 'brouillon' | 'en_attente' | 'publiee' | 'cloturee'

export type StatutCandidature = 'envoyee' | 'vue' | 'preselectionee' | 'transmise' | 'refusee' | 'acceptee'

export interface Profile {
  id: string
  role: Role
  nom: string | null
  prenom: string | null
  email: string | null
  telephone: string | null
  avatar_url: string | null
  structure_id: string | null
  created_at: string
}

export interface Structure {
  id: string
  nom: string
  adresse: string | null
  ville: string | null
  code_postal: string | null
  telephone: string | null
  email: string | null
  logo_url: string | null
  widget_token: string
  created_at: string
}

export interface Entreprise {
  id: string
  structure_id: string | null
  siret: string | null
  nom: string
  description: string | null
  secteur: string | null
  adresse: string | null
  ville: string | null
  code_postal: string | null
  latitude: number | null
  longitude: number | null
  logo_url: string | null
  contact_nom: string | null
  contact_email: string | null
  contact_telephone: string | null
  user_id: string | null
  visible_candidats: boolean
  created_at: string
}

export interface Offre {
  id: string
  structure_id: string | null
  entreprise_id: string | null
  titre: string
  description: string | null
  type_contrat: TypeContrat | null
  duree: string | null
  salaire_min: number | null
  salaire_max: number | null
  ville: string | null
  code_postal: string | null
  latitude: number | null
  longitude: number | null
  competences: string[]
  statut: StatutOffre
  date_expiration: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  // Joined data
  entreprise?: Entreprise
  structure?: Structure
}

export interface Candidature {
  id: string
  offre_id: string
  candidat_id: string
  statut: StatutCandidature
  cv_url: string | null
  lettre_motivation: string | null
  notes_gestionnaire: string | null
  created_at: string
  updated_at: string
  // Joined data
  offre?: Offre
  candidat?: Candidat & { profile?: Profile }
}

export interface Candidat {
  id: string
  user_id: string
  competences: string[]
  experiences: Experience[]
  formations: Formation[]
  cv_url: string | null
  disponibilite: string | null
  mobilite_km: number
  created_at: string
}

export interface Experience {
  poste: string
  entreprise: string
  debut: string
  fin: string | null
  description: string | null
}

export interface Formation {
  diplome: string
  etablissement: string
  annee: string
  description: string | null
}

export interface Message {
  id: string
  expediteur_id: string
  destinataire_id: string
  offre_id: string | null
  candidature_id: string | null
  contenu: string
  lu: boolean
  created_at: string
  // Joined data
  expediteur?: Profile
  destinataire?: Profile
}

export interface AdresseResult {
  label: string
  ville: string
  codePostal: string
  lat: number
  lon: number
}

export interface CompetenceResult {
  uri: string
  titre: string
  type: string
}

export interface EntrepriseSiret {
  nom: string | null
  adresse: string | null
  ville: string | null
  codePostal: string | null
  activite: string | null
}

import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus, FileDown } from 'lucide-react'
import { Input } from '@/components/UI/Input'
import { Select } from '@/components/UI/Select'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { rechercherAdresse } from '@/lib/api-adresse'
import { rechercherCompetences } from '@/lib/api-competences'
import type { Entreprise, AdresseResult, CompetenceResult, TypeContrat } from '@/types'
import toast from 'react-hot-toast'

const contratOptions = [
  { value: 'CDI', label: 'CDI' },
  { value: 'CDD', label: 'CDD' },
  { value: 'Intérim', label: 'Intérim' },
  { value: 'Stage', label: 'Stage' },
  { value: 'Alternance', label: 'Alternance' },
  { value: 'Bénévolat', label: 'Bénévolat' },
]

export function NouvelleOffrePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  // Form state
  const [titre, setTitre] = useState('')
  const [typeContrat, setTypeContrat] = useState<TypeContrat>('CDI')
  const [entrepriseId, setEntrepriseId] = useState('')
  const [description, setDescription] = useState('')
  const [duree, setDuree] = useState('')
  const [salaireMin, setSalaireMin] = useState('')
  const [salaireMax, setSalaireMax] = useState('')
  const [dateExpiration, setDateExpiration] = useState('')
  const [loading, setLoading] = useState(false)

  // Address autocomplete
  const [adresseQuery, setAdresseQuery] = useState('')
  const [adresseResults, setAdresseResults] = useState<AdresseResult[]>([])
  const [selectedAdresse, setSelectedAdresse] = useState<AdresseResult | null>(null)

  // Competences
  const [competenceQuery, setCompetenceQuery] = useState('')
  const [competenceResults, setCompetenceResults] = useState<CompetenceResult[]>([])
  const [selectedCompetences, setSelectedCompetences] = useState<string[]>([])

  // Entreprises list
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])

  useEffect(() => {
    if (!profile?.structure_id) return
    supabase
      .from('entreprises')
      .select('*')
      .eq('structure_id', profile.structure_id)
      .then(({ data }) => setEntreprises((data ?? []) as Entreprise[]))
  }, [profile?.structure_id])

  // Address search debounce
  useEffect(() => {
    if (adresseQuery.length < 3) { setAdresseResults([]); return }
    const timer = setTimeout(async () => {
      const results = await rechercherAdresse(adresseQuery)
      setAdresseResults(results)
    }, 300)
    return () => clearTimeout(timer)
  }, [adresseQuery])

  // Competence search debounce
  useEffect(() => {
    if (competenceQuery.length < 2) { setCompetenceResults([]); return }
    const timer = setTimeout(async () => {
      const results = await rechercherCompetences(competenceQuery)
      setCompetenceResults(results)
    }, 300)
    return () => clearTimeout(timer)
  }, [competenceQuery])

  const handleSubmit = async (e: FormEvent, statut: 'brouillon' | 'en_attente') => {
    e.preventDefault()
    if (!user || !profile?.structure_id) return
    setLoading(true)

    const { error } = await supabase.from('offres').insert({
      titre,
      type_contrat: typeContrat,
      entreprise_id: entrepriseId || null,
      description,
      duree: duree || null,
      salaire_min: salaireMin ? parseInt(salaireMin) : null,
      salaire_max: salaireMax ? parseInt(salaireMax) : null,
      ville: selectedAdresse?.ville ?? null,
      code_postal: selectedAdresse?.codePostal ?? null,
      latitude: selectedAdresse?.lat ?? null,
      longitude: selectedAdresse?.lon ?? null,
      competences: selectedCompetences,
      date_expiration: dateExpiration || null,
      statut,
      structure_id: profile.structure_id,
      created_by: user.id,
    })

    if (error) {
      toast.error('Erreur lors de la création')
    } else {
      toast.success(statut === 'en_attente' ? 'Offre soumise pour validation' : 'Brouillon enregistré')
      navigate('/gestionnaire/offres')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Nouvelle offre d'emploi</h1>

      <form className="space-y-4">
        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Informations principales</h2>

          <Input
            label="Intitulé du poste"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            placeholder="Ex: Manutentionnaire, Agent d'entretien"
            helpText="Ex: Manutentionnaire, Agent d'entretien"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type de contrat"
              options={contratOptions}
              value={typeContrat}
              onChange={(e) => setTypeContrat(e.target.value as TypeContrat)}
              required
            />
            <Input
              label="Durée"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
              placeholder="Ex: 6 mois, 1 an..."
            />
          </div>

          <Select
            label="Entreprise"
            options={entreprises.map(e => ({ value: e.id, label: e.nom }))}
            value={entrepriseId}
            onChange={(e) => setEntrepriseId(e.target.value)}
            placeholder="Sélectionner une entreprise"
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description du poste <span className="text-danger">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Décrivez les missions, le profil recherché, les conditions de travail..."
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Localisation</h2>

          <div className="relative">
            <Input
              label="Adresse"
              value={adresseQuery}
              onChange={(e) => { setAdresseQuery(e.target.value); setSelectedAdresse(null) }}
              placeholder="Tapez une adresse..."
            />
            {adresseResults.length > 0 && !selectedAdresse && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto" role="listbox">
                {adresseResults.map((r, i) => (
                  <li
                    key={i}
                    role="option"
                    aria-selected={false}
                    className="px-3 py-2 text-sm hover:bg-primary-50 cursor-pointer"
                    onClick={() => {
                      setSelectedAdresse(r)
                      setAdresseQuery(r.label)
                      setAdresseResults([])
                    }}
                  >
                    {r.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedAdresse && (
            <p className="text-sm text-gray-500">
              {selectedAdresse.ville} ({selectedAdresse.codePostal})
            </p>
          )}
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Compétences recherchées</h2>

          <div className="relative">
            <Input
              label="Ajouter une compétence"
              value={competenceQuery}
              onChange={(e) => setCompetenceQuery(e.target.value)}
              placeholder="Tapez pour rechercher..."
            />
            {competenceResults.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto" role="listbox">
                {competenceResults.map((r) => (
                  <li
                    key={r.uri}
                    role="option"
                    aria-selected={selectedCompetences.includes(r.titre)}
                    className="px-3 py-2 text-sm hover:bg-primary-50 cursor-pointer"
                    onClick={() => {
                      if (!selectedCompetences.includes(r.titre)) {
                        setSelectedCompetences([...selectedCompetences, r.titre])
                      }
                      setCompetenceQuery('')
                      setCompetenceResults([])
                    }}
                  >
                    {r.titre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedCompetences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCompetences.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg text-sm">
                  {c}
                  <button
                    type="button"
                    onClick={() => setSelectedCompetences(selectedCompetences.filter(x => x !== c))}
                    aria-label={`Retirer ${c}`}
                    className="hover:text-green-900"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              label=""
              value={competenceQuery}
              onChange={(e) => setCompetenceQuery(e.target.value)}
              placeholder="Ou tapez manuellement"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && competenceQuery.trim()) {
                  e.preventDefault()
                  if (!selectedCompetences.includes(competenceQuery.trim())) {
                    setSelectedCompetences([...selectedCompetences, competenceQuery.trim()])
                  }
                  setCompetenceQuery('')
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                if (competenceQuery.trim() && !selectedCompetences.includes(competenceQuery.trim())) {
                  setSelectedCompetences([...selectedCompetences, competenceQuery.trim()])
                  setCompetenceQuery('')
                }
              }}
            >
              <Plus size={16} aria-hidden="true" />
            </Button>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Rémunération et dates</h2>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Salaire min (/mois)"
              type="number"
              value={salaireMin}
              onChange={(e) => setSalaireMin(e.target.value)}
              placeholder="Ex: 1400"
            />
            <Input
              label="Salaire max (/mois)"
              type="number"
              value={salaireMax}
              onChange={(e) => setSalaireMax(e.target.value)}
              placeholder="Ex: 1800"
            />
          </div>

          <Input
            label="Date d'expiration"
            type="date"
            value={dateExpiration}
            onChange={(e) => setDateExpiration(e.target.value)}
          />
        </Card>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            loading={loading}
            onClick={(e) => handleSubmit(e, 'brouillon')}
          >
            Enregistrer brouillon
          </Button>
          <Button
            className="flex-1"
            loading={loading}
            onClick={(e) => handleSubmit(e, 'en_attente')}
          >
            Soumettre pour validation
          </Button>
        </div>
      </form>
    </div>
  )
}

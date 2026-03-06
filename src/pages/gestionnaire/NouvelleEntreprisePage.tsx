import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/UI/Input'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { getEntrepriseParSiret } from '@/lib/api-siret'
import { rechercherAdresse } from '@/lib/api-adresse'
import type { AdresseResult } from '@/types'
import toast from 'react-hot-toast'

export function NouvelleEntreprisePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const [siret, setSiret] = useState('')
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [secteur, setSecteur] = useState('')
  const [contactNom, setContactNom] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactTelephone, setContactTelephone] = useState('')
  const [loading, setLoading] = useState(false)
  const [siretLoading, setSiretLoading] = useState(false)

  // Address
  const [adresseQuery, setAdresseQuery] = useState('')
  const [adresseResults, setAdresseResults] = useState<AdresseResult[]>([])
  const [selectedAdresse, setSelectedAdresse] = useState<AdresseResult | null>(null)

  const handleSiretLookup = async () => {
    if (siret.length !== 14) {
      toast.error('Le SIRET doit contenir 14 chiffres')
      return
    }

    setSiretLoading(true)
    const data = await getEntrepriseParSiret(siret)

    if (data) {
      if (data.nom) setNom(data.nom)
      if (data.ville) {
        setAdresseQuery(`${data.adresse ?? ''} ${data.ville}`)
        setSelectedAdresse({
          label: `${data.adresse ?? ''} ${data.ville}`,
          ville: data.ville,
          codePostal: data.codePostal ?? '',
          lat: 0,
          lon: 0,
        })
      }
      if (data.activite) setSecteur(data.activite)
      toast.success('Informations récupérées')
    } else {
      toast.error('SIRET introuvable')
    }
    setSiretLoading(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!profile?.structure_id) return
    setLoading(true)

    const { error } = await supabase.from('entreprises').insert({
      structure_id: profile.structure_id,
      siret: siret || null,
      nom,
      description: description || null,
      secteur: secteur || null,
      adresse: selectedAdresse?.label ?? null,
      ville: selectedAdresse?.ville ?? null,
      code_postal: selectedAdresse?.codePostal ?? null,
      latitude: selectedAdresse?.lat ?? null,
      longitude: selectedAdresse?.lon ?? null,
      contact_nom: contactNom || null,
      contact_email: contactEmail || null,
      contact_telephone: contactTelephone || null,
    })

    if (error) {
      if (error.code === '23505') {
        toast.error('Ce SIRET est déjà enregistré')
      } else {
        toast.error('Erreur lors de la création')
      }
    } else {
      toast.success('Entreprise ajoutée')
      navigate('/gestionnaire/entreprises')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Nouvelle entreprise</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recherche par SIRET</h2>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="Numéro SIRET"
                value={siret}
                onChange={(e) => setSiret(e.target.value.replace(/\D/g, '').slice(0, 14))}
                placeholder="14 chiffres"
                helpText="Entrez le SIRET pour pré-remplir les informations"
              />
            </div>
            <div className="pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSiretLookup}
                loading={siretLoading}
              >
                <Search size={16} aria-hidden="true" />
                Rechercher
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Informations entreprise</h2>
          <Input
            label="Nom de l'entreprise"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <Input
            label="Secteur d'activité"
            value={secteur}
            onChange={(e) => setSecteur(e.target.value)}
            placeholder="Ex: Commerce, BTP, Services..."
          />
          <div>
            <label htmlFor="desc-entreprise" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="desc-entreprise"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Présentez brièvement l'entreprise..."
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Adresse</h2>
          <div className="relative">
            <Input
              label="Adresse"
              value={adresseQuery}
              onChange={(e) => {
                setAdresseQuery(e.target.value)
                setSelectedAdresse(null)
                if (e.target.value.length >= 3) {
                  rechercherAdresse(e.target.value).then(setAdresseResults)
                }
              }}
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
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact</h2>
          <Input label="Nom du contact" value={contactNom} onChange={(e) => setContactNom(e.target.value)} />
          <Input label="Email du contact" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          <Input label="Téléphone du contact" type="tel" value={contactTelephone} onChange={(e) => setContactTelephone(e.target.value)} />
        </Card>

        <Button type="submit" className="w-full" loading={loading}>
          Ajouter l'entreprise
        </Button>
      </form>
    </div>
  )
}

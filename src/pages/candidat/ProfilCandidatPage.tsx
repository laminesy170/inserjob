import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/UI/Input'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import type { Candidat } from '@/types'
import toast from 'react-hot-toast'

export function ProfilCandidatPage() {
  const { user, profile } = useAuth()
  const [candidat, setCandidat] = useState<Candidat | null>(null)
  const [nom, setNom] = useState(profile?.nom ?? '')
  const [prenom, setPrenom] = useState(profile?.prenom ?? '')
  const [telephone, setTelephone] = useState(profile?.telephone ?? '')
  const [disponibilite, setDisponibilite] = useState('')
  const [mobiliteKm, setMobiliteKm] = useState(30)
  const [competences, setCompetences] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('candidats')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const c = data as Candidat
          setCandidat(c)
          setDisponibilite(c.disponibilite ?? '')
          setMobiliteKm(c.mobilite_km)
          setCompetences(c.competences.join(', '))
        }
      })
  }, [user])

  useEffect(() => {
    setNom(profile?.nom ?? '')
    setPrenom(profile?.prenom ?? '')
    setTelephone(profile?.telephone ?? '')
  }, [profile])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    // Update profile
    await supabase
      .from('profiles')
      .update({ nom, prenom, telephone })
      .eq('id', user.id)

    // Upsert candidat
    const competencesList = competences.split(',').map(c => c.trim()).filter(Boolean)

    if (candidat) {
      await supabase
        .from('candidats')
        .update({
          disponibilite,
          mobilite_km: mobiliteKm,
          competences: competencesList,
        })
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('candidats')
        .insert({
          user_id: user.id,
          disponibilite,
          mobilite_km: mobiliteKm,
          competences: competencesList,
        })
    }

    toast.success('Profil mis à jour')
    setLoading(false)
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Informations personnelles</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
            <Input label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>
          <Input label="Téléphone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
          <Input label="Email" value={profile?.email ?? ''} disabled />
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recherche d'emploi</h2>
          <Input
            label="Disponibilité"
            value={disponibilite}
            onChange={(e) => setDisponibilite(e.target.value)}
            placeholder="Ex: Immédiate, Dans 1 mois..."
          />
          <Input
            label="Mobilité (km)"
            type="number"
            value={mobiliteKm.toString()}
            onChange={(e) => setMobiliteKm(parseInt(e.target.value) || 0)}
            min={0}
            max={200}
          />
          <Input
            label="Compétences"
            value={competences}
            onChange={(e) => setCompetences(e.target.value)}
            helpText="Séparées par des virgules"
            placeholder="Ex: Manutention, Nettoyage, Soudure..."
          />
        </Card>

        <Button type="submit" className="w-full" loading={loading}>
          Enregistrer mon profil
        </Button>
      </form>
    </div>
  )
}

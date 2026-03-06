import { useState } from 'react'
import { Card } from '@/components/UI/Card'
import { Badge, BadgeCandidature } from '@/components/UI/Badge'
import { Select } from '@/components/UI/Select'
import { SkeletonList } from '@/components/UI/SkeletonCard'
import { EmptyState } from '@/components/UI/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useCandidaturesGestionnaire } from '@/hooks/useCandidatures'
import { supabase } from '@/lib/supabase'
import type { StatutCandidature } from '@/types'
import toast from 'react-hot-toast'

const statutOptions = [
  { value: 'envoyee', label: 'Envoyée' },
  { value: 'vue', label: 'Vue' },
  { value: 'preselectionee', label: 'Présélectionnée' },
  { value: 'transmise', label: 'Transmise' },
  { value: 'refusee', label: 'Refusée' },
  { value: 'acceptee', label: 'Acceptée' },
]

export function CandidaturesGestionnairePage() {
  const { profile } = useAuth()
  const { candidatures, loading, refetch } = useCandidaturesGestionnaire(profile?.structure_id)
  const [filter, setFilter] = useState('')

  const filtered = filter
    ? candidatures.filter(c => c.statut === filter)
    : candidatures

  const updateStatut = async (candidatureId: string, statut: StatutCandidature) => {
    const { error } = await supabase
      .from('candidatures')
      .update({ statut })
      .eq('id', candidatureId)

    if (error) {
      toast.error('Erreur lors de la mise à jour')
    } else {
      toast.success('Statut mis à jour')
      refetch()
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par statut">
        <button
          onClick={() => setFilter('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !filter ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-pressed={!filter}
        >
          Toutes ({candidatures.length})
        </button>
        {statutOptions.map((s) => {
          const count = candidatures.filter(c => c.statut === s.value).length
          return (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === s.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-pressed={filter === s.value}
            >
              {s.label} ({count})
            </button>
          )
        })}
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Aucune candidature" description="Les candidatures apparaîtront ici" />
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {c.candidat?.profile?.prenom} {c.candidat?.profile?.nom}
                  </p>
                  <p className="text-sm text-gray-500">{c.offre?.titre}</p>
                  {c.candidat?.profile?.email && (
                    <p className="text-xs text-gray-400">{c.candidat.profile.email}</p>
                  )}
                </div>
                <BadgeCandidature statut={c.statut} />
              </div>

              {c.lettre_motivation && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{c.lettre_motivation}</p>
              )}

              <div className="flex items-center gap-3">
                <Select
                  label=""
                  options={statutOptions}
                  value={c.statut}
                  onChange={(e) => updateStatut(c.id, e.target.value as StatutCandidature)}
                  className="text-sm"
                />
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>

              {/* Notes gestionnaire — jamais visible du candidat */}
              <div>
                <label htmlFor={`notes-${c.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                  Notes internes (non visibles du candidat)
                </label>
                <textarea
                  id={`notes-${c.id}`}
                  defaultValue={c.notes_gestionnaire ?? ''}
                  rows={2}
                  className="block w-full text-sm rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Ajoutez des notes..."
                  onBlur={async (e) => {
                    await supabase
                      .from('candidatures')
                      .update({ notes_gestionnaire: e.target.value })
                      .eq('id', c.id)
                  }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

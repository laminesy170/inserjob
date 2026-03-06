import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { CarteOffreAdmin } from '@/components/Offres/CarteOffreAdmin'
import { Button } from '@/components/UI/Button'
import { SkeletonList } from '@/components/UI/SkeletonCard'
import { EmptyState } from '@/components/UI/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useOffresGestionnaire } from '@/hooks/useOffres'
import { supabase } from '@/lib/supabase'
import type { StatutOffre } from '@/types'
import toast from 'react-hot-toast'

const statutFilters: { value: StatutOffre | ''; label: string }[] = [
  { value: '', label: 'Toutes' },
  { value: 'brouillon', label: 'Brouillons' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'publiee', label: 'Publiées' },
  { value: 'cloturee', label: 'Clôturées' },
]

export function OffresGestionnairePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { offres, loading, refetch } = useOffresGestionnaire(profile?.structure_id)
  const [statutFilter, setStatutFilter] = useState<StatutOffre | ''>('')

  const filtered = statutFilter ? offres.filter(o => o.statut === statutFilter) : offres

  const handleValider = async (offreId: string) => {
    const { error } = await supabase
      .from('offres')
      .update({ statut: 'publiee' })
      .eq('id', offreId)

    if (error) {
      toast.error('Erreur lors de la validation')
    } else {
      toast.success('Offre publiée')
      refetch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des offres</h1>
        <Button onClick={() => navigate('/gestionnaire/offres/nouvelle')}>
          <Plus size={18} aria-hidden="true" />
          Nouvelle offre
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par statut">
        {statutFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatutFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statutFilter === f.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-pressed={statutFilter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">{filtered.length} offre{filtered.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <SkeletonList count={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Aucune offre"
          description="Créez votre première offre d'emploi"
          actionLabel="Créer une offre"
          onAction={() => navigate('/gestionnaire/offres/nouvelle')}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((offre) => (
            <CarteOffreAdmin
              key={offre.id}
              offre={offre}
              onVoir={() => navigate(`/gestionnaire/offres/${offre.id}`)}
              onEditer={() => navigate(`/gestionnaire/offres/${offre.id}/editer`)}
              onValider={() => handleValider(offre.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { CarteOffre } from '@/components/Offres/CarteOffre'
import { SkeletonList } from '@/components/UI/SkeletonCard'
import { EmptyState } from '@/components/UI/EmptyState'
import { Input } from '@/components/UI/Input'
import { useOffresPubliques } from '@/hooks/useOffres'
import { useAuth } from '@/hooks/useAuth'
import type { TypeContrat } from '@/types'
import toast from 'react-hot-toast'

const contratTypes: TypeContrat[] = ['CDI', 'CDD', 'Intérim', 'Stage', 'Alternance', 'Bénévolat']

export function OffresPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [typeContrat, setTypeContrat] = useState<TypeContrat | ''>('')
  const [ville, setVille] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filters = useMemo(() => ({ search, typeContrat, ville }), [search, typeContrat, ville])
  const { offres, loading } = useOffresPubliques(filters)

  const handlePostuler = (offreId: string) => {
    if (!user) {
      toast('Connectez-vous pour postuler')
      navigate('/connexion')
      return
    }
    navigate(`/offres/${offreId}/postuler`)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Offres d'emploi</h1>
        <p className="text-gray-500 text-sm mt-1">Trouvez l'emploi qui vous correspond</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher un poste, une compétence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
            aria-label="Rechercher une offre"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showFilters || typeContrat || ville
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
          aria-expanded={showFilters}
          aria-label="Filtres"
        >
          <SlidersHorizontal size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Filtres</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat</label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type de contrat">
              {contratTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeContrat(typeContrat === type ? '' : type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    typeContrat === type
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={typeContrat === type}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Ville"
            placeholder="Ex: Lyon, Paris..."
            value={ville}
            onChange={(e) => setVille(e.target.value)}
          />
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500" role="status" aria-live="polite">
          {offres.length} offre{offres.length !== 1 ? 's' : ''} trouvée{offres.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Offers list */}
      {loading ? (
        <SkeletonList count={5} />
      ) : offres.length === 0 ? (
        <EmptyState
          title="Aucune offre trouvée"
          description="Essayez de modifier vos critères de recherche"
        />
      ) : (
        <div className="space-y-3">
          {offres.map((offre) => (
            <CarteOffre
              key={offre.id}
              offre={offre}
              onPostuler={() => handlePostuler(offre.id)}
              onVoirDetail={() => navigate(`/offres/${offre.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

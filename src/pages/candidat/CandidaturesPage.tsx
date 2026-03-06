import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/UI/Card'
import { BadgeCandidature, BadgeContrat } from '@/components/UI/Badge'
import { SkeletonList } from '@/components/UI/SkeletonCard'
import { EmptyState } from '@/components/UI/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useMesCandidatures } from '@/hooks/useCandidatures'

export function CandidaturesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { candidatures, loading } = useMesCandidatures(user?.id)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Mes candidatures</h1>

      {loading ? (
        <SkeletonList count={5} />
      ) : candidatures.length === 0 ? (
        <EmptyState
          title="Aucune candidature"
          description="Postulez à une offre pour voir vos candidatures ici"
          actionLabel="Voir les offres"
          onAction={() => navigate('/offres')}
        />
      ) : (
        <div className="space-y-3">
          {candidatures.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{c.offre?.titre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {c.offre?.type_contrat && <BadgeContrat type={c.offre.type_contrat} />}
                    {c.offre?.ville && (
                      <span className="text-sm text-gray-500">{c.offre.ville}</span>
                    )}
                  </div>
                </div>
                <BadgeCandidature statut={c.statut} />
              </div>
              {c.lettre_motivation && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{c.lettre_motivation}</p>
              )}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                <time className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString('fr-FR')}
                </time>
                {c.offre && (
                  <button
                    onClick={() => navigate(`/offres/${c.offre_id}`)}
                    className="text-sm text-primary-500 hover:text-primary-700 font-medium"
                  >
                    Voir l'offre
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

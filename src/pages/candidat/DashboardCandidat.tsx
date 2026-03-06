import { useNavigate } from 'react-router-dom'
import { FileText, Search, User, Eye, CheckCircle, XCircle, Clock, Send } from 'lucide-react'
import { Card } from '@/components/UI/Card'
import { BadgeCandidature } from '@/components/UI/Badge'
import { Button } from '@/components/UI/Button'
import { SkeletonList } from '@/components/UI/SkeletonCard'
import { EmptyState } from '@/components/UI/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useMesCandidatures } from '@/hooks/useCandidatures'
import type { StatutCandidature } from '@/types'

const statutCounts = (candidatures: { statut: StatutCandidature }[]) => {
  const counts: Record<string, number> = {}
  for (const c of candidatures) {
    counts[c.statut] = (counts[c.statut] ?? 0) + 1
  }
  return counts
}

const statutChips: { statut: StatutCandidature; label: string; icon: React.ReactNode; color: string }[] = [
  { statut: 'envoyee', label: 'Envoyées', icon: <Send size={14} />, color: 'bg-blue-100 text-blue-800' },
  { statut: 'vue', label: 'Vues', icon: <Eye size={14} />, color: 'bg-yellow-100 text-yellow-800' },
  { statut: 'preselectionee', label: 'Présélectionnées', icon: <Clock size={14} />, color: 'bg-purple-100 text-purple-800' },
  { statut: 'acceptee', label: 'Acceptées', icon: <CheckCircle size={14} />, color: 'bg-green-100 text-green-800' },
  { statut: 'refusee', label: 'Refusées', icon: <XCircle size={14} />, color: 'bg-red-100 text-red-800' },
]

export function DashboardCandidat() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { candidatures, loading } = useMesCandidatures(user?.id)

  const counts = statutCounts(candidatures)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour{profile?.prenom ? `, ${profile.prenom}` : ''}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Suivez vos candidatures et trouvez votre prochain emploi</p>
      </div>

      {/* Statut chips */}
      <div className="flex flex-wrap gap-2">
        {statutChips.map(({ statut, label, icon, color }) => (
          <span key={statut} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${color}`}>
            {icon}
            {counts[statut] ?? 0} {label}
          </span>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/offres')}>
          <Search size={24} className="text-primary-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-700">Voir les offres</p>
        </Card>
        <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/candidat/candidatures')}>
          <FileText size={24} className="text-primary-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-700">Mes candidatures</p>
        </Card>
        <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/candidat/profil')}>
          <User size={24} className="text-primary-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-700">Mon profil</p>
        </Card>
      </div>

      {/* Recent candidatures */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Dernières candidatures</h2>
          {candidatures.length > 3 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/candidat/candidatures')}>
              Tout voir
            </Button>
          )}
        </div>

        {loading ? (
          <SkeletonList count={3} />
        ) : candidatures.length === 0 ? (
          <EmptyState
            title="Aucune candidature"
            description="Parcourez les offres et postulez à celles qui vous correspondent"
            actionLabel="Voir les offres"
            onAction={() => navigate('/offres')}
          />
        ) : (
          <div className="space-y-3">
            {candidatures.slice(0, 5).map((candidature) => (
              <Card key={candidature.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{candidature.offre?.titre ?? 'Offre'}</h3>
                    <p className="text-sm text-gray-500">
                      {candidature.offre?.ville}
                      {candidature.offre?.type_contrat && ` — ${candidature.offre.type_contrat}`}
                    </p>
                  </div>
                  <BadgeCandidature statut={candidature.statut} />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Postulé le {new Date(candidature.created_at).toLocaleDateString('fr-FR')}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

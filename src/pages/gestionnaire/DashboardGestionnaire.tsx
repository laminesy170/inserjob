import { useNavigate } from 'react-router-dom'
import { Briefcase, FileText, Users, TrendingUp, Plus, Clock } from 'lucide-react'
import { KpiCard } from '@/components/Stats/KpiCard'
import { RatioChart } from '@/components/Stats/RatioChart'
import { CarteOffreAdmin } from '@/components/Offres/CarteOffreAdmin'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import { SkeletonList } from '@/components/UI/SkeletonCard'
import { EmptyState } from '@/components/UI/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useOffresGestionnaire } from '@/hooks/useOffres'
import { useCandidaturesGestionnaire } from '@/hooks/useCandidatures'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function DashboardGestionnaire() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { offres, loading: loadingOffres, refetch: refetchOffres } = useOffresGestionnaire(profile?.structure_id)
  const { candidatures, loading: loadingCandidatures } = useCandidaturesGestionnaire(profile?.structure_id)

  const offresActives = offres.filter(o => o.statut === 'publiee').length
  const offresEnAttente = offres.filter(o => o.statut === 'en_attente')
  const candidaturesSemaine = candidatures.filter(c => {
    const date = new Date(c.created_at)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= weekAgo
  }).length

  const candidaturesParStatut = [
    { label: 'Envoyées', value: candidatures.filter(c => c.statut === 'envoyee').length, color: '#3B82F6' },
    { label: 'Présélectionnées', value: candidatures.filter(c => c.statut === 'preselectionee').length, color: '#8B5CF6' },
    { label: 'Transmises', value: candidatures.filter(c => c.statut === 'transmise').length, color: '#10B981' },
    { label: 'Acceptées', value: candidatures.filter(c => c.statut === 'acceptee').length, color: '#059669' },
    { label: 'Refusées', value: candidatures.filter(c => c.statut === 'refusee').length, color: '#EF4444' },
  ]

  const handleValider = async (offreId: string) => {
    const { error } = await supabase
      .from('offres')
      .update({ statut: 'publiee' })
      .eq('id', offreId)

    if (error) {
      toast.error('Erreur lors de la validation')
    } else {
      toast.success('Offre publiée')
      refetchOffres()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre structure</p>
        </div>
        <Button onClick={() => navigate('/gestionnaire/offres/nouvelle')}>
          <Plus size={18} aria-hidden="true" />
          Nouvelle offre
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Offres actives" value={offresActives} icon={Briefcase} />
        <KpiCard label="Candidatures / semaine" value={candidaturesSemaine} icon={FileText} />
        <KpiCard label="Total candidatures" value={candidatures.length} icon={Users} />
        <KpiCard
          label="Taux de placement"
          value={candidatures.length > 0
            ? `${Math.round((candidatures.filter(c => c.statut === 'acceptee').length / candidatures.length) * 100)}%`
            : '0%'
          }
          icon={TrendingUp}
        />
      </div>

      {/* Ratio chart */}
      <RatioChart title="Répartition des candidatures" data={candidaturesParStatut} />

      {/* Validation queue */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} className="text-warning" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900">
            En attente de validation ({offresEnAttente.length})
          </h2>
        </div>

        {loadingOffres ? (
          <SkeletonList count={2} />
        ) : offresEnAttente.length === 0 ? (
          <Card className="p-4">
            <p className="text-sm text-gray-500 text-center">Aucune offre en attente</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {offresEnAttente.map((offre) => (
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

      {/* Recent candidatures */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Dernières candidatures</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/gestionnaire/candidatures')}>
            Tout voir
          </Button>
        </div>

        {loadingCandidatures ? (
          <SkeletonList count={3} />
        ) : candidatures.length === 0 ? (
          <EmptyState title="Aucune candidature" description="Les candidatures apparaîtront ici" />
        ) : (
          <div className="space-y-3">
            {candidatures.slice(0, 5).map((c) => (
              <Card key={c.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {c.candidat?.profile?.prenom} {c.candidat?.profile?.nom}
                    </p>
                    <p className="text-xs text-gray-500">{c.offre?.titre}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    c.statut === 'envoyee' ? 'bg-blue-100 text-blue-800' :
                    c.statut === 'acceptee' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {c.statut}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

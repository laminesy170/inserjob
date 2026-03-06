import { Briefcase, FileText, Users, TrendingUp } from 'lucide-react'
import { KpiCard } from '@/components/Stats/KpiCard'
import { RatioChart } from '@/components/Stats/RatioChart'
import { Card } from '@/components/UI/Card'
import { useAuth } from '@/hooks/useAuth'
import { useOffresGestionnaire } from '@/hooks/useOffres'
import { useCandidaturesGestionnaire } from '@/hooks/useCandidatures'

export function StatsPage() {
  const { profile } = useAuth()
  const { offres } = useOffresGestionnaire(profile?.structure_id)
  const { candidatures } = useCandidaturesGestionnaire(profile?.structure_id)

  const offresActives = offres.filter(o => o.statut === 'publiee').length
  const totalCandidatures = candidatures.length
  const acceptees = candidatures.filter(c => c.statut === 'acceptee').length
  const tauxPlacement = totalCandidatures > 0 ? Math.round((acceptees / totalCandidatures) * 100) : 0

  const contratData = [
    { label: 'CDI', value: offres.filter(o => o.type_contrat === 'CDI').length, color: '#059669' },
    { label: 'CDD', value: offres.filter(o => o.type_contrat === 'CDD').length, color: '#3B82F6' },
    { label: 'Intérim', value: offres.filter(o => o.type_contrat === 'Intérim').length, color: '#F59E0B' },
    { label: 'Stage', value: offres.filter(o => o.type_contrat === 'Stage').length, color: '#8B5CF6' },
    { label: 'Alternance', value: offres.filter(o => o.type_contrat === 'Alternance').length, color: '#A855F7' },
  ]

  const candidaturesData = [
    { label: 'Envoyées', value: candidatures.filter(c => c.statut === 'envoyee').length, color: '#3B82F6' },
    { label: 'Présélectionnées', value: candidatures.filter(c => c.statut === 'preselectionee').length, color: '#8B5CF6' },
    { label: 'Transmises', value: candidatures.filter(c => c.statut === 'transmise').length, color: '#10B981' },
    { label: 'Acceptées', value: acceptees, color: '#059669' },
    { label: 'Refusées', value: candidatures.filter(c => c.statut === 'refusee').length, color: '#EF4444' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Offres actives" value={offresActives} icon={Briefcase} />
        <KpiCard label="Total candidatures" value={totalCandidatures} icon={FileText} />
        <KpiCard label="Acceptées" value={acceptees} icon={Users} />
        <KpiCard label="Taux de placement" value={`${tauxPlacement}%`} icon={TrendingUp} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <RatioChart title="Offres par type de contrat" data={contratData} />
        <RatioChart title="Candidatures par statut" data={candidaturesData} />
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Résumé</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Offres totales</p>
            <p className="text-xl font-bold text-gray-900">{offres.length}</p>
          </div>
          <div>
            <p className="text-gray-500">Offres publiées</p>
            <p className="text-xl font-bold text-gray-900">{offresActives}</p>
          </div>
          <div>
            <p className="text-gray-500">Brouillons</p>
            <p className="text-xl font-bold text-gray-900">{offres.filter(o => o.statut === 'brouillon').length}</p>
          </div>
          <div>
            <p className="text-gray-500">Clôturées</p>
            <p className="text-xl font-bold text-gray-900">{offres.filter(o => o.statut === 'cloturee').length}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

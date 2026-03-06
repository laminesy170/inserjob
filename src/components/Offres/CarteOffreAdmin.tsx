import { MapPin, Calendar, Building2, Eye, Edit } from 'lucide-react'
import { Card } from '@/components/UI/Card'
import { BadgeContrat } from '@/components/UI/Badge'
import { Badge } from '@/components/UI/Badge'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Offre, StatutOffre } from '@/types'

interface CarteOffreAdminProps {
  offre: Offre
  onVoir?: () => void
  onEditer?: () => void
  onValider?: () => void
}

const statutVariants: Record<StatutOffre, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' }> = {
  brouillon: { label: 'Brouillon', variant: 'gray' },
  en_attente: { label: 'En attente', variant: 'yellow' },
  publiee: { label: 'Publiée', variant: 'green' },
  cloturee: { label: 'Clôturée', variant: 'red' },
}

export function CarteOffreAdmin({ offre, onVoir, onEditer, onValider }: CarteOffreAdminProps) {
  const statut = statutVariants[offre.statut]

  return (
    <Card as="article" className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {offre.type_contrat && <BadgeContrat type={offre.type_contrat} />}
          <Badge variant={statut.variant}>{statut.label}</Badge>
        </div>
        <time dateTime={offre.created_at} className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(offre.created_at), { addSuffix: true, locale: fr })}
        </time>
      </div>

      <h3 className="text-base font-semibold text-gray-900">{offre.titre}</h3>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        {offre.entreprise && (
          <span className="flex items-center gap-1">
            <Building2 size={14} aria-hidden="true" />
            {offre.entreprise.nom}
          </span>
        )}
        {offre.ville && (
          <span className="flex items-center gap-1">
            <MapPin size={14} aria-hidden="true" />
            {offre.ville}
          </span>
        )}
        {offre.date_expiration && (
          <span className="flex items-center gap-1">
            <Calendar size={14} aria-hidden="true" />
            {new Date(offre.date_expiration).toLocaleDateString('fr-FR')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        {onVoir && (
          <button
            onClick={onVoir}
            className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700 transition-colors"
            aria-label={`Voir l'offre ${offre.titre}`}
          >
            <Eye size={16} aria-hidden="true" />
            Voir
          </button>
        )}
        {onEditer && (
          <button
            onClick={onEditer}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={`Modifier l'offre ${offre.titre}`}
          >
            <Edit size={16} aria-hidden="true" />
            Modifier
          </button>
        )}
        {onValider && offre.statut === 'en_attente' && (
          <button
            onClick={onValider}
            className="flex items-center gap-1 text-sm text-success hover:text-green-700 transition-colors ml-auto"
            aria-label={`Valider l'offre ${offre.titre}`}
          >
            Valider et publier
          </button>
        )}
      </div>
    </Card>
  )
}

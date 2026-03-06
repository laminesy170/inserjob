import { MapPin, Calendar, Euro } from 'lucide-react'
import { Card } from '@/components/UI/Card'
import { BadgeContrat } from '@/components/UI/Badge'
import { Button } from '@/components/UI/Button'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Offre } from '@/types'

interface CarteOffreProps {
  offre: Offre
  onPostuler?: () => void
  onVoirDetail?: () => void
}

export function CarteOffre({ offre, onPostuler, onVoirDetail }: CarteOffreProps) {
  return (
    <Card as="article" className="p-4 space-y-3" onClick={onVoirDetail}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {offre.type_contrat && <BadgeContrat type={offre.type_contrat} />}
          {offre.duree && (
            <span className="text-xs text-gray-500">{offre.duree}</span>
          )}
        </div>
        <time
          dateTime={offre.created_at}
          className="text-xs text-gray-400 whitespace-nowrap"
        >
          {formatDistanceToNow(new Date(offre.created_at), { addSuffix: true, locale: fr })}
        </time>
      </div>

      <h3 className="text-base font-semibold text-gray-900 leading-tight">
        {offre.titre}
      </h3>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        {offre.ville && (
          <span className="flex items-center gap-1">
            <MapPin size={14} aria-hidden="true" />
            {offre.ville} {offre.code_postal && `(${offre.code_postal})`}
          </span>
        )}
        {(offre.salaire_min || offre.salaire_max) && (
          <span className="flex items-center gap-1">
            <Euro size={14} aria-hidden="true" />
            {offre.salaire_min && offre.salaire_max
              ? `${offre.salaire_min} - ${offre.salaire_max} /mois`
              : offre.salaire_min
                ? `${offre.salaire_min} /mois`
                : `${offre.salaire_max} /mois`
            }
          </span>
        )}
        {offre.date_expiration && (
          <span className="flex items-center gap-1">
            <Calendar size={14} aria-hidden="true" />
            Expire le {new Date(offre.date_expiration).toLocaleDateString('fr-FR')}
          </span>
        )}
      </div>

      {offre.competences.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {offre.competences.slice(0, 4).map((c, i) => (
            <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md">
              {c}
            </span>
          ))}
          {offre.competences.length > 4 && (
            <span className="text-xs text-gray-400">+{offre.competences.length - 4}</span>
          )}
        </div>
      )}

      {onPostuler && (
        <div className="flex justify-end pt-1">
          <Button
            size="sm"
            onClick={(e) => { e.stopPropagation(); onPostuler() }}
          >
            Postuler
          </Button>
        </div>
      )}
    </Card>
  )
}

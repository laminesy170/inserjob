import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Euro, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/UI/Button'
import { BadgeContrat } from '@/components/UI/Badge'
import { Card } from '@/components/UI/Card'
import { useOffreDetail } from '@/hooks/useOffres'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export function OffreDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { offre, loading } = useOffreDetail(id)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-6 w-32" />
        <div className="skeleton h-40 w-full rounded-xl" />
        <div className="skeleton h-20 w-full rounded-xl" />
      </div>
    )
  }

  if (!offre) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold text-gray-900">Offre introuvable</h1>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/offres')}>
          Retour aux offres
        </Button>
      </div>
    )
  }

  const handlePostuler = () => {
    if (!user) {
      toast('Connectez-vous pour postuler')
      navigate('/connexion')
      return
    }
    navigate(`/offres/${offre.id}/postuler`)
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Retour
      </button>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {offre.type_contrat && <BadgeContrat type={offre.type_contrat} />}
          {offre.duree && <span className="text-sm text-gray-500">{offre.duree}</span>}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{offre.titre}</h1>
      </div>

      <Card className="p-4 space-y-2">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {offre.ville && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-gray-400" aria-hidden="true" />
              {offre.ville} {offre.code_postal && `(${offre.code_postal})`}
            </div>
          )}
          {(offre.salaire_min || offre.salaire_max) && (
            <div className="flex items-center gap-2 text-gray-600">
              <Euro size={16} className="text-gray-400" aria-hidden="true" />
              {offre.salaire_min && offre.salaire_max
                ? `${offre.salaire_min} - ${offre.salaire_max} /mois`
                : `${offre.salaire_min ?? offre.salaire_max} /mois`
              }
            </div>
          )}
          {offre.date_expiration && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} className="text-gray-400" aria-hidden="true" />
              Expire le {new Date(offre.date_expiration).toLocaleDateString('fr-FR')}
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} className="text-gray-400" aria-hidden="true" />
            Publiée le {new Date(offre.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </Card>

      {offre.description && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Description du poste
          </h2>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {offre.description}
          </div>
        </Card>
      )}

      {offre.competences.length > 0 && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Compétences recherchées
          </h2>
          <div className="flex flex-wrap gap-2">
            {offre.competences.map((c, i) => (
              <span key={i} className="text-sm bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg">
                {c}
              </span>
            ))}
          </div>
        </Card>
      )}

      {offre.structure && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Pour postuler
          </h2>
          <p className="text-sm text-gray-600">
            Contactez {offre.structure.nom}
          </p>
          {offre.structure.telephone && (
            <p className="text-sm text-gray-600">{offre.structure.telephone}</p>
          )}
          {offre.structure.email && (
            <p className="text-sm text-gray-600">{offre.structure.email}</p>
          )}
        </Card>
      )}

      <div className="sticky bottom-20 md:bottom-4 bg-surface py-3">
        <Button className="w-full" size="lg" onClick={handlePostuler}>
          Postuler à cette offre
        </Button>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { Briefcase, MessageSquare, Building2 } from 'lucide-react'
import { Card } from '@/components/UI/Card'
import { useAuth } from '@/hooks/useAuth'

export function DashboardEntreprise() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour{profile?.prenom ? `, ${profile.prenom}` : ''}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos offres et vos recrutements</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/entreprise/offres')}>
          <Briefcase size={24} className="text-primary-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-700">Mes offres</p>
        </Card>
        <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/messages')}>
          <MessageSquare size={24} className="text-primary-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-700">Messages</p>
        </Card>
        <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/entreprise/profil')}>
          <Building2 size={24} className="text-primary-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-700">Mon profil</p>
        </Card>
      </div>

      <Card className="p-6 text-center">
        <p className="text-gray-500 text-sm">
          Votre espace entreprise est en cours de développement.
          Contactez votre structure d'insertion pour publier vos offres.
        </p>
      </Card>
    </div>
  )
}

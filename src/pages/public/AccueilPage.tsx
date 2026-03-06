import { useNavigate } from 'react-router-dom'
import { Search, Briefcase, Building2, Users } from 'lucide-react'
import { Button } from '@/components/UI/Button'
import { useAuth } from '@/hooks/useAuth'

export function AccueilPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  // Redirect logged-in users to their dashboard
  if (profile) {
    const dashboardPath = {
      candidat: '/candidat/dashboard',
      entreprise: '/entreprise/dashboard',
      gestionnaire: '/gestionnaire/dashboard',
    }[profile.role]
    navigate(dashboardPath, { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <header className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IJ</span>
              </div>
              <span className="text-xl font-bold">InserJob</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/connexion')}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/inscription')}
                className="px-4 py-2 text-sm font-semibold bg-white text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Inscription
              </button>
            </div>
          </div>

          <div className="text-center py-12 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              Trouvez votre prochain emploi avec l'accompagnement de votre structure d'insertion
            </h1>
            <p className="text-primary-100 text-lg mb-8">
              InserJob met en relation candidats, entreprises et structures d'insertion pour un accès facilité à l'emploi.
            </p>
            <button
              onClick={() => navigate('/offres')}
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold bg-white text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Search size={20} aria-hidden="true" />
              Voir les offres d'emploi
            </button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Une plateforme pour chaque acteur de l'insertion
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users size={32} />,
              title: 'Candidats',
              desc: 'Accédez aux offres adaptées à votre profil, postulez en quelques clics et suivez vos candidatures.',
            },
            {
              icon: <Building2 size={32} />,
              title: 'Entreprises',
              desc: 'Publiez vos offres et recevez des candidatures pré-qualifiées par les structures d\'insertion.',
            },
            {
              icon: <Briefcase size={32} />,
              title: 'Structures d\'insertion',
              desc: 'Gérez les offres, suivez les candidatures et mesurez vos résultats de placement.',
            },
          ].map((feature) => (
            <div key={feature.title} className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-50 py-12">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-gray-600 mb-6">
            Inscrivez-vous gratuitement et accédez à toutes les offres d'emploi.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate('/inscription')}>
              Créer un compte
            </Button>
            <Button variant="secondary" onClick={() => navigate('/offres')}>
              Voir les offres
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} InserJob. Tous droits réservés.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="/mentions-legales" className="hover:text-gray-700">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-gray-700">Politique de confidentialité</a>
            <a href="/accessibilite" className="hover:text-gray-700">Accessibilité</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

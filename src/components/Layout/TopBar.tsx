import { Bell, MessageSquare, LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function TopBar() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/connexion')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
          aria-label="Accueil InserJob"
        >
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IJ</span>
          </div>
          <span className="text-lg font-bold text-primary-900 hidden sm:block">InserJob</span>
        </button>

        <div className="flex items-center gap-1">
          {profile && (
            <>
              <button
                onClick={() => navigate('/messages')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                aria-label="Messages"
              >
                <MessageSquare size={20} aria-hidden="true" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={20} aria-hidden="true" />
              </button>
              <button
                onClick={() => {
                  const base = profile.role === 'gestionnaire' ? '/gestionnaire' : profile.role === 'entreprise' ? '/entreprise' : '/candidat'
                  navigate(`${base}/profil`)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Mon profil"
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <User size={20} aria-hidden="true" />
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                aria-label="Se déconnecter"
              >
                <LogOut size={20} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

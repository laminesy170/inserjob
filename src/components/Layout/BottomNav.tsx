import { Home, Search, FileText, MessageSquare, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { Role } from '@/types'

interface NavItem {
  icon: React.ReactNode
  label: string
  path: string
}

const candidatNav: NavItem[] = [
  { icon: <Home size={20} />, label: 'Accueil', path: '/candidat/dashboard' },
  { icon: <Search size={20} />, label: 'Offres', path: '/offres' },
  { icon: <FileText size={20} />, label: 'Candidatures', path: '/candidat/candidatures' },
  { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
  { icon: <User size={20} />, label: 'Profil', path: '/candidat/profil' },
]

const entrepriseNav: NavItem[] = [
  { icon: <Home size={20} />, label: 'Accueil', path: '/entreprise/dashboard' },
  { icon: <FileText size={20} />, label: 'Offres', path: '/entreprise/offres' },
  { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
  { icon: <User size={20} />, label: 'Profil', path: '/entreprise/profil' },
]

const gestionnaireNav: NavItem[] = [
  { icon: <Home size={20} />, label: 'Accueil', path: '/gestionnaire/dashboard' },
  { icon: <Search size={20} />, label: 'Offres', path: '/gestionnaire/offres' },
  { icon: <FileText size={20} />, label: 'Candidatures', path: '/gestionnaire/candidatures' },
  { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
  { icon: <User size={20} />, label: 'Profil', path: '/gestionnaire/profil' },
]

const navByRole: Record<Role, NavItem[]> = {
  candidat: candidatNav,
  entreprise: entrepriseNav,
  gestionnaire: gestionnaireNav,
}

export function BottomNav() {
  const { profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!profile) return null

  const items = navByRole[profile.role]

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 pb-safe md:hidden"
      aria-label="Navigation principale"
    >
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
                isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

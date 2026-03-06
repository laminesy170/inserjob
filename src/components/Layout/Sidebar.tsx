import {
  LayoutDashboard, Briefcase, Users, Building2, BarChart3,
  MessageSquare, Settings, FileText
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarItem {
  icon: React.ReactNode
  label: string
  path: string
}

const menuItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/gestionnaire/dashboard' },
  { icon: <Briefcase size={20} />, label: 'Offres', path: '/gestionnaire/offres' },
  { icon: <FileText size={20} />, label: 'Candidatures', path: '/gestionnaire/candidatures' },
  { icon: <Building2 size={20} />, label: 'Entreprises', path: '/gestionnaire/entreprises' },
  { icon: <Users size={20} />, label: 'Candidats', path: '/gestionnaire/candidats' },
  { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
  { icon: <BarChart3 size={20} />, label: 'Statistiques', path: '/gestionnaire/stats' },
  { icon: <Settings size={20} />, label: 'Paramètres', path: '/gestionnaire/parametres' },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-100 h-screen sticky top-14">
      <nav className="flex-1 py-4 px-3 space-y-1" aria-label="Menu gestionnaire">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

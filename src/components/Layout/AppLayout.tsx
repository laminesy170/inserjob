import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/hooks/useAuth'

export function AppLayout() {
  const { profile } = useAuth()
  const isGestionnaire = profile?.role === 'gestionnaire'

  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <div className="flex">
        {isGestionnaire && <Sidebar />}
        <main className="flex-1 pb-20 md:pb-4">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

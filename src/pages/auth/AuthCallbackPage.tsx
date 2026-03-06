import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { profile, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!profile) {
      navigate('/connexion')
      return
    }

    switch (profile.role) {
      case 'gestionnaire':
        navigate('/gestionnaire/dashboard')
        break
      case 'entreprise':
        navigate('/entreprise/dashboard')
        break
      default:
        navigate('/candidat/dashboard')
    }
  }, [profile, loading, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Connexion en cours...</p>
      </div>
    </div>
  )
}

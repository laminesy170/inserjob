import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppLayout } from '@/components/Layout/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import type { Role } from '@/types'

// Lazy-loaded pages
const AccueilPage = lazy(() => import('@/pages/public/AccueilPage').then(m => ({ default: m.AccueilPage })))
const OffresPage = lazy(() => import('@/pages/public/OffresPage').then(m => ({ default: m.OffresPage })))
const OffreDetailPage = lazy(() => import('@/pages/public/OffreDetailPage').then(m => ({ default: m.OffreDetailPage })))
const ConnexionPage = lazy(() => import('@/pages/auth/ConnexionPage').then(m => ({ default: m.ConnexionPage })))
const InscriptionPage = lazy(() => import('@/pages/auth/InscriptionPage').then(m => ({ default: m.InscriptionPage })))
const AuthCallbackPage = lazy(() => import('@/pages/auth/AuthCallbackPage').then(m => ({ default: m.AuthCallbackPage })))
const DashboardCandidat = lazy(() => import('@/pages/candidat/DashboardCandidat').then(m => ({ default: m.DashboardCandidat })))
const CandidaturesPage = lazy(() => import('@/pages/candidat/CandidaturesPage').then(m => ({ default: m.CandidaturesPage })))
const ProfilCandidatPage = lazy(() => import('@/pages/candidat/ProfilCandidatPage').then(m => ({ default: m.ProfilCandidatPage })))
const DashboardGestionnaire = lazy(() => import('@/pages/gestionnaire/DashboardGestionnaire').then(m => ({ default: m.DashboardGestionnaire })))
const OffresGestionnairePage = lazy(() => import('@/pages/gestionnaire/OffresGestionnairePage').then(m => ({ default: m.OffresGestionnairePage })))
const NouvelleOffrePage = lazy(() => import('@/pages/gestionnaire/NouvelleOffrePage').then(m => ({ default: m.NouvelleOffrePage })))
const CandidaturesGestionnairePage = lazy(() => import('@/pages/gestionnaire/CandidaturesGestionnairePage').then(m => ({ default: m.CandidaturesGestionnairePage })))
const EntreprisesPage = lazy(() => import('@/pages/gestionnaire/EntreprisesPage').then(m => ({ default: m.EntreprisesPage })))
const NouvelleEntreprisePage = lazy(() => import('@/pages/gestionnaire/NouvelleEntreprisePage').then(m => ({ default: m.NouvelleEntreprisePage })))
const MessagesPage = lazy(() => import('@/pages/gestionnaire/MessagesPage').then(m => ({ default: m.MessagesPage })))
const StatsPage = lazy(() => import('@/pages/gestionnaire/StatsPage').then(m => ({ default: m.StatsPage })))
const DashboardEntreprise = lazy(() => import('@/pages/entreprise/DashboardEntreprise').then(m => ({ default: m.DashboardEntreprise })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: Role[] }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/connexion" replace />
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<AccueilPage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Public with layout */}
          <Route element={<AppLayout />}>
            <Route path="/offres" element={<OffresPage />} />
            <Route path="/offres/:id" element={<OffreDetailPage />} />

            {/* Candidat */}
            <Route path="/candidat/dashboard" element={
              <ProtectedRoute allowedRoles={['candidat']}>
                <DashboardCandidat />
              </ProtectedRoute>
            } />
            <Route path="/candidat/candidatures" element={
              <ProtectedRoute allowedRoles={['candidat']}>
                <CandidaturesPage />
              </ProtectedRoute>
            } />
            <Route path="/candidat/profil" element={
              <ProtectedRoute allowedRoles={['candidat']}>
                <ProfilCandidatPage />
              </ProtectedRoute>
            } />

            {/* Entreprise */}
            <Route path="/entreprise/dashboard" element={
              <ProtectedRoute allowedRoles={['entreprise']}>
                <DashboardEntreprise />
              </ProtectedRoute>
            } />

            {/* Gestionnaire */}
            <Route path="/gestionnaire/dashboard" element={
              <ProtectedRoute allowedRoles={['gestionnaire']}>
                <DashboardGestionnaire />
              </ProtectedRoute>
            } />
            <Route path="/gestionnaire/offres" element={
              <ProtectedRoute allowedRoles={['gestionnaire']}>
                <OffresGestionnairePage />
              </ProtectedRoute>
            } />
            <Route path="/gestionnaire/offres/nouvelle" element={
              <ProtectedRoute allowedRoles={['gestionnaire']}>
                <NouvelleOffrePage />
              </ProtectedRoute>
            } />
            <Route path="/gestionnaire/candidatures" element={
              <ProtectedRoute allowedRoles={['gestionnaire']}>
                <CandidaturesGestionnairePage />
              </ProtectedRoute>
            } />
            <Route path="/gestionnaire/entreprises" element={
              <ProtectedRoute allowedRoles={['gestionnaire']}>
                <EntreprisesPage />
              </ProtectedRoute>
            } />
            <Route path="/gestionnaire/entreprises/nouvelle" element={
              <ProtectedRoute allowedRoles={['gestionnaire']}>
                <NouvelleEntreprisePage />
              </ProtectedRoute>
            } />
            <Route path="/gestionnaire/stats" element={
              <ProtectedRoute allowedRoles={['gestionnaire']}>
                <StatsPage />
              </ProtectedRoute>
            } />

            {/* Messages (shared) */}
            <Route path="/messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

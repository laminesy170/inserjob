import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, MapPin, Phone } from 'lucide-react'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { SkeletonList } from '@/components/UI/SkeletonCard'
import { EmptyState } from '@/components/UI/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Entreprise } from '@/types'

export function EntreprisesPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.structure_id) return
    supabase
      .from('entreprises')
      .select('*')
      .eq('structure_id', profile.structure_id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setEntreprises((data ?? []) as Entreprise[])
        setLoading(false)
      })
  }, [profile?.structure_id])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
        <Button onClick={() => navigate('/gestionnaire/entreprises/nouvelle')}>
          <Plus size={18} aria-hidden="true" />
          Ajouter
        </Button>
      </div>

      {loading ? (
        <SkeletonList count={4} />
      ) : entreprises.length === 0 ? (
        <EmptyState
          title="Aucune entreprise"
          description="Ajoutez vos entreprises partenaires"
          actionLabel="Ajouter une entreprise"
          onAction={() => navigate('/gestionnaire/entreprises/nouvelle')}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {entreprises.map((e) => (
            <Card key={e.id} className="p-4" onClick={() => navigate(`/gestionnaire/entreprises/${e.id}`)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {e.logo_url ? (
                    <img src={e.logo_url} alt="" className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <Building2 size={20} className="text-primary-500" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{e.nom}</h3>
                  {e.secteur && <p className="text-xs text-gray-500">{e.secteur}</p>}
                  <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-400">
                    {e.ville && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} aria-hidden="true" />
                        {e.ville}
                      </span>
                    )}
                    {e.contact_telephone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} aria-hidden="true" />
                        {e.contact_telephone}
                      </span>
                    )}
                  </div>
                  {e.siret && <p className="text-xs text-gray-300 mt-1">SIRET: {e.siret}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
